
import React, { useState } from 'react';
import { UtilityData, Property } from '@/types/property';
import UtilityToggleButtons from './charts/UtilityToggleButtons';
import PropertySelector from './charts/PropertySelector';
import { StyledAreaChart, TENANT_COLORS } from '@/components/ui/styled-chart';

interface UtilityChartProps {
  data: UtilityData[];
  properties?: Property[];
}

const UtilityChart: React.FC<UtilityChartProps> = ({ data, properties = [] }) => {
  const [activeUtilities, setActiveUtilities] = useState({
    gas: true,
    water: true,
    electricity: true
  });
  
  const [selectedProperty, setSelectedProperty] = useState<string>(
    properties.length > 0 ? properties[0].id : 'all'
  );

  const toggleUtility = (utility: keyof typeof activeUtilities) => {
    setActiveUtilities(prev => ({
      ...prev,
      [utility]: !prev[utility]
    }));
  };

  // Format tooltip values as currency
  const formatCurrency = (value: number) => `£${value}`;

  // Determine which lines to show based on active utilities
  const getAdditionalLines = () => {
    const lines = [];
    
    if (activeUtilities.gas) {
      lines.push({
        dataKey: 'gasCost',
        stroke: TENANT_COLORS.orange,
        gradientId: 'orangeGradient'
      });
    }
    
    if (activeUtilities.water) {
      lines.push({
        dataKey: 'waterCost',
        stroke: TENANT_COLORS.teal,
        gradientId: 'tealGradient'
      });
    }
    
    return lines;
  };

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
      
      <StyledAreaChart
        data={data}
        dataKey="electricityCost"
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
    </div>
  );
};

export default UtilityChart;
