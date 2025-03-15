import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { ServiceChargeCategoryBreakdown } from '@/types/service-charge';

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
    const total = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);
    updatedCategories.forEach(cat => {
      cat.percentage = total > 0 ? (cat.amount / total) * 100 : 0;
    });
    
    setCategories(updatedCategories);
    setTotalAmount(total);
  };
  
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    setCategories([
      ...categories,
      { category: newCategoryName, amount: 0, percentage: 0 }
    ]);
    
    setNewCategoryName('');
  };
  
  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    
    // Recalculate total and percentages
    const total = updatedCategories.reduce((sum, cat) => sum + cat.amount, 0);
    updatedCategories.forEach(cat => {
      cat.percentage = total > 0 ? (cat.amount / total) * 100 : 0;
    });
    
    setTotalAmount(total);
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
            
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input value={category.category} disabled />
                  </div>
                  <div className="col-span-3">
                    <Input 
                      type="number" 
                      value={category.amount}
                      onChange={(e) => handleCategoryAmountChange(index, parseFloat(e.target.value) || 0)}
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input 
                      value={`${category.percentage.toFixed(1)}%`}
                      disabled
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-12 gap-2 items-center mt-4">
              <div className="col-span-5">
                <Input 
                  placeholder="New category name" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAddCategory}
                  className="w-full"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Save Budget</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetEntryForm;
