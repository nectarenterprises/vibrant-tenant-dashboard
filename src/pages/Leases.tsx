
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { Key } from 'lucide-react';

const Leases = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Leases</h1>
          
          <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl">
            <Key className="h-16 w-16 text-tenant-teal mb-4" />
            <p className="text-lg text-muted-foreground">Leases section coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leases;
