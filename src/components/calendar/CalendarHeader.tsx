
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'list';
  setView: (view: 'month' | 'list') => void;
  prevMonth: () => void;
  nextMonth: () => void;
  today: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  setView,
  prevMonth,
  nextMonth,
  today
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <div className="flex items-center space-x-2">
        <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'list')} className="mr-2">
          <TabsList>
            <TabsTrigger value="month"><LayoutGrid className="h-4 w-4 mr-1" /> Month</TabsTrigger>
            <TabsTrigger value="list"><List className="h-4 w-4 mr-1" /> List</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={today}>Today</Button>
          <Button variant="outline" size="sm" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
