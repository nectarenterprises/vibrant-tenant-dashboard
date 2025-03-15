
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
  LayoutDashboard, Zap, BarChart2, Menu
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
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Convert collapsed state to isMobile for Sheet component
  const isMobile = false; // Sheets only shown on mobile
  const closeMobileMenu = () => setCollapsed(true);

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

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setCollapsed(!collapsed);
  };

  // Desktop sidebar
  const DesktopSidebar = (
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300 fixed top-0 left-0 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <div className="font-bold text-xl">Sweetlease</div>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col space-y-1 px-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? "justify-center" : "space-x-2"} rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground ${
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`
              }
            >
              {link.icon}
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn(
              "w-full justify-start gap-2", 
              collapsed && "justify-center"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="font-semibold truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                  <span className="text-muted-foreground text-xs truncate">{user?.email}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  // Mobile sidebar as a sheet
  const MobileSidebar = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50 bg-background">
          <Menu className="h-5 w-5" />
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
        <div className="flex flex-col space-y-2 p-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground ${
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`
              }
              onClick={() => {}} // Close sheet on mobile
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="font-semibold">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                  <span className="text-muted-foreground text-xs">{user?.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
};

export default Sidebar;
