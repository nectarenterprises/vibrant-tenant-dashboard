
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth, isEqual } from 'date-fns';
import { EventData } from '@/types/property';
import { motion } from 'framer-motion';

interface CalendarGridProps {
  currentDate: Date;
  events: EventData[];
  getEventColor: (type: string) => string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, getEventColor }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Getting events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isEqual(
        new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()),
        new Date(day.getFullYear(), day.getMonth(), day.getDate())
      );
    });
  };
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const calendarHeader = {
    hidden: { opacity: 0, y: -20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.3 }
    }
  };

  return (
    <div>
      <motion.div 
        className="grid grid-cols-7 gap-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <motion.div
            key={day}
            variants={calendarHeader} 
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </motion.div>
        ))}
        
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <motion.div 
            key={`empty-start-${index}`}
            variants={item} 
            className="p-2 border bg-gray-50/50"
          ></motion.div>
        ))}
        
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <motion.div
              key={day.toString()}
              variants={item}
              whileHover={{ scale: 1.02 }}
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
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.1 + (idx * 0.1) }
                    }}
                    whileHover={{ scale: 1.05 }}
                    className={`text-xs truncate p-1 rounded cursor-pointer ${getEventColor(event.type)}`}
                    title={event.title}
                  >
                    {event.title}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.4 }
                    }}
                    className="text-xs text-center text-gray-500"
                  >
                    +{dayEvents.length - 3} more
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CalendarGrid;
