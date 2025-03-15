
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DetailHeaderProps {
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  Icon,
  iconColor,
  iconBgColor
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`${iconBgColor} p-2 rounded-full`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{title} Detail View</h2>
    </div>
  );
};

export default DetailHeader;
