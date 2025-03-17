
import React from 'react';
import LandingNavigation from '@/components/landing/LandingNavigation';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Landing;
