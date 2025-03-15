
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import BudgetComparison from './comparison/BudgetComparison';
import BudgetEntryTab from './entry/BudgetEntryTab';

interface BudgetDashboardProps {
  property: Property;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ property }) => {
  const [activeTab, setActiveTab] = useState<string>('comparison');
  
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
          <BudgetEntryTab propertyId={property.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetDashboard;
