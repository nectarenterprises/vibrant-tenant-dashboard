
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DetailedFeaturesSection from '@/components/landing/DetailedFeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavigation />
      <main>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-tenant-forestGreen to-tenant-sage bg-clip-text text-transparent mb-6">
              Features Designed for Property Occupiers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've built SweetLease to simplify property management for tenants and occupiers. 
              Discover how our features can help you stay organized and save time.
            </p>
          </div>
        </div>
        
        <FeaturesSection />
        <DetailedFeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Features;
