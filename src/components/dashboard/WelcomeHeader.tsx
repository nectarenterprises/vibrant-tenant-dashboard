
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
  const { user } = useAuth();
  const displayName = userName || user?.email?.split('@')[0] || 'there';
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <h1 className="text-2xl font-bold tracking-tight">
      {getGreeting()}, <span className="text-primary">{displayName}</span>!
    </h1>
  );
};

export default WelcomeHeader;
