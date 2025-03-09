
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
import { Zap, Droplets, Flame } from 'lucide-react';
import { UtilityData } from '@/types/property';

interface UtilityChartProps {
  data: UtilityData[];
}

const UtilityChart: React.FC<UtilityChartProps> = ({ data }) => {
  const [activeUtilities, setActiveUtilities] = useState({
    gas: true,
    water: true,
    electricity: true
  });

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
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mt-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <p style={{ color: entry.color }}>
                {entry.name}: {entry.value} units
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="utility-chart-container animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-lg font-bold mb-3 sm:mb-0">Utility Usage</h3>
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
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeUtilities.gas && (
              <Line 
                type="monotone" 
                dataKey="gas" 
                name="Gas"
                stroke="#F97316" 
                strokeWidth={2}
                dot={{ stroke: '#F97316', strokeWidth: 2, r: 3, fill: '#F97316' }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            )}
            {activeUtilities.water && (
              <Line 
                type="monotone" 
                dataKey="water" 
                name="Water"
                stroke="#0EA5E9" 
                strokeWidth={2}
                dot={{ stroke: '#0EA5E9', strokeWidth: 2, r: 3, fill: '#0EA5E9' }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationBegin={300}
              />
            )}
            {activeUtilities.electricity && (
              <Line 
                type="monotone" 
                dataKey="electricity" 
                name="Electricity"
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 3, fill: '#8B5CF6' }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationBegin={600}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UtilityChart;
