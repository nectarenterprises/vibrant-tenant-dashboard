
import React from 'react';
import { 
  ResponsiveContainer,
  PieChart, 
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { chartConfig, TENANT_COLORS, GlassTooltip } from './chart-config';

// Styled Pie Chart Component
interface StyledPieChartProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  colorKey?: string;
  height?: number | string;
  tooltipFormatter?: (value: any, name?: string, entry?: any) => any;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  paddingAngle?: number;
}

export const StyledPieChart: React.FC<StyledPieChartProps> = ({
  data,
  dataKey,
  nameKey = 'name',
  colorKey,
  height = 300,
  tooltipFormatter,
  className,
  innerRadius = 0,
  outerRadius = 80,
  colors = [
    TENANT_COLORS.primary,
    TENANT_COLORS.secondary,
    TENANT_COLORS.tertiary,
    TENANT_COLORS.quaternary,
    TENANT_COLORS.orange,
    TENANT_COLORS.teal,
    TENANT_COLORS.purple,
  ],
  paddingAngle = 2,
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            animationDuration={chartConfig.animationDuration}
            label={({ name, value, percent }) => `${name}: ${Math.round(percent * 100)}%`}
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colorKey ? entry[colorKey] : colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<GlassTooltip formatter={tooltipFormatter} />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
