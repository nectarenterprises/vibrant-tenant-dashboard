
import React from 'react';
import { Badge } from '@/components/ui/badge';

const EventBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap space-x-2">
      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Rent</Badge>
      <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">Maintenance</Badge>
      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Inspection</Badge>
      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">Other</Badge>
    </div>
  );
};

export default EventBadges;
