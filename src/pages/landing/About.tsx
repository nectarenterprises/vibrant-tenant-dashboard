
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import AboutSection from '@/components/landing/AboutSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavigation />
      <main>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-tenant-forestGreen to-tenant-sage bg-clip-text text-transparent mb-6">
              About SweetLease
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn about our mission to empower property occupiers with better tools and information.
            </p>
          </div>
        </div>
        
        <AboutSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default About;
