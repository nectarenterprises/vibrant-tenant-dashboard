
import React from 'react';

interface UtilityChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const UtilityChartTooltip: React.FC<UtilityChartTooltipProps> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-morphism p-3 rounded-lg shadow-lg text-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => {
          // Determine if this is a cost or usage entry
          const isCost = entry.dataKey.includes('Cost');
          const matchingItem = payload.find((item) => 
            item.dataKey.includes(entry.dataKey.split('Cost')[0]+'Usage')
          );
          
          const usageValue = isCost && matchingItem ? matchingItem.value : null;
          
          return (
            <div key={`item-${index}`} className="flex items-center gap-2 mt-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <p style={{ color: entry.color }}>
                {isCost ? (
                  <>
                    £{entry.value.toFixed(2)}
                    {usageValue && <span className="text-xs ml-1">({getUtilityUnit(entry.dataKey)}: {usageValue})</span>}
                  </>
                ) : !entry.dataKey.includes('Usage') && (
                  `${entry.value.toFixed(2)} units`
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Helper function to get the utility unit based on the dataKey
const getUtilityUnit = (dataKey: string) => {
  if (dataKey.includes('gas')) return 'm³';
  if (dataKey.includes('water')) return 'm³';
  if (dataKey.includes('electricity')) return 'kWh';
  return 'units';
};

export default UtilityChartTooltip;
