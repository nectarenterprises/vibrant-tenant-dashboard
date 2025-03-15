
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define role types
export type UserRole = 'admin' | 'standard' | 'viewer';

type RoleContextType = {
  roles: UserRole[];
  isAdmin: boolean;
  isStandard: boolean;
  isViewer: boolean;
  hasRole: (role: UserRole) => boolean;
  loading: boolean;
  error: Error | null;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // For demo purposes, we'll use local storage to simulate user roles
        // In production, this would come from Supabase user_roles table
        const storedRoles = localStorage.getItem(`user_roles_${user.id}`);
        
        // If there are no stored roles, default to 'standard' for new users
        let userRoles: UserRole[];
        if (!storedRoles) {
          // Set all new users to standard role by default
          userRoles = ['standard'];
          
          // For demo, set the first user as admin
          const isFirstUser = !localStorage.getItem('has_admin_user');
          if (isFirstUser) {
            userRoles = ['admin', 'standard'];
            localStorage.setItem('has_admin_user', 'true');
          }
          
          localStorage.setItem(`user_roles_${user.id}`, JSON.stringify(userRoles));
        } else {
          const parsedRoles = JSON.parse(storedRoles);
          // Ensure we have valid UserRole types
          userRoles = parsedRoles.filter((role: string) => 
            ['admin', 'standard', 'viewer'].includes(role)
          ) as UserRole[];
          
          // Ensure there's at least one role
          if (userRoles.length === 0) userRoles = ['standard'];
        }
        
        setRoles(userRoles);
      } catch (err) {
        console.error('Error fetching user roles:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user roles'));
        // Fallback to standard role
        setRoles(['standard']);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const value = {
    roles,
    isAdmin: hasRole('admin'),
    isStandard: hasRole('standard') || hasRole('admin'),
    isViewer: hasRole('viewer') || hasRole('standard') || hasRole('admin'),
    hasRole,
    loading,
    error
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
