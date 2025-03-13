
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddIncentive?: () => void;
  onAddClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddIncentive, onAddClick }) => {
  const handleClick = () => {
    if (onAddIncentive) {
      onAddIncentive();
    } else if (onAddClick) {
      onAddClick();
    }
  };

  return (
    <div className="text-center py-4">
      <p className="text-muted-foreground mb-4">No incentives added yet</p>
      <Button 
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={handleClick}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Lease Incentives
      </Button>
    </div>
  );
};

export default EmptyState;
