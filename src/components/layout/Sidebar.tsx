
import React from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { 
  Home, FileClock, FileText, FileSpreadsheet, PieChart, CalendarDays, 
  LayoutDashboard, Zap, BarChart2
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  isMobile: boolean;
  closeMobileMenu: () => void;
}

const Sidebar = ({ isMobile, closeMobileMenu }: SidebarProps) => {
  const { signOut, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { name: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Leases', href: '/leases', icon: <FileClock className="h-5 w-5" /> },
    { name: 'Documents', href: '/documents', icon: <FileText className="h-5 w-5" /> },
    { name: 'Service Charge', href: '/service-charge', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Compliance', href: '/compliance', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { name: 'Utilities', href: '/utilities', icon: <Zap className="h-5 w-5" /> },
    { name: 'Calendar', href: '/calendar', icon: <CalendarDays className="h-5 w-5" /> },
    { name: 'Reports', href: '/reports', icon: <BarChart2 className="h-5 w-5" /> }
  ];

  return (
    <Sheet open={isMobile} onOpenChange={closeMobileMenu}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          Open
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader className="text-left">
          <SheetTitle>Sweetlease</SheetTitle>
          <SheetDescription>
            Manage your properties with ease.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-2.5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground ${
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`
              }
              onClick={closeMobileMenu}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
        <Separator className="my-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto justify-start gap-2">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-semibold">{user?.user_metadata?.full_name}</span>
                <span className="text-muted-foreground text-sm">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
