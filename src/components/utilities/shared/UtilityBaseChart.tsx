
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
import { LucideIcon } from 'lucide-react';

export interface UtilityBaseChartProps {
  data: Array<{ month: string; usage: number; cost: number }>;
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  primaryColor: string;
  secondaryColor: string;
  usageUnit: string;
}

const UtilityBaseChart: React.FC<UtilityBaseChartProps> = ({ 
  data, 
  title, 
  Icon, 
  iconColor, 
  iconBgColor, 
  primaryColor, 
  secondaryColor, 
  usageUnit 
}) => {
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
                {entry.name === `Usage (${usageUnit})` 
                  ? `${entry.value} ${usageUnit}` 
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
          <div className={`${iconBgColor} p-2 rounded-full`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
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
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 50']}
              label={{ value: `Usage (${usageUnit})`, angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[0, 'dataMax + 20']}
              label={{ value: 'Cost (£)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="usage" 
              name={`Usage (${usageUnit})`}
              stroke={primaryColor} 
              strokeWidth={2}
              dot={{ stroke: primaryColor, strokeWidth: 2, r: 3, fill: primaryColor }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cost" 
              name="Cost (£)"
              stroke={secondaryColor} 
              strokeWidth={2}
              dot={{ stroke: secondaryColor, strokeWidth: 2, r: 3, fill: secondaryColor }}
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

export default UtilityBaseChart;
