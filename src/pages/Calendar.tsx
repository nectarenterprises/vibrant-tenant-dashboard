
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';

const Calendar = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out overflow-hidden",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <AuroraBackground showRadialGradient={false} className="p-6">
          <div className="container mx-auto glass-morphism p-8 rounded-xl">
            <h1 className="text-3xl font-bold mb-6">Calendar</h1>
            
            <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-xl">
              <CalendarIcon className="h-16 w-16 text-tenant-green mb-4" />
              <p className="text-lg text-muted-foreground">Calendar section coming soon</p>
            </div>
          </div>
        </AuroraBackground>
      </main>
    </div>
  );
};

export default Calendar;
