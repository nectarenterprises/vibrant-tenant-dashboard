
import React from 'react';
import { format } from 'date-fns';

interface WelcomeHeaderProps {
  userName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName }) => {
  const today = new Date();
  const formattedDate = format(today, 'd MMMM yyyy');
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-tenant-purple to-tenant-teal bg-clip-text text-transparent">
          Welcome, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">{formattedDate}</p>
      </div>
      <div className="mt-4 md:mt-0 bg-tenant-soft-blue/20 rounded-lg px-4 py-2 border border-tenant-soft-blue/30">
        <p className="text-sm text-tenant-teal font-medium">Your dashboard is up to date</p>
      </div>
    </div>
  );
};

export default WelcomeHeader;
