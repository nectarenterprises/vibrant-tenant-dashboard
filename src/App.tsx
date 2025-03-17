
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import { useAuth } from './contexts/AuthContext';

import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Leases from './pages/Leases';
import Documents from './pages/Documents';
import DocumentCategory from './pages/DocumentCategory';
import ServiceCharge from './pages/ServiceCharge';
import Compliance from './pages/Compliance';
import Utilities from './pages/Utilities';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import Landing from './pages/Landing';
import Features from './pages/landing/Features';
import Pricing from './pages/landing/Pricing';
import About from './pages/landing/About';
import Sidebar from './components/layout/Sidebar';

function App() {
  const { session, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // We don't need this effect anymore since useAuth already handles the session
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !session && location.pathname !== '/auth' && !isPublicRoute(location.pathname)) {
      navigate('/auth');
    }
  }, [loading, session, navigate, location]);

  const isPublicRoute = (path: string) => {
    return ['/features', '/pricing', '/about'].includes(path);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!loading && !session) {
      return null;
    }

    return <>{children}</>;
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  // Determine if we should show the sidebar - show it for authenticated users except on public routes
  // The root path (/) should show the sidebar if the user is authenticated
  const showSidebar = session && (!isPublicRoute(location.pathname) || location.pathname === '/');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Show sidebar for authenticated users and non-public routes */}
      {showSidebar && (
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      )}
      
      <main className={`transition-all duration-300 ease-in-out ${showSidebar ? (sidebarCollapsed ? "md:ml-20" : "md:ml-64") : ""}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={!session ? <Landing /> : <Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          
          {/* Protected routes */}
          <Route path="/leases" element={<ProtectedRoute><Leases /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/documents/:propertyId/:category" element={<ProtectedRoute><DocumentCategory /></ProtectedRoute>} />
          <Route path="/service-charge" element={<ProtectedRoute><ServiceCharge /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path="/utilities" element={<ProtectedRoute><Utilities /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Toaster />
    </div>
  );
}

export default App;
