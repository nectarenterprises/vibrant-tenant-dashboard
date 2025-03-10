
import React from 'react';
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
import { Zap } from 'lucide-react';

// Mock data for electricity usage
const mockElectricityData = [
  { month: 'Jan', usage: 320, cost: 80 },
  { month: 'Feb', usage: 300, cost: 75 },
  { month: 'Mar', usage: 340, cost: 85 },
  { month: 'Apr', usage: 280, cost: 70 },
  { month: 'May', usage: 290, cost: 72.5 },
  { month: 'Jun', usage: 350, cost: 87.5 }
];

const ElectricityChart: React.FC = () => {
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
                {entry.name === 'Usage (kWh)' 
                  ? `${entry.value} kWh` 
                  : `£${entry.value}`}
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-2 rounded-full">
            <Zap className="h-5 w-5 text-tenant-purple" />
          </div>
          <h3 className="text-lg font-bold">Electricity Usage & Cost</h3>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockElectricityData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 50']}
              label={{ value: 'Usage (kWh)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 10']}
              label={{ value: 'Cost (£)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="usage" 
              name="Usage (kWh)"
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 3, fill: '#8B5CF6' }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cost" 
              name="Cost (£)"
              stroke="#4C1D95" 
              strokeWidth={2}
              dot={{ stroke: '#4C1D95', strokeWidth: 2, r: 3, fill: '#4C1D95' }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
              animationBegin={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElectricityChart;
