
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
import { Droplets } from 'lucide-react';

// Mock data for water usage
const mockWaterData = [
  { month: 'Jan', usage: 42, cost: 36 },
  { month: 'Feb', usage: 38, cost: 33 },
  { month: 'Mar', usage: 45, cost: 38 },
  { month: 'Apr', usage: 40, cost: 34 },
  { month: 'May', usage: 43, cost: 37 },
  { month: 'Jun', usage: 48, cost: 41 }
];

const WaterChart: React.FC = () => {
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
                {entry.name === 'Usage (m³)' 
                  ? `${entry.value} m³` 
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
          <div className="bg-blue-100 p-2 rounded-full">
            <Droplets className="h-5 w-5 text-tenant-teal" />
          </div>
          <h3 className="text-lg font-bold">Water Usage & Cost</h3>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockWaterData}
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
              domain={[0, 'dataMax + 10']}
              label={{ value: 'Usage (m³)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 5']}
              label={{ value: 'Cost (£)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="usage" 
              name="Usage (m³)"
              stroke="#0EA5E9" 
              strokeWidth={2}
              dot={{ stroke: '#0EA5E9', strokeWidth: 2, r: 3, fill: '#0EA5E9' }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cost" 
              name="Cost (£)"
              stroke="#0369A1" 
              strokeWidth={2}
              dot={{ stroke: '#0369A1', strokeWidth: 2, r: 3, fill: '#0369A1' }}
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

export default WaterChart;
