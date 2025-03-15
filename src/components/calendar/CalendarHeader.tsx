
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold">Calendar</h1>
      <div className="flex items-center space-x-2">
        <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'list')} className="mr-2">
          <TabsList>
            <TabsTrigger value="month">
              <motion.div 
                className="flex items-center" 
                whileTap={{ scale: 0.95 }}
              >
                <LayoutGrid className="h-4 w-4 mr-1" /> Month
              </motion.div>
            </TabsTrigger>
            <TabsTrigger value="list">
              <motion.div 
                className="flex items-center" 
                whileTap={{ scale: 0.95 }}
              >
                <List className="h-4 w-4 mr-1" /> List
              </motion.div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={today}>Today</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarHeader;
