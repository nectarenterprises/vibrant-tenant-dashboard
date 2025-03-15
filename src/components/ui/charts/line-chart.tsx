
import React from 'react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { chartConfig, TENANT_COLORS, GlassTooltip } from './chart-config';

// Styled Line Chart Component
interface StyledLineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    stroke: string;
    name?: string;
  }[];
  xAxisDataKey?: string;
  height?: number | string;
  tooltipFormatter?: (value: any, name?: string, entry?: any) => any;
  xAxisTickFormatter?: (value: any) => any;
  yAxisTickFormatter?: (value: any) => any;
  className?: string;
  showGrid?: boolean;
  yAxisWidth?: number;
}

export const StyledLineChart: React.FC<StyledLineChartProps> = ({
  data,
  lines,
  xAxisDataKey = 'name',
  height = 300,
  tooltipFormatter,
  xAxisTickFormatter,
  yAxisTickFormatter,
  className,
  showGrid = false,
  yAxisWidth = 50,
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <pattern id="chartPattern" x="0" y="0" width="100%" height="100%">
              <rect x="0" y="0" width="100%" height="100%" fill={TENANT_COLORS.chartPink} />
            </pattern>
          </defs>
          
          {showGrid && (
            <CartesianGrid 
              stroke={chartConfig.gridStroke} 
              strokeDasharray={chartConfig.gridStrokeDasharray} 
              vertical={false}
            />
          )}
          <XAxis 
            dataKey={xAxisDataKey} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={xAxisTickFormatter}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
            tickFormatter={yAxisTickFormatter}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={<GlassTooltip formatter={tooltipFormatter} />}
            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Legend />
          
          {/* Background area with pattern fill */}
          <Area
            type="monotone"
            dataKey={lines[0].dataKey}
            stroke="transparent"
            fill="url(#chartPattern)"
            fillOpacity={1}
            strokeWidth={0}
          />
          
          {lines.map((line, index) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.stroke}
              strokeWidth={chartConfig.strokeWidth}
              dot={chartConfig.dot}
              activeDot={chartConfig.activeDot}
              animationDuration={chartConfig.animationDuration}
              animationBegin={300 * index}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
