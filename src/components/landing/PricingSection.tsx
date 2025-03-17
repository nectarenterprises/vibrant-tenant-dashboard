
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Using the same subscription plans as the Billing page
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'For small property portfolios',
    price: '$29',
    interval: 'month',
    features: [
      'Up to 5 properties',
      'Document storage',
      'Basic reporting',
      'Email support',
    ],
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing property portfolios',
    price: '$79',
    interval: 'month',
    features: [
      'Up to 20 properties',
      'Advanced document intelligence',
      'Comprehensive reporting',
      'Utility bill analysis',
      'Service charge management',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large property portfolios',
    price: '$199',
    interval: 'month',
    features: [
      'Unlimited properties',
      'Custom integrations',
      'Advanced analytics',
      'Dedicated account manager',
      'White-labeling options',
      '24/7 phone support',
    ],
    isPopular: false,
  },
];

const PricingSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative rounded-xl overflow-hidden border ${plan.isPopular ? 'border-primary shadow-lg' : 'border-border'} bg-card transition-all duration-200 hover:shadow-md`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                POPULAR
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground mt-2">{plan.description}</p>
              
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              
              <Button 
                size="lg" 
                className="w-full" 
                variant={plan.isPopular ? "default" : "outline"}
                asChild
              >
                <Link to="/auth?tab=register">
                  Get Started
                </Link>
              </Button>
              
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-tenant-green shrink-0 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto mt-20 text-center p-8 rounded-xl border border-border bg-card/50">
        <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
        <p className="text-muted-foreground mb-6">
          We offer tailored plans for property management companies and large-scale occupiers with specific needs.
        </p>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
};

export default PricingSection;
