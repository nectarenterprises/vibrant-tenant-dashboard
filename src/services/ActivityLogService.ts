
import { supabase } from '@/integrations/supabase/client';

type EntityType = 'property' | 'document' | 'service_charge' | 'user' | 'compliance' | 'utility';

export interface ActivityLogParams {
  action: string;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
}

export const logActivity = async ({
  action,
  entityType,
  entityId,
  details
}: ActivityLogParams): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc(
      'log_activity',
      {
        _action: action,
        _entity_type: entityType,
        _entity_id: entityId || null,
        _details: details ? details : null
      }
    );

    if (error) {
      console.error('Error logging activity:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in logActivity function:', error);
    return null;
  }
};

export const fetchActivityLogs = async (limit = 50, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        created_at,
        profiles:user_id (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return { logs: [], error };
    }

    return { logs: data, error: null };
  } catch (error) {
    console.error('Error in fetchActivityLogs function:', error);
    return { logs: [], error };
  }
};
