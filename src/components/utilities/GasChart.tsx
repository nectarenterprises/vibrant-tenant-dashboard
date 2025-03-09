
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
import { Flame } from 'lucide-react';

// Mock data for gas usage
const mockGasData = [
  { month: 'Jan', usage: 250, cost: 125 },
  { month: 'Feb', usage: 280, cost: 140 },
  { month: 'Mar', usage: 220, cost: 110 },
  { month: 'Apr', usage: 180, cost: 90 },
  { month: 'May', usage: 160, cost: 80 },
  { month: 'Jun', usage: 140, cost: 70 }
];

const GasChart: React.FC = () => {
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
                {entry.name === 'usage' 
                  ? `${entry.value} m³` 
                  : `$${entry.value}`}
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
          <div className="bg-orange-100 p-2 rounded-full">
            <Flame className="h-5 w-5 text-tenant-orange" />
          </div>
          <h3 className="text-lg font-bold">Gas Usage & Cost</h3>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockGasData}
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
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="usage" 
              name="Usage (m³)"
              stroke="#F97316" 
              strokeWidth={2}
              dot={{ stroke: '#F97316', strokeWidth: 2, r: 3, fill: '#F97316' }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cost" 
              name="Cost ($)"
              stroke="#C2410C" 
              strokeWidth={2}
              dot={{ stroke: '#C2410C', strokeWidth: 2, r: 3, fill: '#C2410C' }}
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

export default GasChart;
