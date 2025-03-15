
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ServiceChargeComparison, BudgetComparisonProps } from '@/types/service-charge';
import { cn } from '@/lib/utils';
import ComparisonSummary from './ComparisonSummary';
import ComparisonChart from './ComparisonChart';
import ComparisonTable from './ComparisonTable';

const BudgetComparison: React.FC<BudgetComparisonProps> = ({ property }) => {
  const [comparisonYear, setComparisonYear] = useState<string>('2022');
  const currentYear = '2023';
  
  // Mock data for budget comparison
  const comparisonData: ServiceChargeComparison[] = [
    { category: 'Maintenance', currentYear: 6300, previousYear: 5800, percentChange: 8.62 },
    { category: 'Security', currentYear: 4200, previousYear: 3900, percentChange: 7.69 },
    { category: 'Cleaning', currentYear: 3360, previousYear: 3300, percentChange: 1.82 },
    { category: 'Utilities', currentYear: 5040, previousYear: 4800, percentChange: 5.00 },
    { category: 'Insurance', currentYear: 2100, previousYear: 2500, percentChange: -16.00 },
    { category: 'Management Fee', currentYear: 2520, previousYear: 2400, percentChange: 5.00 }
  ];
  
  const totalCurrent = comparisonData.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPrevious = comparisonData.reduce((sum, item) => sum + item.previousYear, 0);
  const totalPercentChange = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold">Budget Comparison</CardTitle>
          
          <Select value={comparisonYear} onValueChange={setComparisonYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select comparison year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <ComparisonSummary 
          currentYear={currentYear}
          comparisonYear={comparisonYear}
          totalCurrent={totalCurrent}
          totalPrevious={totalPrevious}
          totalPercentChange={totalPercentChange}
        />
        
        <ComparisonChart 
          comparisonData={comparisonData}
          currentYear={currentYear}
          comparisonYear={comparisonYear}
        />
        
        <ComparisonTable 
          comparisonData={comparisonData}
          currentYear={currentYear}
          comparisonYear={comparisonYear}
          totalCurrent={totalCurrent}
          totalPrevious={totalPrevious}
          totalPercentChange={totalPercentChange}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetComparison;
