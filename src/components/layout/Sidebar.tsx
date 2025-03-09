
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Key, 
  Calendar, 
  Zap, 
  CheckSquare,
  ChevronLeft,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Leases', path: '/leases', icon: Key },
    { name: 'Service Charge', path: '/service-charge', icon: DollarSign },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Utilities', path: '/utilities', icon: Zap },
    { name: 'Compliance', path: '/compliance', icon: CheckSquare },
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 z-40 h-full bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between mb-8 mt-2">
            {!collapsed && (
              <h1 className="text-sidebar-foreground text-2xl font-bold">SweetLease</h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-full p-2 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-border transition-colors"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-3 text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="rounded-lg bg-sidebar-accent p-4 text-center text-sidebar-foreground">
          {!collapsed ? (
            <div className="space-y-2">
              <p className="text-sm">Need help?</p>
              <button className="w-full rounded-md bg-white text-sidebar py-2 font-medium transition-colors hover:bg-opacity-90">
                Contact Support
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
