
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const Landing = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-tenant-green">SweetLease</h1>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Log In
          </Button>
          <Button onClick={() => navigate('/auth?tab=register')}>
            Create Account
          </Button>
        </div>
      </header>

      <section className="container mx-auto py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Property Management <span className="text-tenant-green">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your leases, documents, and property finances all in one place. 
            SweetLease gives property owners and managers the tools they need to 
            stay organized and efficient.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate('/auth?tab=register')}
          >
            Get Started for Free
          </Button>
        </div>
        <div className="md:w-1/2">
          <img 
            src="/placeholder.svg" 
            alt="Property Management Dashboard" 
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Everything You Need to Manage Your Properties</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Lease Management</h3>
              <p className="text-gray-600">
                Store and manage all your lease agreements in one secure location.
                Track important dates, renewal deadlines, and tenant information.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Document Organization</h3>
              <p className="text-gray-600">
                Securely store and organize all property-related documents.
                Easy access to contracts, certificates, and important files.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Financial Tracking</h3>
              <p className="text-gray-600">
                Keep track of service charges, utilities, and other property expenses.
                Generate reports and analyze your property finances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-tenant-green text-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of property owners who are simplifying their property management with SweetLease.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-tenant-green"
            onClick={() => navigate('/auth?tab=register')}
          >
            Create Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold mb-4">SweetLease</h2>
              <p className="text-gray-400">
                Property management made simple
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-lg font-medium mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Testimonials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Resources</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SweetLease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
