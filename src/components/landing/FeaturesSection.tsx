
import React from 'react';
import { BarChart3, Calendar, FileText, Lock, MapPin, Users, WifiIcon } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-12 w-12 text-tenant-green" />,
    title: 'Document Management',
    description: 'Securely store and access all your tenancy-related documents in one place for quick reference.'
  },
  {
    icon: <MapPin className="h-12 w-12 text-tenant-purple" />,
    title: 'Property Details',
    description: 'Keep track of all the important information about your property and tenancy agreement.'
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-tenant-orange" />,
    title: 'Service Charge Visibility',
    description: 'Understand your service charges with detailed breakdowns and historical comparisons.'
  },
  {
    icon: <Lock className="h-12 w-12 text-tenant-teal" />,
    title: 'Secure Communication',
    description: 'Communicate securely with property management and keep records of all interactions.'
  },
  {
    icon: <WifiIcon className="h-12 w-12 text-tenant-chartGreen" />,
    title: 'Utility Tracking',
    description: 'Monitor your utility usage and costs to identify savings opportunities and track expenses.'
  },
  {
    icon: <Calendar className="h-12 w-12 text-tenant-purple" />,
    title: 'Important Dates',
    description: 'Never miss a rent payment, lease renewal, or other important dates with integrated reminders.'
  }
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent mb-4">
          Smart Features for Property Occupiers
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          SweetLease provides everything you need to manage your tenancy efficiently and stay informed.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
