
import React from 'react';
import { NavLink, Location } from 'react-router-dom';
import { 
  Home, FileClock, FileText, FileSpreadsheet, 
  LayoutDashboard, Zap, BarChart2, CalendarDays
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinksProps {
  collapsed?: boolean;
  location: Location;
  onClick?: () => void;
}

export const SidebarLinks = ({ collapsed, location, onClick }: SidebarLinksProps) => {
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
    <div className={cn("flex flex-col", collapsed ? "space-y-0" : "space-y-1", "px-2")}>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `flex items-center ${collapsed ? "justify-center" : "space-x-2"} rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-foreground ${
              isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
            }`
          }
          onClick={onClick}
        >
          {link.icon}
          {!collapsed && <span>{link.name}</span>}
        </NavLink>
      ))}
    </div>
  );
};
