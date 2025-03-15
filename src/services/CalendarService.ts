
import { supabase } from '@/integrations/supabase/client';
import { EventData } from '@/types/property';

/**
 * Get all calendar events for the current user
 */
export const getCalendarEvents = async (): Promise<EventData[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*, properties!inner(user_id, name)')
    .eq('properties.user_id', user.user.id);
    
  if (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error('Failed to fetch calendar events');
  }
  
  // Format the data to include propertyName
  const formattedData = data?.map(event => ({
    ...event,
    propertyName: event.properties?.name
  })) || [];
  
  return formattedData;
};

/**
 * Get events for a specific property
 */
export const getPropertyEvents = async (propertyId: string): Promise<EventData[]> => {
  if (!propertyId) throw new Error('Property ID is required');
  
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*, properties!inner(name)')
    .eq('property_id', propertyId);
    
  if (error) {
    console.error('Error fetching property events:', error);
    throw new Error('Failed to fetch property events');
  }
  
  // Format the data to include propertyName
  const formattedData = data?.map(event => ({
    ...event,
    propertyName: event.properties?.name
  })) || [];
  
  return formattedData;
};

/**
 * Add a new calendar event
 */
export const addCalendarEvent = async (event: Partial<EventData>): Promise<EventData> => {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([event])
    .select()
    .single();
    
  if (error) {
    console.error('Error adding calendar event:', error);
    throw new Error('Failed to add calendar event');
  }
  
  return data;
};

/**
 * Update a calendar event
 */
export const updateCalendarEvent = async (eventId: string, eventData: Partial<EventData>): Promise<EventData> => {
  if (!eventId) throw new Error('Event ID is required');
  
  const { data, error } = await supabase
    .from('calendar_events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating calendar event:', error);
    throw new Error('Failed to update calendar event');
  }
  
  return data;
};

/**
 * Delete a calendar event
 */
export const deleteCalendarEvent = async (eventId: string): Promise<void> => {
  if (!eventId) throw new Error('Event ID is required');
  
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', eventId);
    
  if (error) {
    console.error('Error deleting calendar event:', error);
    throw new Error('Failed to delete calendar event');
  }
};
