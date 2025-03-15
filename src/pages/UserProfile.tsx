
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { User, UserCog, Edit2, Save, X } from 'lucide-react';
import { logActivity } from '@/services/ActivityLogService';

const UserProfile = () => {
  const { user } = useAuth();
  const { roles, isAdmin } = useRole();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      // Get profile from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means "No rows returned", which we handle below
        throw error;
      }

      // If we got data, use it
      if (data) {
        setProfile({
          id: data.id,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user?.email || '',
        });

        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
        });
      } else {
        // If no profile found, create one with user metadata
        const firstName = user?.user_metadata?.first_name || '';
        const lastName = user?.user_metadata?.last_name || '';
        
        // Try to insert profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            first_name: firstName,
            last_name: lastName
          });
          
        if (insertError) throw insertError;
        
        // Set local state
        setProfile({
          id: user?.id || '',
          firstName,
          lastName,
          email: user?.email || '',
        });
        
        setFormData({
          firstName,
          lastName,
        });
        
        toast({
          title: 'Profile created',
          description: 'Your profile has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error loading profile',
        description: 'There was a problem loading your profile.',
      });
      // Fallback to at least showing email if profile can't be loaded
      if (user) {
        const firstName = user?.user_metadata?.first_name || '';
        const lastName = user?.user_metadata?.last_name || '';
        
        setProfile({
          id: user.id,
          firstName,
          lastName,
          email: user.email || '',
        });
        
        setFormData({
          firstName,
          lastName,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state with new values
      setProfile((prev) => ({
        ...prev!,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }));

      // Log this activity
      await logActivity({
        action: 'profile_update',
        entityType: 'user',
        entityId: user?.id,
        details: { updatedFields: ['first_name', 'last_name'] }
      });

      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: 'There was a problem updating your profile.',
      });
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <User className="h-6 w-6 mr-2" />
            <h1 className="text-3xl font-bold">User Management</h1>
          </div>
          <TabsList>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            {isAdmin && <TabsTrigger value="management">User Management</TabsTrigger>}
          </TabsList>
        </div>

        <TabsContent value="profile" className="w-full">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                My Profile
              </CardTitle>
              <CardDescription>
                View and update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="bg-slate-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roles">Current Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {roles.map((role) => (
                        <div key={role} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-sm">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    {!isEditing ? (
                      <Button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={cancelEdit}
                          className="flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex items-center"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="management">
            <div className="mb-4">
              <p className="text-slate-500">
                As an administrator, you can manage user roles and permissions.
              </p>
            </div>
            {/* We'll include the UserManagement component for admins */}
            <div className="pt-4">
              <iframe 
                src="/users"
                className="w-full h-[calc(100vh-280px)] min-h-[500px] border border-slate-200 rounded-md"
                title="User Management"
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfile;
