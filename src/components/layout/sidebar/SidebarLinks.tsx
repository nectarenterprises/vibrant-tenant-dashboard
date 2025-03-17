
import React from 'react';
import { Link } from 'react-router-dom';
import { Location } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Folder, 
  BarChart3, 
  Gauge, 
  CalendarIcon, 
  PieChart, 
  UserCircle, 
  CreditCard,
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ icon, label, to, active, collapsed, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center px-4 py-3 text-base font-medium transition-colors relative",
      collapsed ? "justify-center px-0" : "",
      active 
        ? "bg-sidebar-accent text-white rounded-md" 
        : "text-white hover:bg-sidebar-accent/80 hover:text-white hover:rounded-md"
    )}
  >
    <span className={cn("flex items-center justify-center", collapsed ? "w-full" : "w-10")}>
      {icon}
    </span>
    {!collapsed && <span className="truncate">{label}</span>}
  </Link>
);

interface SidebarLinksProps {
  location: Location;
  collapsed?: boolean;
  onClick?: () => void;
}

export const SidebarLinks = ({ location, collapsed, onClick }: SidebarLinksProps) => {
  return (
    <div className="flex flex-col py-2 space-y-1">
      <SidebarLink 
        icon={<Home className="h-5 w-5" />} 
        label="Dashboard" 
        to="/" 
        active={location.pathname === '/'} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<FileText className="h-5 w-5" />} 
        label="Leases" 
        to="/leases" 
        active={location.pathname.startsWith('/leases')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<Folder className="h-5 w-5" />} 
        label="Documents" 
        to="/documents" 
        active={location.pathname.startsWith('/documents')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<BarChart3 className="h-5 w-5" />} 
        label="Service Charge" 
        to="/service-charge" 
        active={location.pathname.startsWith('/service-charge')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<Gauge className="h-5 w-5" />} 
        label="Compliance" 
        to="/compliance" 
        active={location.pathname.startsWith('/compliance')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<Zap className="h-5 w-5" />} 
        label="Utilities" 
        to="/utilities" 
        active={location.pathname.startsWith('/utilities')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<CalendarIcon className="h-5 w-5" />} 
        label="Calendar" 
        to="/calendar" 
        active={location.pathname.startsWith('/calendar')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      <SidebarLink 
        icon={<PieChart className="h-5 w-5" />} 
        label="Reports" 
        to="/reports" 
        active={location.pathname.startsWith('/reports')} 
        collapsed={collapsed} 
        onClick={onClick}
      />
      
      <div className="py-2">
        <div className={cn("px-4 py-2 text-xs uppercase font-semibold text-white", collapsed && "sr-only")}>
          Account
        </div>
        <SidebarLink 
          icon={<UserCircle className="h-5 w-5" />} 
          label="Profile" 
          to="/profile" 
          active={location.pathname.startsWith('/profile')} 
          collapsed={collapsed} 
          onClick={onClick}
        />
        <SidebarLink 
          icon={<CreditCard className="h-5 w-5" />} 
          label="Billing" 
          to="/billing" 
          active={location.pathname.startsWith('/billing')} 
          collapsed={collapsed} 
          onClick={onClick}
        />
      </div>
    </div>
  );
};
