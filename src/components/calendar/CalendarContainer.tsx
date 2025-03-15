
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

const CalendarContainer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [view, setView] = useState<'month' | 'list'>('month');

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

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

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
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
              <EventBadges />
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              view === 'month' ? 
                <CalendarGrid 
                  currentDate={currentDate} 
                  events={events} 
                  getEventColor={getEventColor} 
                /> : 
                <EventList events={events} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarContainer;
