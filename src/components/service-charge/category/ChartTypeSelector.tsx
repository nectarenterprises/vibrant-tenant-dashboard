
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, BarChart } from 'lucide-react';

interface ChartTypeSelectorProps {
  chartType: 'pie' | 'bar';
  onChartTypeChange: (value: 'pie' | 'bar') => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ chartType, onChartTypeChange }) => {
  return (
    <Tabs 
      value={chartType} 
      onValueChange={(value: 'pie' | 'bar') => onChartTypeChange(value)} 
      className="w-auto"
    >
      <TabsList className="grid w-auto grid-cols-2">
        <TabsTrigger value="pie" className="flex items-center gap-1 px-3">
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">Pie</span>
        </TabsTrigger>
        <TabsTrigger value="bar" className="flex items-center gap-1 px-3">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Bar</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ChartTypeSelector;
