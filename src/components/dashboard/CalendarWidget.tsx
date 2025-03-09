
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Tool, ClipboardCheck } from 'lucide-react';
import { EventData } from '@/types/property';
import { cn } from '@/lib/utils';

interface CalendarWidgetProps {
  events: EventData[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events }) => {
  // Sort events by date (closest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rent':
        return <DollarSign className="h-5 w-5 text-tenant-green" />;
      case 'maintenance':
        return <Tool className="h-5 w-5 text-tenant-orange" />;
      case 'inspection':
        return <ClipboardCheck className="h-5 w-5 text-tenant-teal" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-tenant-purple" />;
    }
  };

  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-tenant-green/10 border-tenant-green/20';
      case 'maintenance':
        return 'bg-tenant-orange/10 border-tenant-orange/20';
      case 'inspection':
        return 'bg-tenant-teal/10 border-tenant-teal/20';
      default:
        return 'bg-tenant-purple/10 border-tenant-purple/20';
    }
  };

  return (
    <div className="rounded-xl overflow-hidden card-gradient shadow-md border border-gray-100 dark:border-gray-800 animate-fade-in h-full">
      <div className="bg-gradient-to-r from-tenant-teal to-tenant-purple p-4">
        <h3 className="text-white font-bold text-lg flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Upcoming Events
        </h3>
      </div>
      
      <div className="p-4 space-y-4 max-h-[320px] overflow-y-auto">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => (
            <div 
              key={event.id}
              className={cn(
                "p-3 rounded-lg border flex items-start gap-3",
                getEventColor(event.type),
                index === 0 ? "animate-pulse-gentle" : ""
              )}
            >
              <div className="mt-0.5">
                {getEventIcon(event.type)}
              </div>
              <div>
                <h4 className="font-medium text-sm">{event.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
