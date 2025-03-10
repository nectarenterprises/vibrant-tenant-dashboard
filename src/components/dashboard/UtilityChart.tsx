
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Zap, Droplets, Flame, ChevronDown } from 'lucide-react';
import { UtilityData, Property } from '@/types/property';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const utilityClasses = {
    gas: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.gas 
          ? 'bg-tenant-orange/10 border-tenant-orange/30 text-tenant-orange' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Flame className="h-4 w-4" />
    },
    water: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.water 
          ? 'bg-tenant-teal/10 border-tenant-teal/30 text-tenant-teal' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Droplets className="h-4 w-4" />
    },
    electricity: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.electricity 
          ? 'bg-tenant-purple/10 border-tenant-purple/30 text-tenant-purple' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Zap className="h-4 w-4" />
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-morphism p-3 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => {
            // Determine if this is a cost or usage entry
            const isCost = entry.dataKey.includes('Cost');
            const matchingItem = payload.find((item: any) => 
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
  
  const getUtilityUnit = (dataKey: string) => {
    if (dataKey.includes('gas')) return 'm³';
    if (dataKey.includes('water')) return 'm³';
    if (dataKey.includes('electricity')) return 'kWh';
    return 'units';
  };

  return (
    <div className="utility-chart-container animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col mb-3 sm:mb-0">
          <h3 className="text-lg font-bold">Utility Usage & Costs</h3>
          {properties.length > 0 && (
            <div className="mt-2">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            className={utilityClasses.gas.button}
            onClick={() => toggleUtility('gas')}
          >
            {utilityClasses.gas.icon}
            <span>Gas</span>
          </button>
          <button 
            className={utilityClasses.water.button}
            onClick={() => toggleUtility('water')}
          >
            {utilityClasses.water.icon}
            <span>Water</span>
          </button>
          <button 
            className={utilityClasses.electricity.button}
            onClick={() => toggleUtility('electricity')}
          >
            {utilityClasses.electricity.icon}
            <span>Electricity</span>
          </button>
        </div>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UtilityChart;
