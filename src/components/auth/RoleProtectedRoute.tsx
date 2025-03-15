
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole, UserRole } from '@/contexts/RoleContext';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'standard',
  fallbackPath = '/' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  const location = useLocation();
  
  // Show loading state while checking auth and roles
  if (authLoading || roleLoading) {
    return (
      <div className="flex flex-col gap-4 w-full p-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If doesn't have required role, redirect to fallback page
  if (!hasRole(requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If authenticated and has required role, render the protected content
  return <>{children}</>;
};

export default RoleProtectedRoute;
