
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth, isEqual } from 'date-fns';
import { EventData } from '@/types/property';

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

export default CalendarGrid;
