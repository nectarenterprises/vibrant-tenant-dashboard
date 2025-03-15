
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EventData } from '@/types/property';
import { fetchPropertyEvents } from '@/services/property/PropertyFetchService';
import CalendarHeader from './CalendarHeader';
import EventBadges from './EventBadges';
import CalendarGrid from './CalendarGrid';
import EventList from './EventList';
import { AnimatePresence, motion } from 'framer-motion';

const CalendarContainer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const propertyEvents = await fetchPropertyEvents();
        setEvents(propertyEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const today = () => {
    const now = new Date();
    setDirection(currentDate > now ? -1 : 1);
    setCurrentDate(now);
  };

  // Filter events for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= monthStart && eventDate <= monthEnd;
  });

  // Get event badge color based on type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'inspection':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  // View change animation variants
  const viewVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen container mx-auto p-6">
      <div className="flex flex-col">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          setView={setView}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          today={today}
        />
        
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <motion.h2 
                key={format(currentDate, 'MMMM-yyyy')}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xl font-bold"
              >
                {format(currentDate, 'MMMM yyyy')}
              </motion.h2>
              <EventBadges />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {view === 'month' ? (
                  <motion.div
                    key="month-view"
                    custom={direction}
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.3 
                    }}
                  >
                    <motion.div
                      key={format(currentDate, 'yyyy-MM')}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        duration: 0.3 
                      }}
                    >
                      <CalendarGrid 
                        currentDate={currentDate} 
                        events={events} 
                        getEventColor={getEventColor} 
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list-view"
                    variants={viewVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.3 
                    }}
                  >
                    <EventList events={events} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarContainer;
