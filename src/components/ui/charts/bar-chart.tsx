
import React from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { chartConfig, TENANT_COLORS, GlassTooltip } from './chart-config';

// Styled Bar Chart Component
interface StyledBarChartProps {
  data: any[];
  bars: {
    dataKey: string;
    fill: string;
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
  layout?: 'vertical' | 'horizontal';
  barSize?: number;
  stackId?: string;
}

export const StyledBarChart: React.FC<StyledBarChartProps> = ({
  data,
  bars,
  xAxisDataKey = 'name',
  height = 300,
  tooltipFormatter,
  xAxisTickFormatter,
  yAxisTickFormatter,
  className,
  showGrid = false,
  yAxisWidth = 50,
  layout = 'horizontal',
  barSize = 30,
  stackId,
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          layout={layout}
          barSize={barSize}
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
              horizontal={layout === 'horizontal'}
              vertical={layout === 'vertical'}
            />
          )}
          <XAxis 
            dataKey={layout === 'horizontal' ? xAxisDataKey : undefined}
            type={layout === 'horizontal' ? 'category' : 'number'}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={xAxisTickFormatter}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            dataKey={layout === 'vertical' ? xAxisDataKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            tickLine={false}
            axisLine={layout === 'vertical' ? { stroke: '#e5e7eb' } : false}
            width={yAxisWidth}
            tickFormatter={yAxisTickFormatter}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={<GlassTooltip formatter={tooltipFormatter} />}
            cursor={{ fill: '#f3f4f6', opacity: 0.3 }}
          />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.fill}
              radius={[chartConfig.cornerRadius, chartConfig.cornerRadius, 0, 0]}
              animationDuration={chartConfig.animationDuration}
              animationBegin={300 * index}
              stackId={stackId}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
