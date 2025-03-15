
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { ServiceChargeCategoryBreakdown } from '@/types/service-charge';
import CategoryBreakdownList from './CategoryBreakdownList';
import NewCategoryInput from './NewCategoryInput';

interface BudgetEntryFormProps {
  propertyId: string;
  onSubmit: (data: any) => void;
}

const BudgetEntryForm: React.FC<BudgetEntryFormProps> = ({ propertyId, onSubmit }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [periodType, setPeriodType] = useState<string>('annual');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isActual, setIsActual] = useState<boolean>(false);
  const [categories, setCategories] = useState<ServiceChargeCategoryBreakdown[]>([
    { category: 'Maintenance', amount: 0, percentage: 0 },
    { category: 'Security', amount: 0, percentage: 0 },
    { category: 'Cleaning', amount: 0, percentage: 0 },
    { category: 'Utilities', amount: 0, percentage: 0 },
    { category: 'Insurance', amount: 0, percentage: 0 },
    { category: 'Management Fee', amount: 0, percentage: 0 }
  ]);
  
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  
  const handleCategoryAmountChange = (index: number, amount: number) => {
    const updatedCategories = [...categories];
    updatedCategories[index].amount = amount;
    
    // Recalculate percentages
    recalculatePercentages(updatedCategories);
  };
  
  const recalculatePercentages = (updatedCategories: ServiceChargeCategoryBreakdown[]) => {
    const total = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);
    updatedCategories.forEach(cat => {
      cat.percentage = total > 0 ? (cat.amount / total) * 100 : 0;
    });
    
    setCategories(updatedCategories);
    setTotalAmount(total);
  };
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    const updatedCategories = [
      ...categories,
      { category: newCategoryName, amount: 0, percentage: 0 }
    ];
    
    setCategories(updatedCategories);
    setNewCategoryName('');
  };
  
  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    recalculatePercentages(updatedCategories);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetData = {
      propertyId,
      year,
      periodType,
      totalAmount,
      isActual,
      breakdown: categories
    };
    
    onSubmit(budgetData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Charge Budget Entry</CardTitle>
        <CardDescription>Enter budget details for service charge analysis</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                type="number" 
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2000}
                max={2100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period-type">Period Type</Label>
              <Select value={periodType} onValueChange={setPeriodType}>
                <SelectTrigger id="period-type">
                  <SelectValue placeholder="Select period type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget-type">Budget Type</Label>
              <Select 
                value={isActual ? 'actual' : 'budget'} 
                onValueChange={(value) => setIsActual(value === 'actual')}
              >
                <SelectTrigger id="budget-type">
                  <SelectValue placeholder="Select budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="actual">Actual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Category Breakdown</Label>
              <div className="text-muted-foreground text-sm">
                Total: £{totalAmount.toLocaleString('en-GB')}
              </div>
            </div>
            
            <CategoryBreakdownList 
              categories={categories}
              onAmountChange={handleCategoryAmountChange}
              onRemoveCategory={handleRemoveCategory}
            />
            
            <NewCategoryInput
              newCategoryName={newCategoryName}
              onNameChange={setNewCategoryName}
              onAddCategory={handleAddCategory}
            />
          </div>
          
          <Button type="submit" className="w-full">Save Budget</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetEntryForm;
