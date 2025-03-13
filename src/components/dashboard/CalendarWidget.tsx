
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, Wrench, ClipboardCheck } from 'lucide-react';
import { EventData, Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarWidgetProps {
  events: EventData[];
  properties?: Property[];
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events, properties = [] }) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  
  // Filter events by selected property (if a property is selected)
  const filteredEvents = selectedPropertyId === "all" 
    ? events 
    : events.filter(event => event.propertyId === selectedPropertyId);
  
  // Sort events by date (closest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'rent':
        return <DollarSign className="h-5 w-5 text-tenant-gold" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-tenant-orange" />;
      case 'inspection':
        return <ClipboardCheck className="h-5 w-5 text-tenant-black" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-tenant-gold" />;
    }
  };

  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-tenant-gold/10 border-tenant-gold/20';
      case 'maintenance':
        return 'bg-tenant-orange/10 border-tenant-orange/20';
      case 'inspection':
        return 'bg-tenant-black/10 border-tenant-black/20';
      default:
        return 'bg-tenant-gold/10 border-tenant-gold/20';
    }
  };

  return (
    <Card className="h-full flex flex-col rounded-xl overflow-hidden card-gradient shadow-md border border-gray-100 dark:border-gray-800 animate-fade-in">
      <CardHeader className="p-4 mellow-gradient relative flex-shrink-0">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="flex justify-between items-center relative z-10">
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upcoming Events
          </h3>
          
          {properties.length > 0 && (
            <Select 
              value={selectedPropertyId} 
              onValueChange={setSelectedPropertyId}
            >
              <SelectTrigger className="w-[180px] h-8 bg-white/90 text-sm border-0">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full max-h-[calc(100%-1rem)]">
          <div className="p-4 space-y-3">
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
                    {event.propertyName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.propertyName}
                      </p>
                    )}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
