import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import YearComparisonSummary from './comparison/YearComparisonSummary';
import ServiceComparisonChart from './comparison/ServiceComparisonChart';
import DetailedComparisonGrid from './comparison/DetailedComparisonGrid';

interface ServiceChargeCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ServiceChargeComparisonProps {
  property: Property;
  currentYearCharges: ServiceChargeCategory[];
  onClose: () => void;
}

const ServiceChargeComparison: React.FC<ServiceChargeComparisonProps> = ({
  property,
  currentYearCharges,
  onClose
}) => {
  const [selectedYear, setSelectedYear] = useState('2022');
  const currentYear = new Date().getFullYear().toString();
  
  const generatePreviousYearData = (year: string) => {
    const yearVariationFactor = year === '2022' ? 0.85 : year === '2021' ? 0.75 : 0.65;
    
    return currentYearCharges.map(charge => ({
      ...charge,
      previousAmount: charge.amount * yearVariationFactor * (1 + (Math.random() * 0.2 - 0.1)),
    }));
  };
  
  const comparisonData = generatePreviousYearData(selectedYear);
  
  const chartData = comparisonData.map(item => ({
    category: item.category,
    [currentYear]: Math.round(item.amount),
    [selectedYear]: Math.round(item.previousAmount),
  }));
  
  const currentYearTotal = currentYearCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const previousYearTotal = comparisonData.reduce((sum, charge) => sum + charge.previousAmount, 0);
  const percentageChange = ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year Comparison</CardTitle>
            <CardDescription>
              Compare {currentYear} service charges with previous years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YearComparisonSummary 
              selectedYear={selectedYear}
              currentYear={currentYear}
              currentYearTotal={currentYearTotal}
              previousYearTotal={previousYearTotal}
              percentageChange={percentageChange}
              onYearChange={setSelectedYear}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison by Category</CardTitle>
          <CardDescription>
            Comparing {currentYear} vs {selectedYear} service charge breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceComparisonChart 
            chartData={chartData}
            currentYear={currentYear}
            selectedYear={selectedYear}
          />
          
          <DetailedComparisonGrid
            comparisonData={comparisonData}
            currentYear={currentYear}
            selectedYear={selectedYear}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeComparison;
