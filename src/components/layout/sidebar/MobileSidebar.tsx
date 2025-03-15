
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
import { SidebarLinks } from './SidebarLinks';
import { UserProfile } from './UserProfile';

interface MobileSidebarProps {
  location: Location;
}

export const MobileSidebar = ({ location }: MobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-background">
          <Hexagon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4">
          <SheetTitle>Sweetlease</SheetTitle>
          <SheetDescription>
            Manage your properties with ease.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex-1 overflow-auto">
          <SidebarLinks location={location} onClick={() => {}} />
        </div>
        <Separator className="my-4" />
        <UserProfile />
      </SheetContent>
    </Sheet>
  );
};
