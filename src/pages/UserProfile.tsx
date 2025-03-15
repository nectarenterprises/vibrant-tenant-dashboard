
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { User, UserCog } from 'lucide-react';
import ProfileCard from '@/components/profile/ProfileCard';
import AdminSection from '@/components/profile/AdminSection';
import { useProfileData } from '@/hooks/useProfileData';

const UserProfile = () => {
  const { roles, isAdmin } = useRole();
  const { profile, isLoading, updateProfile } = useProfileData();

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
          {profile && (
            <ProfileCard 
              profile={profile} 
              roles={roles}
              onSave={updateProfile}
              isLoading={isLoading}
            />
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="management">
            <AdminSection />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfile;
