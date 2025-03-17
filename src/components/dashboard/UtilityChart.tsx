
import React, { useState } from 'react';
import { UtilityData, Property } from '@/types/property';
import UtilityToggleButtons from './charts/UtilityToggleButtons';
import PropertySelector from './charts/PropertySelector';
import { StyledAreaChart, TENANT_COLORS } from '@/components/ui/charts';
import { Info } from 'lucide-react';
import { useUtilityBills } from '@/hooks/utility/useUtilityBills';

interface UtilityChartProps {
  data: UtilityData[];
  properties?: Property[];
}

const UtilityChart: React.FC<UtilityChartProps> = ({ properties = [] }) => {
  const [activeUtilities, setActiveUtilities] = useState({
    gas: true,
    water: true,
    electricity: true
  });
  
  const [selectedProperty, setSelectedProperty] = useState<string>(
    properties.length > 0 ? properties[0].id : 'all'
  );

  const { getUtilityCostData, isLoadingBills } = useUtilityBills(selectedProperty);
  const utilityData = getUtilityCostData();

  const toggleUtility = (utility: keyof typeof activeUtilities) => {
    setActiveUtilities(prev => ({
      ...prev,
      [utility]: !prev[utility]
    }));
  };

  // Format tooltip values as currency
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;

  // Determine which lines to show based on active utilities
  const getAdditionalLines = () => {
    const lines = [];
    
    if (activeUtilities.gas) {
      lines.push({
        dataKey: 'gas',
        stroke: TENANT_COLORS.orange,
        gradientId: 'orangeGradient'
      });
    }
    
    if (activeUtilities.water) {
      lines.push({
        dataKey: 'water',
        stroke: TENANT_COLORS.teal,
        gradientId: 'tealGradient'
      });
    }
    
    return lines;
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-lg">
      <Info className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Utility Data Available</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Visit the Documents section to upload your utility bills and track usage over time.
      </p>
    </div>
  );

  return (
    <div className="utility-chart-container animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col mb-3 sm:mb-0">
          <h3 className="text-lg font-bold">Utility Usage & Costs</h3>
          <PropertySelector 
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            properties={properties}
          />
        </div>
        <UtilityToggleButtons 
          activeUtilities={activeUtilities} 
          toggleUtility={toggleUtility} 
        />
      </div>
      
      {isLoadingBills ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tenant-green rounded-full"></div>
        </div>
      ) : utilityData.length === 0 ? (
        renderEmptyState()
      ) : (
        <StyledAreaChart
          data={utilityData}
          dataKey="electricity"
          xAxisDataKey="month"
          stroke={TENANT_COLORS.purple}
          gradientId="purpleGradient"
          height={260}
          tooltipFormatter={formatCurrency}
          yAxisTickFormatter={formatCurrency}
          additionalLines={getAdditionalLines()}
          showGrid={false}
          className={!activeUtilities.electricity ? "hidden" : ""}
        />
      )}
    </div>
  );
};

export default UtilityChart;
