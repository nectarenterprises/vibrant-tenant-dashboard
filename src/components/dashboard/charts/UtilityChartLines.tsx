
import React from 'react';
import { Line } from 'recharts';

interface UtilityChartLinesProps {
  activeUtilities: {
    gas: boolean;
    water: boolean;
    electricity: boolean;
  };
}

const UtilityChartLines: React.FC<UtilityChartLinesProps> = ({ activeUtilities }) => {
  return (
    <>
      {activeUtilities.gas && (
        <>
          <Line 
            type="monotone" 
            dataKey="gasCost" 
            name="Gas"
            stroke="#F97316" 
            strokeWidth={2}
            dot={{ stroke: '#F97316', strokeWidth: 2, r: 3, fill: '#F97316' }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
          />
          <Line 
            type="monotone" 
            dataKey="gasUsage" 
            name=""  // Empty name to not show in legend
            stroke="transparent"  // Make the line invisible
            strokeWidth={0}
            dot={{ stroke: 'transparent', r: 0 }}
            activeDot={{ r: 0 }}
            legendType="none"  // Remove from legend completely
          />
        </>
      )}
      {activeUtilities.water && (
        <>
          <Line 
            type="monotone" 
            dataKey="waterCost" 
            name="Water"
            stroke="#0EA5E9" 
            strokeWidth={2}
            dot={{ stroke: '#0EA5E9', strokeWidth: 2, r: 3, fill: '#0EA5E9' }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
            animationBegin={300}
          />
          <Line 
            type="monotone" 
            dataKey="waterUsage" 
            name=""  // Empty name to not show in legend
            stroke="transparent"  // Make the line invisible
            strokeWidth={0}
            dot={{ stroke: 'transparent', r: 0 }}
            activeDot={{ r: 0 }}
            legendType="none"  // Remove from legend completely
          />
        </>
      )}
      {activeUtilities.electricity && (
        <>
          <Line 
            type="monotone" 
            dataKey="electricityCost" 
            name="Electricity"
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 3, fill: '#8B5CF6' }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
            animationBegin={600}
          />
          <Line 
            type="monotone" 
            dataKey="electricityUsage" 
            name=""  // Empty name to not show in legend
            stroke="transparent"  // Make the line invisible
            strokeWidth={0}
            dot={{ stroke: 'transparent', r: 0 }}
            activeDot={{ r: 0 }}
            legendType="none"  // Remove from legend completely
          />
        </>
      )}
    </>
  );
};

export default UtilityChartLines;
