
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthCard from '@/components/auth/AuthCard';
import { useAuthForm } from '@/hooks/useAuthForm';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, handleSignIn, handleSignUp } = useAuthForm();

  useEffect(() => {
    // Check URL for tab parameter
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
    
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <AuthCard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        handleSignIn={handleSignIn}
        handleSignUp={handleSignUp}
      />
    </div>
  );
};

export default Auth;
