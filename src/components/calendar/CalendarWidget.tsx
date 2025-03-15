
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventData } from '@/types/property';
import { CalendarIcon, HomeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalendarWidgetProps {
  events: EventData[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'rent': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-amber-100 text-amber-800';
      case 'inspection': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <div className="space-y-4">
            {sortedEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                <div className="min-w-16 text-center">
                  <div className="text-sm font-semibold">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    {event.propertyName && (
                      <div className="flex items-center mr-2">
                        <HomeIcon className="mr-1 h-3 w-3" />
                        <span>{event.propertyName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={getEventTypeColor(event.type)} variant="outline">
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No upcoming events
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
