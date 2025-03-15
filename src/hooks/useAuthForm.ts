
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { logActivity } from '@/services/ActivityLogService';

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (formData: AuthFormData) => {
    const { email, password } = formData;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      // Log this activity
      await logActivity({
        action: 'user_login',
        entityType: 'auth',
        details: { email }
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (formData: AuthFormData) => {
    const { email, password, firstName, lastName } = formData;
    
    if (!firstName || !lastName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide your first and last name",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        if (data.session) {
          // User is automatically signed in - Supabase email confirmation is disabled
          toast({
            title: "Account created!",
            description: "Your account has been successfully created and you're now signed in.",
          });
          
          // Log this activity
          await logActivity({
            action: 'user_signup',
            entityType: 'auth',
            details: { email }
          });
          
          navigate('/');
        } else {
          // Email confirmation is enabled
          toast({
            title: "Account created!",
            description: "Please check your email to confirm your account before signing in.",
          });
        }
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSignIn,
    handleSignUp
  };
};
