
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
        {!collapsed && <div className="font-bold text-2xl text-black">SweetLease</div>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            collapsed ? "mx-auto" : "ml-auto",
            "transition-all duration-3000 animate-[rotate_20s_linear_infinite] focus:bg-transparent"
          )}
        >
          <Hexagon className="h-8 w-8 text-black fill-black" />
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
