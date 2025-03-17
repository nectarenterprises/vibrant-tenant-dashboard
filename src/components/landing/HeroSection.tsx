
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-tenant-forestGreen to-tenant-sage bg-clip-text text-transparent">
            Simplified Property Management for Occupiers & Tenants
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Manage your tenancy, documents, and service charges all in one place.
            Save time and streamline your experience with SweetLease.
          </p>
          
          <div className="space-y-3 py-4">
            {[
              'Centralized document management',
              'Service charge tracking and analysis',
              'Utility usage monitoring',
              'Calendar for important dates',
              'Easy communication tools'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-tenant-green" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/auth?tab=register" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className="relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Dashboard preview" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-tenant-green/10 to-transparent"></div>
          </div>
          <div className="absolute -z-10 -bottom-6 -right-6 h-72 w-72 bg-tenant-mint/30 rounded-full blur-3xl"></div>
          <div className="absolute -z-10 -top-6 -left-6 h-72 w-72 bg-tenant-sage/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
