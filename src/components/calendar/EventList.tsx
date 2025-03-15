
import React from 'react';
import { format } from 'date-fns';
import { EventData } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <p className="text-muted-foreground">No upcoming events</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sortedEvents.map((event, index) => (
        <motion.div 
          key={event.id}
          variants={item}
          custom={index}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
          }}
        >
          <Card className="overflow-hidden">
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
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EventList;
