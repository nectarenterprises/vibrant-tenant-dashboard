
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <div className="bg-tenant-darkGreen text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to simplify your property experience?
        </h2>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
          Join thousands of tenants and occupiers who save time and reduce stress with SweetLease.
        </p>
        <Button size="lg" variant="secondary" asChild className="gap-2">
          <Link to="/auth?tab=register">
            Get Started Today <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CTASection;
