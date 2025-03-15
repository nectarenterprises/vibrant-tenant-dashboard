
import React, { useState } from 'react';
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { UtilityData, Property } from '@/types/property';
import UtilityToggleButtons from './charts/UtilityToggleButtons';
import UtilityChartTooltip from './charts/UtilityChartTooltip';
import UtilityChartLines from './charts/UtilityChartLines';
import PropertySelector from './charts/PropertySelector';

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
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              label={{ value: 'Cost (£)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<UtilityChartTooltip />} />
            <Legend />
            <UtilityChartLines activeUtilities={activeUtilities} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UtilityChart;
