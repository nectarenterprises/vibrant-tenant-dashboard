
import { supabase } from '@/integrations/supabase/client';
import { EventData } from '@/types/property';
import { getMockCalendarEvents, getMockPropertyEvents } from './calendar-events-mock';

/**
 * Get all calendar events for the current user
 */
export const getCalendarEvents = async (): Promise<EventData[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  // Since the actual calendar_events table doesn't exist yet, use mock data
  return getMockCalendarEvents(user.user.id);
};

/**
 * Get events for a specific property
 */
export const getPropertyEvents = async (propertyId: string): Promise<EventData[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  // Since the actual calendar_events table doesn't exist yet, use mock data
  return getMockPropertyEvents(propertyId);
};

/**
 * Add a new calendar event
 */
export const addCalendarEvent = async (event: Partial<EventData>): Promise<EventData> => {
  // Since the actual calendar_events table doesn't exist yet, return a mock response
  return {
    id: uuidv4(),
    title: event.title || 'New Event',
    date: event.date || new Date().toISOString(),
    type: event.type || 'other',
    propertyId: event.propertyId,
    propertyName: event.propertyName
  };
};

/**
 * Update a calendar event
 */
export const updateCalendarEvent = async (eventId: string, eventData: Partial<EventData>): Promise<EventData> => {
  if (!eventId) throw new Error('Event ID is required');
  
  // Since the actual calendar_events table doesn't exist yet, return a mock response
  return {
    id: eventId,
    title: eventData.title || 'Updated Event',
    date: eventData.date || new Date().toISOString(),
    type: eventData.type || 'other',
    propertyId: eventData.propertyId,
    propertyName: eventData.propertyName
  };
};

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  if (!eventId) throw new Error('Event ID is required');
  
  // Since the actual calendar_events table doesn't exist yet, just log the deletion
  console.log(`Event ${eventId} would be deleted`);
};

// Helper function to generate UUIDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
