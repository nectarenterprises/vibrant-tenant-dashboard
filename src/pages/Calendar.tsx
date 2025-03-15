
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Calendar</h1>
        
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl">
          <CalendarIcon className="h-16 w-16 text-tenant-green mb-4" />
          <p className="text-lg text-muted-foreground">Calendar section coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
