
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavigation />
      <main>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-tenant-forestGreen to-tenant-sage bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that works best for your needs. 
              All plans include core features to help you manage your property experience.
            </p>
          </div>
        </div>
        
        <PricingSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Pricing;
