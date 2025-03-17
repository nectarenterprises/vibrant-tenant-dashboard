
import React from 'react';
import { BarChart3, Calendar, FileText, Folder, Gauge, Zap } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-12 w-12 text-tenant-green" />,
    title: 'Lease Management',
    description: 'Easily manage all your leases in one place. Keep track of important dates, terms, and tenant information.'
  },
  {
    icon: <Folder className="h-12 w-12 text-tenant-purple" />,
    title: 'Document Storage',
    description: 'Securely store and organize all your property-related documents for quick access whenever you need them.'
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-tenant-orange" />,
    title: 'Service Charge Analysis',
    description: 'Track and analyze service charges across your properties to identify trends and optimize your expenses.'
  },
  {
    icon: <Gauge className="h-12 w-12 text-tenant-teal" />,
    title: 'Compliance Tracking',
    description: 'Stay on top of regulatory requirements with automated compliance tracking and reminders.'
  },
  {
    icon: <Zap className="h-12 w-12 text-tenant-chartGreen" />,
    title: 'Utility Management',
    description: 'Monitor utility usage and costs across your portfolio to identify savings opportunities.'
  },
  {
    icon: <Calendar className="h-12 w-12 text-tenant-purple" />,
    title: 'Calendar Integration',
    description: 'Keep track of important dates, renewals, and appointments with our integrated calendar system.'
  }
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent mb-4">
          Powerful Features for Property Professionals
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          SweetLease provides everything you need to manage your properties efficiently and professionally.
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
