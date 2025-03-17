
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  label: string;
  isActive?: boolean;
}

const NavLink = ({ to, label, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-md text-sm font-medium",
      isActive && "text-primary font-semibold"
    )}
  >
    {label}
  </Link>
);

const LandingNavigation = () => {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="mr-6">
            <h1 className="text-xl font-bold bg-gradient-to-r from-tenant-darkGreen to-tenant-green bg-clip-text text-transparent">
              SweetLease
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" label="Home" isActive={true} />
          <NavLink to="/features" label="Features" />
          <NavLink to="/pricing" label="Pricing" />
          <NavLink to="/about" label="About" />
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?tab=register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingNavigation;
