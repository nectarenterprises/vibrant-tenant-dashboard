
import {
  Bell,
  Calendar,
  FileText,
  Globe,
  KeyboardIcon,
  Leaf,
  FileHeart,
  Home,
  BarChart4
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { AuroraBackground } from "@/components/ui/aurora-background";

const features = [
  {
    Icon: FileText,
    name: "Property Documents",
    description: "All your property documents, organized and easily searchable.",
    href: "/documents",
    cta: "View Documents",
    background: <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-green-100/20 dark:from-green-900/20 dark:to-green-800/10"></div>,
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Leaf,
    name: "Sustainability",
    description: "Monitor and optimize your property's environmental impact.",
    href: "/utilities",
    cta: "Explore Utilities",
    background: <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-emerald-100/20 dark:from-emerald-900/20 dark:to-emerald-800/10"></div>,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Home,
    name: "Property Management",
    description: "Efficiently manage all your properties in one dashboard.",
    href: "/",
    cta: "Go to Dashboard",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/20 dark:from-blue-900/20 dark:to-blue-800/10"></div>,
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
  {
    Icon: Calendar,
    name: "Calendar",
    description: "Keep track of important dates and property-related events.",
    href: "/calendar",
    cta: "Open Calendar",
    background: <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-indigo-100/20 dark:from-indigo-900/20 dark:to-indigo-800/10"></div>,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bell,
    name: "Notifications",
    description: "Stay updated with important property alerts and reminders.",
    href: "/",
    cta: "View Alerts",
    background: <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-amber-100/20 dark:from-amber-900/20 dark:to-amber-800/10"></div>,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BarChart4,
    name: "Service Charge",
    description: "Analyze and manage service charges for your properties.",
    href: "/service-charge",
    cta: "View Details",
    background: <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-violet-100/20 dark:from-violet-900/20 dark:to-violet-800/10"></div>,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
  },
];

export function BentoDemo() {
  return (
    <div className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Property Management Tools</h2>
          <p className="max-w-[700px] text-muted-foreground">
            Comprehensive tools to help you manage your properties efficiently and effectively.
          </p>
        </div>
        
        <BentoGrid className="lg:grid-rows-[repeat(3,_minmax(0,_1fr))]">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

export function BentoHero() {
  return (
    <AuroraBackground showRadialGradient={false} className="py-10">
      <div className="container px-4 md:px-6 z-10 relative">
        <BentoDemo />
      </div>
    </AuroraBackground>
  );
}
