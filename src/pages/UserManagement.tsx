import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/contexts/RoleContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, Users, User } from 'lucide-react';
import { logActivity } from '@/services/ActivityLogService';

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: UserRole[];
}

const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users with their roles
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Get all currently authenticated users - in a real scenario, this would be
      // properly handled through a secure admin API
      const { data: session } = await supabase.auth.getSession();
      
      // Simulate roles from localStorage
      const combinedUsers: UserData[] = profiles.map((profile: any) => {
        // In a real app, this would come from a secure API
        const storedRoles = localStorage.getItem(`user_roles_${profile.id}`);
        const roles = storedRoles ? JSON.parse(storedRoles) as UserRole[] : ['standard'];
        
        return {
          id: profile.id,
          email: profile.id === session?.session?.user.id ? session.session.user.email : "user@example.com",
          firstName: profile.first_name,
          lastName: profile.last_name,
          roles: roles
        };
      });

      return combinedUsers;
    }
  });

  // Mutation to update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: UserRole; action: 'add' | 'remove' }) => {
      // Get current roles
      const storedRoles = localStorage.getItem(`user_roles_${userId}`);
      let roles: UserRole[] = storedRoles ? JSON.parse(storedRoles) : ['standard'];
      
      if (action === 'add') {
        if (!roles.includes(role)) {
          roles.push(role);
        }
        
        // Log activity
        await logActivity({
          action: 'assign_role',
          entityType: 'user',
          entityId: userId,
          details: { role }
        });
      } else {
        roles = roles.filter(r => r !== role);
        if (roles.length === 0) {
          roles = ['standard']; // Ensure user always has at least one role
        }
        
        // Log activity
        await logActivity({
          action: 'remove_role',
          entityType: 'user',
          entityId: userId,
          details: { role }
        });
      }
      
      // Save updated roles
      localStorage.setItem(`user_roles_${userId}`, JSON.stringify(roles));
      
      return roles;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Role updated',
        description: 'User role has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating role',
        description: error.message || 'Something went wrong.',
      });
    }
  });

  // Function to handle role change
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Get the current user's roles
    const user = users?.find(u => u.id === userId);
    if (!user) return;

    // If user already has this role, remove it
    if (user.roles.includes(newRole)) {
      // Don't allow removing the last role
      if (user.roles.length <= 1) {
        toast({
          variant: 'destructive',
          title: 'Cannot remove role',
          description: 'Users must have at least one role.',
        });
        return;
      }
      updateRoleMutation.mutate({ userId, role: newRole, action: 'remove' });
    } else {
      // Otherwise add the role
      updateRoleMutation.mutate({ userId, role: newRole, action: 'add' });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-600">Error loading users: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Users className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users?.map(user => (
          <Card key={user.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                {user.firstName} {user.lastName || ''}
              </CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    User Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['admin', 'standard', 'viewer'].map((role) => (
                      <Button
                        key={role}
                        variant={user.roles.includes(role as UserRole) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRoleChange(user.id, role as UserRole)}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
