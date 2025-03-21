
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Property } from '@/types/property';
import { ComparisonPeriod } from './comparison/types';
import { 
  formatCurrency, 
  getChangeColor, 
  getChangeBadgeColor, 
  getChangeIcon 
} from './comparison/utils.tsx';
import PeriodSelector from './comparison/PeriodSelector';
import ComparisonChart from './comparison/ComparisonChart';
import ComparisonTable from './comparison/ComparisonTable';
import ComparisonSummary from './comparison/ComparisonSummary';

interface ServiceChargeComparisonDashboardProps {
  property: Property;
}

const ServiceChargeComparisonDashboard: React.FC<ServiceChargeComparisonDashboardProps> = ({ property }) => {
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('annual');
  
  // Mock data - would be replaced with real data from API
  const currentYearData = [
    { category: 'Maintenance', currentYear: 6300, previousYear: 5800, percentChange: 8.62 },
    { category: 'Security', currentYear: 4200, previousYear: 3900, percentChange: 7.69 },
    { category: 'Cleaning', currentYear: 3360, previousYear: 3300, percentChange: 1.82 },
    { category: 'Utilities', currentYear: 5040, previousYear: 4800, percentChange: 5.00 },
    { category: 'Insurance', currentYear: 2100, previousYear: 2500, percentChange: -16.00 },
    { category: 'Management Fee', currentYear: 2520, previousYear: 2400, percentChange: 5.00 }
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">{property.name} - Service Charge Comparison</CardTitle>
              <CardDescription>Comparing service charges across time periods</CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <PeriodSelector 
                comparisonPeriod={comparisonPeriod} 
                onPeriodChange={setComparisonPeriod} 
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Chart View */}
          <div>
            <ComparisonChart data={currentYearData} formatCurrency={formatCurrency} />
          </div>
          
          {/* Comparison Summary - Moved above the table */}
          <ComparisonSummary 
            data={currentYearData} 
            formatCurrency={formatCurrency} 
          />
          
          {/* Table View */}
          <div>
            <ComparisonTable 
              data={currentYearData} 
              formatCurrency={formatCurrency}
              getChangeColor={getChangeColor}
              getChangeBadgeColor={getChangeBadgeColor}
              getChangeIcon={getChangeIcon}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeComparisonDashboard;
