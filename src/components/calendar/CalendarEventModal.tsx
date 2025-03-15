
import React from 'react';
import { format } from 'date-fns';
import { EventData } from '@/types/property';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CalendarEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({ 
  event, 
  isOpen, 
  onClose 
}) => {
  if (!event) return null;
  
  // Get badge color based on event type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inspection':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {format(new Date(event.date), 'PPP')}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {event.propertyName && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start"
            >
              <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Property</div>
                <div className="text-sm text-muted-foreground">{event.propertyName}</div>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start"
          >
            <Tag className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium">Event Type</div>
              <Badge variant="outline" className={`mt-1 ${getBadgeColor(event.type)}`}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start"
          >
            <Clock className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium">Date</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(event.date), 'PPPP')}
              </div>
            </div>
          </motion.div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventModal;
