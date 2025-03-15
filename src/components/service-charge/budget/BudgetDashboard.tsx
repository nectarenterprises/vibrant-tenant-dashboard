
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import BudgetComparison from './BudgetComparison';
import BudgetEntryForm from './BudgetEntryForm';
import { toast } from '@/components/ui/use-toast';

interface BudgetDashboardProps {
  property: Property;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState<string>('comparison');
  
  const handleSubmitBudget = (budgetData: any) => {
    console.log('Submitted budget data:', budgetData);
    // In a real implementation, this would save the data to the database
    
    toast({
      title: 'Budget saved',
      description: 'The service charge budget has been saved successfully.',
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="comparison">Budget Comparison</TabsTrigger>
          <TabsTrigger value="entry">Budget Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison">
          <BudgetComparison property={property} />
        </TabsContent>
        
        <TabsContent value="entry">
          <BudgetEntryForm 
            propertyId={property.id} 
            onSubmit={handleSubmitBudget} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetDashboard;
