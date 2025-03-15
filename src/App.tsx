
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import { supabase } from './integrations/supabase/client';
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
import Sidebar from './components/layout/Sidebar';

function App() {
  const { session, user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // We don't need this effect anymore since useAuth already handles the session
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !session && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [loading, session, navigate, location]);

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

  // We're removing the sidebar from individual pages and adding it globally here
  return (
    <div className="min-h-screen bg-background text-foreground">
      {session && <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
      
      <div className={`transition-all duration-300 ease-in-out ${session ? (sidebarCollapsed ? "ml-20" : "ml-64") : ""}`}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/leases" element={<ProtectedRoute><Leases /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/documents/category/:category" element={<ProtectedRoute><DocumentCategory /></ProtectedRoute>} />
          <Route path="/service-charge" element={<ProtectedRoute><ServiceCharge /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path="/utilities" element={<ProtectedRoute><Utilities /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
