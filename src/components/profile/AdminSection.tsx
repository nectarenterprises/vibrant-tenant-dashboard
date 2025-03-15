
import React from 'react';
import { UserCog } from 'lucide-react';

const AdminSection = () => {
  return (
    <div>
      <div className="mb-4">
        <p className="text-slate-500">
          As an administrator, you can manage user roles and permissions.
        </p>
      </div>
      <div className="pt-4">
        <iframe 
          src="/users"
          className="w-full h-[calc(100vh-280px)] min-h-[500px] border border-slate-200 rounded-md"
          title="User Management"
        />
      </div>
    </div>
  );
};

export default AdminSection;
