
import React from 'react';
import { 
  FileText, Shield, Calendar, ChartBar, Building, 
  Lightbulb, FileBarChart2, Gauge, Receipt, Sparkles 
} from 'lucide-react';

const DetailedFeaturesSection = () => {
  const featureGroups = [
    {
      title: "Document Management",
      description: "Keep all your important documents in one place",
      features: [
        {
          icon: <FileText className="h-6 w-6 text-tenant-green" />,
          title: "Document Storage",
          description: "Store all your lease agreements, addendums, and property-related documents securely in the cloud."
        },
        {
          icon: <Shield className="h-6 w-6 text-tenant-green" />,
          title: "Secure Access",
          description: "Access your documents anytime, anywhere with secure authentication and role-based permissions."
        }
      ],
      image: "/images/feature-documents.png"
    },
    {
      title: "Service Charge Management",
      description: "Understand and track your service charges",
      features: [
        {
          icon: <ChartBar className="h-6 w-6 text-tenant-orange" />,
          title: "Charge Breakdown",
          description: "See detailed breakdowns of your service charges to understand exactly what you're paying for."
        },
        {
          icon: <Receipt className="h-6 w-6 text-tenant-orange" />,
          title: "Historical Analysis",
          description: "Compare current charges with previous periods to identify trends and anomalies."
        }
      ],
      image: "/images/feature-service-charge.png"
    },
    {
      title: "Utilities & Compliance",
      description: "Monitor utilities and stay compliant",
      features: [
        {
          icon: <Gauge className="h-6 w-6 text-tenant-teal" />,
          title: "Utility Tracking",
          description: "Monitor your electricity, gas, and water usage to identify savings opportunities."
        },
        {
          icon: <Lightbulb className="h-6 w-6 text-tenant-teal" />,
          title: "Energy Efficiency",
          description: "Get insights on how to improve energy efficiency and reduce your utility bills."
        }
      ],
      image: "/images/feature-utilities.png"
    },
    {
      title: "Property Management",
      description: "Manage all aspects of your tenancy",
      features: [
        {
          icon: <Building className="h-6 w-6 text-tenant-purple" />,
          title: "Property Details",
          description: "Keep track of your property specifications, amenities, and maintenance requirements."
        },
        {
          icon: <Calendar className="h-6 w-6 text-tenant-purple" />,
          title: "Key Dates",
          description: "Stay on top of important dates like rent payments, lease renewals, and maintenance schedules."
        }
      ],
      image: "/images/feature-property.png"
    },
    {
      title: "Reporting",
      description: "Comprehensive reporting for occupancy cost analysis",
      features: [
        {
          icon: <FileBarChart2 className="h-6 w-6 text-tenant-chartGreen" />,
          title: "Cost Analytics",
          description: "Generate comprehensive reports that capture your total occupancy costs across all expense categories."
        },
        {
          icon: <Sparkles className="h-6 w-6 text-tenant-chartGreen" />,
          title: "Custom Reports",
          description: "Create custom reports with the metrics that matter most to your organization for informed decision-making."
        }
      ],
      image: "/images/feature-reports.png"
    }
  ];

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {featureGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={`space-y-8 ${groupIndex % 2 === 1 ? 'md:flex flex-row-reverse' : 'md:flex'} gap-12 items-center`}>
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">{group.title}</h2>
                <p className="text-muted-foreground text-lg">{group.description}</p>
                <div className="space-y-6 pt-4">
                  {group.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-4">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg border border-border">
                <img 
                  src={group.image}
                  alt={`${group.title} screenshot`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedFeaturesSection;
