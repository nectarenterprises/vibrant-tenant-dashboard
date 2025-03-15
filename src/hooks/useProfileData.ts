
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { ProfileData } from '@/types/profile';
import { logActivity } from '@/services/ActivityLogService';

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (formData: { firstName: string; lastName: string }) => {
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
      setProfile((prev) => prev ? {
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
      } : null);

      // Log this activity
      await logActivity({
        action: 'profile_update',
        entityType: 'user',
        entityId: user?.id,
        details: { updatedFields: ['first_name', 'last_name'] }
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: 'There was a problem updating your profile.',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  return {
    profile,
    isLoading,
    updateProfile
  };
};
