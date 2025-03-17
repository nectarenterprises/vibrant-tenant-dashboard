import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Index } from './pages/Index';
import { Leases } from './pages/Leases';
import { Documents } from './pages/Documents';
import { DocumentCategory } from './pages/DocumentCategory';
import { Billing } from './pages/Billing';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import About from './pages/Landing/About';
import Features from './pages/Landing/Features';
import Pricing from './pages/Landing/Pricing';
import ServiceChargeComparison from './pages/ServiceChargeComparison';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Check if the user is logged in
    if (!currentUser) {
      console.log('User not logged in, redirecting to /auth');
    }
  }, [currentUser]);

  if (!currentUser) {
    // Redirect to the auth page if not authenticated
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/landing/about" element={<About />} />
          <Route path="/landing/features" element={<Features />} />
          <Route path="/landing/pricing" element={<Pricing />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/leases" element={<Leases />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/:category" element={<DocumentCategory />} />
            <Route path="/service-charge" element={<ServiceChargeComparison />} />
            <Route path="/service-charge/:propertyId" element={<ServiceChargeComparison />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
