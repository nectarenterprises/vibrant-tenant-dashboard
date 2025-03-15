
import React from 'react';
import { useLocation } from 'react-router-dom';
import { DesktopSidebar } from './sidebar/DesktopSidebar';
import { MobileSidebar } from './sidebar/MobileSidebar';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      <DesktopSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        location={location} 
      />
      <MobileSidebar 
        location={location} 
      />
    </>
  );
};

export default Sidebar;
