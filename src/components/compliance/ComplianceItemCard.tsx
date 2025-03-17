
import React from 'react';
import { ComplianceItem } from '@/types/compliance';

interface ComplianceItemCardProps {
  item: ComplianceItem;
  onClick: () => void;
}

const ComplianceItemCard: React.FC<ComplianceItemCardProps> = ({ item, onClick }) => {
  return (
    <div className="border rounded-lg p-4 cursor-pointer hover:shadow-md" onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        <item.icon className="h-5 w-5" />
        <h3 className="font-medium">{item.name}</h3>
      </div>
      <p>Status: {item.status}</p>
    </div>
  );
};

export default ComplianceItemCard;
