
import { supabase } from '@/integrations/supabase/client';

type EntityType = 'property' | 'document' | 'service_charge' | 'user' | 'compliance' | 'utility';

export interface ActivityLogParams {
  action: string;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: EntityType;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

// In a real implementation, this would use the actual database
export const logActivity = async ({
  action,
  entityType,
  entityId,
  details
}: ActivityLogParams): Promise<string | null> => {
  try {
    // Get the current authenticated user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    
    if (!userId) {
      console.error('No authenticated user found when trying to log activity');
      return null;
    }
    
    // Create a log entry
    const logId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      id: logId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || null,
      created_at: timestamp
    };
    
    // Store in localStorage for demo purposes
    const existingLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    existingLogs.push(logEntry);
    localStorage.setItem('activity_logs', JSON.stringify(existingLogs));
    
    return logId;
  } catch (error) {
    console.error('Error in logActivity function:', error);
    return null;
  }
};

export const fetchActivityLogs = async (limit = 50, offset = 0) => {
  try {
    // Simulate fetching from database with localStorage
    const storedLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    
    // Sort by created_at in descending order (newest first)
    const sortedLogs = storedLogs.sort((a: ActivityLog, b: ActivityLog) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    // Apply pagination
    const paginatedLogs = sortedLogs.slice(offset, offset + limit);
    
    // Simulate joining with profiles
    const logsWithProfiles = await Promise.all(paginatedLogs.map(async (log: ActivityLog) => {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', log.user_id)
        .single();
        
      return {
        ...log,
        profiles: profile
      };
    }));
    
    return { logs: logsWithProfiles, error: null };
  } catch (error) {
    console.error('Error in fetchActivityLogs function:', error);
    return { logs: [], error };
  }
};
