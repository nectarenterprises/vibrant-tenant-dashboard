
import React from 'react';
import { Location } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { SidebarLinks } from './SidebarLinks';
import { UserProfile } from './UserProfile';
import { cn } from '@/lib/utils';

interface DesktopSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  location: Location;
}

export const DesktopSidebar = ({ collapsed, setCollapsed, location }: DesktopSidebarProps) => {
  return (
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300 fixed top-0 left-0 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <div className="font-bold text-xl text-primary">SweetLease</div>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto",
            collapsed ? "rotate-0" : "rotate-180",
            "transition-transform duration-3000"
          )}
        >
          <Hexagon className="h-5 w-5 text-primary fill-primary" />
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex-1 overflow-auto">
        <SidebarLinks collapsed={collapsed} location={location} />
      </div>
      
      <Separator className="my-4" />
      
      <UserProfile collapsed={collapsed} />
    </div>
  );
};
