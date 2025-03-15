
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
        
        // If there are no stored roles, default to 'standard'
        // For testing purposes, let's make the current user an admin
        let userRoles: UserRole[];
        if (!storedRoles) {
          // For demo, set first user as admin
          userRoles = ['admin', 'standard'];
          localStorage.setItem(`user_roles_${user.id}`, JSON.stringify(userRoles));
        } else {
          userRoles = JSON.parse(storedRoles) as UserRole[];
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
