
import React from 'react';
import BudgetEntryForm from './BudgetEntryForm';
import { toast } from '@/components/ui/use-toast';

interface BudgetEntryTabProps {
  propertyId: string;
}

const BudgetEntryTab: React.FC<BudgetEntryTabProps> = ({ propertyId }) => {
  const handleSubmitBudget = (budgetData: any) => {
    console.log('Submitted budget data:', budgetData);
    // In a real implementation, this would save the data to the database
    
    toast({
      title: 'Budget saved',
      description: 'The service charge budget has been saved successfully.',
    });
  };
  
  return (
    <BudgetEntryForm 
      propertyId={propertyId} 
      onSubmit={handleSubmitBudget} 
    />
  );
};

export default BudgetEntryTab;
