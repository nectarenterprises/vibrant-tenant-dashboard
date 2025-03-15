
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLogParams {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
}

/**
 * Logs a user activity
 * For demo purposes, this uses localStorage
 * In production, this would use the Supabase activity_logs table
 */
export const logActivity = async (params: ActivityLogParams): Promise<string> => {
  const { action, entityType, entityId, details } = params;
  
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Create log entry
    const logEntry = {
      id: uuidv4(),
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
      created_at: new Date().toISOString(),
    };
    
    // In a real app, we would insert into the activity_logs table
    // Since we're using localStorage for demo, store as array
    const existingLogs = localStorage.getItem('activity_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(logEntry);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
    
    console.log('Activity logged:', logEntry);
    
    return logEntry.id;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

/**
 * Gets recent activity logs for the current user
 * For demo purposes, this uses localStorage
 * In production, this would query the Supabase activity_logs table
 */
export const getRecentActivityLogs = async (limit = 10): Promise<any[]> => {
  try {
    // Get logs from localStorage
    const existingLogs = localStorage.getItem('activity_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    
    // Sort by created_at desc and limit
    return logs
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting activity logs:', error);
    return [];
  }
};
