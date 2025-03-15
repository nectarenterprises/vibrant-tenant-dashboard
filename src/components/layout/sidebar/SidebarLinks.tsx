
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Calendar as CalendarIcon, 
  Building2, 
  BarChart3, 
  ShieldCheck, 
  FileBarChart,
  Zap,
  Users,
  User
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface SidebarLinksProps {
  collapsed?: boolean;
  location?: ReturnType<typeof useLocation>;
  onClick?: () => void;
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ 
  collapsed = false, 
  location: propLocation,
  onClick 
}) => {
  const locationFromHook = useLocation();
  const location = propLocation || locationFromHook;
  const { isAdmin } = useRole();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const links = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/leases', label: 'Leases', icon: <Building2 size={20} /> },
    { path: '/documents', label: 'Documents', icon: <FileText size={20} /> },
    { path: '/service-charge', label: 'Service Charge', icon: <BarChart3 size={20} /> },
    { path: '/compliance', label: 'Compliance', icon: <ShieldCheck size={20} /> },
    { path: '/utilities', label: 'Utilities', icon: <Zap size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileBarChart size={20} />, adminOnly: true },
    { path: '/users', label: 'User Management', icon: <Users size={20} />, adminOnly: true },
    { path: '/profile', label: 'My Profile', icon: <User size={20} /> }
  ];

  return (
    <div className="mt-6 space-y-1">
      {links.map((link) => {
        // Skip admin-only links for non-admin users
        if (link.adminOnly && !isAdmin) return null;
        
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 ${
              isActive(link.path)
                ? 'bg-tenant-green text-white'
                : 'text-gray-700 hover:bg-gray-100'
            } rounded-md transition-colors`}
            onClick={onClick}
          >
            <span className={collapsed ? '' : 'mr-3'}>{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
