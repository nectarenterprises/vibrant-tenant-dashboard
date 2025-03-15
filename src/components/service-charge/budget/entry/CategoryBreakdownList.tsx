
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ServiceChargeCategoryBreakdown } from '@/types/service-charge';

interface CategoryBreakdownListProps {
  categories: ServiceChargeCategoryBreakdown[];
  onAmountChange: (index: number, amount: number) => void;
  onRemoveCategory: (index: number) => void;
}

const CategoryBreakdownList: React.FC<CategoryBreakdownListProps> = ({ 
  categories, 
  onAmountChange, 
  onRemoveCategory 
}) => {
  return (
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
              onChange={(e) => onAmountChange(index, parseFloat(e.target.value) || 0)}
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
              onClick={() => onRemoveCategory(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBreakdownList;
