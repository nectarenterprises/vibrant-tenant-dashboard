
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ComplianceItem } from '@/types/compliance';
import { cn } from '@/lib/utils';

interface ComplianceItemCardProps {
  item: ComplianceItem;
  onClick: () => void;
}

const ComplianceItemCard: React.FC<ComplianceItemCardProps> = ({ item, onClick }) => {
  const { name, icon: Icon, lastCompleted, nextDue, status } = item;
  
  // Format dates
  const formattedLastCompleted = format(parseISO(lastCompleted), 'dd MMM yyyy');
  const formattedNextDue = format(parseISO(nextDue), 'dd MMM yyyy');
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'upcoming':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'overdue':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full">
            <Icon className="h-5 w-5 text-tenant-green" />
          </div>
          <h3 className="font-medium text-base">{name}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last completed:</span>
            <span>{formattedLastCompleted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next due:</span>
            <span>{formattedNextDue}</span>
          </div>
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium text-center mt-2", getStatusColor())}>
            {getStatusText()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceItemCard;
