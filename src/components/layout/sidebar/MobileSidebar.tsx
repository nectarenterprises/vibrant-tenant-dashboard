
import React from 'react';
import { Location } from 'react-router-dom';
import { Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarLinks from './SidebarLinks';
import { UserProfile } from './UserProfile';

interface MobileSidebarProps {
  location: Location;
}

export const MobileSidebar = ({ location }: MobileSidebarProps) => {
  const handleLinkClick = () => {
    // Close the sidebar when a link is clicked
    const closeButton = document.querySelector('[data-radix-collection-item]');
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-background animate-[rotate_30s_linear_infinite]">
          <Hexagon className="h-6 w-6 text-black fill-black" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-black">SweetLease</SheetTitle>
          <SheetDescription>
            Manage your properties with ease.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex-1 overflow-auto">
          <SidebarLinks location={location} onClick={handleLinkClick} />
        </div>
        <Separator className="my-4" />
        <UserProfile />
      </SheetContent>
    </Sheet>
  );
};
