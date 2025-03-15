
import React, { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isEqual, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchPropertyEvents } from '@/services/property/PropertyFetchService';
import { EventData } from '@/types/property';

const CalendarPage = () => {
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
    const eventDate = parseISO(event.date);
    return eventDate >= monthStart && eventDate <= monthEnd;
  });

  // Getting events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isEqual(
        new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()),
        new Date(day.getFullYear(), day.getMonth(), day.getDate())
      );
    });
  };

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

  // Render calendar day cells
  const renderDays = () => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} className="p-2 border bg-gray-50/50"></div>
        ))}
        
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toString()}
              className={`
                min-h-[100px] p-2 border relative
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50/50 text-gray-400'}
                ${isCurrentDay ? 'ring-2 ring-primary ring-inset' : ''}
              `}
            >
              <div className="text-right mb-1">
                <span className={`text-sm ${isCurrentDay ? 'font-bold text-primary' : ''}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className={`text-xs truncate p-1 rounded cursor-pointer ${getEventColor(event.type)}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center text-gray-500">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render list view of events
  const renderEventsList = () => {
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedEvents.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No upcoming events</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className={`h-2 ${event.type === 'rent' ? 'bg-green-500' : event.type === 'maintenance' ? 'bg-orange-500' : event.type === 'inspection' ? 'bg-blue-500' : 'bg-gray-500'}`} />
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.propertyName}</p>
                </div>
                <Badge variant="outline">{format(parseISO(event.date), 'PP')}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen container mx-auto p-6">
      <div className="flex flex-col">
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
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
              <div className="flex flex-wrap space-x-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Rent</Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">Maintenance</Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Inspection</Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Other</Badge>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              view === 'month' ? renderDays() : renderEventsList()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
