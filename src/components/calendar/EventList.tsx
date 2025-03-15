
import React from 'react';
import { format } from 'date-fns';
import { EventData } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventListProps {
  events: EventData[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
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
          <div className={`h-2 ${event.type === 'rent' ? 'bg-green-500' : 
            event.type === 'maintenance' ? 'bg-orange-500' : 
            event.type === 'inspection' ? 'bg-blue-500' : 'bg-gray-500'}`} />
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{event.propertyName}</p>
              </div>
              <Badge variant="outline">{format(new Date(event.date), 'PP')}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
