
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Property } from '@/types/property';
import { ComparisonPeriod, ViewMode } from './comparison/types';
import { formatCurrency } from './comparison/utils';
import PeriodSelector from './comparison/PeriodSelector';
import ViewModeSelector from './comparison/ViewModeSelector';
import ComparisonChart from './comparison/ComparisonChart';
import ComparisonTable from './comparison/ComparisonTable';
import ComparisonSummary from './comparison/ComparisonSummary';

interface ServiceChargeComparisonDashboardProps {
  property: Property;
}

const ServiceChargeComparisonDashboard: React.FC<ServiceChargeComparisonDashboardProps> = ({ property }) => {
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('annual');
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  
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
              
              <ViewModeSelector 
                viewMode={viewMode} 
                onViewModeChange={setViewMode} 
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'chart' && (
            <ComparisonChart data={currentYearData} formatCurrency={formatCurrency} />
          )}
          
          {viewMode === 'table' && (
            <ComparisonTable 
              data={currentYearData} 
              formatCurrency={formatCurrency}
              getChangeColor={getChangeColor}
              getChangeBadgeColor={getChangeBadgeColor}
              getChangeIcon={getChangeIcon}
            />
          )}
          
          <ComparisonSummary 
            data={currentYearData} 
            formatCurrency={formatCurrency} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Utility functions that will be moved to utils.ts
const getChangeColor = (percentChange: number): string => {
  if (percentChange < 0) return 'text-emerald-600';
  if (percentChange <= 5) return 'text-amber-600';
  return 'text-red-600';
};

const getChangeBadgeColor = (percentChange: number): string => {
  if (percentChange < 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (percentChange <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getChangeIcon = (percentChange: number): React.ReactElement => {
  const ArrowDown = require('lucide-react').ArrowDown;
  const ArrowUp = require('lucide-react').ArrowUp;
  
  if (percentChange < 0) return <ArrowDown className="h-3 w-3" />;
  return <ArrowUp className="h-3 w-3" />;
};

export default ServiceChargeComparisonDashboard;
