
import React from 'react';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { chartConfig, TENANT_COLORS, areaGradients, GlassTooltip } from './chart-config';

// Styled Area Chart Component
interface StyledAreaChartProps {
  data: any[];
  dataKey: string;
  xAxisDataKey?: string;
  stroke?: string;
  fill?: string;
  gradientId?: string;
  height?: number | string;
  tooltipFormatter?: (value: any, name?: string, entry?: any) => any;
  xAxisTickFormatter?: (value: any) => any;
  yAxisTickFormatter?: (value: any) => any;
  className?: string;
  additionalLines?: {
    dataKey: string;
    stroke: string;
    gradientId?: string;
  }[];
  showGrid?: boolean;
  yAxisWidth?: number;
  legendPosition?: 'top' | 'bottom';
}

export const StyledAreaChart: React.FC<StyledAreaChartProps> = ({
  data,
  dataKey,
  xAxisDataKey = 'name',
  stroke = TENANT_COLORS.chartGreen,
  fill = TENANT_COLORS.chartGreen,
  gradientId = 'greenGradient',
  height = 300,
  tooltipFormatter,
  xAxisTickFormatter,
  yAxisTickFormatter,
  className,
  additionalLines = [],
  showGrid = false,
  yAxisWidth = 50,
  legendPosition = 'bottom',
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              {areaGradients.green.map((stop, index) => (
                <stop 
                  key={`stop-${index}`}
                  offset={stop.offset} 
                  stopColor={stop.color} 
                  stopOpacity={stop.opacity} 
                />
              ))}
            </linearGradient>
            {additionalLines.map((line, index) => {
              if (!line.gradientId) return null;
              const gradientKey = line.gradientId.replace('Gradient', '') as keyof typeof areaGradients;
              const gradient = areaGradients[gradientKey] || areaGradients.green;
              
              return (
                <linearGradient key={`grad-${index}`} id={line.gradientId} x1="0" y1="0" x2="0" y2="1">
                  {gradient.map((stop, stopIndex) => (
                    <stop 
                      key={`stop-${stopIndex}`}
                      offset={stop.offset} 
                      stopColor={stop.color} 
                      stopOpacity={stop.opacity} 
                    />
                  ))}
                </linearGradient>
              );
            })}
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
          <Legend align="center" verticalAlign={legendPosition} />
          
          {/* Background area with pattern fill */}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="transparent"
            fill="url(#chartPattern)"
            fillOpacity={1}
            strokeWidth={0}
          />
          
          {/* Main colored area */}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={chartConfig.strokeWidth}
            fill="transparent"
            dot={chartConfig.dot}
            activeDot={chartConfig.activeDot}
            animationDuration={chartConfig.animationDuration}
          />
          
          {additionalLines.map((line, index) => (
            <Area
              key={`line-${index}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={chartConfig.strokeWidth}
              fill="transparent"
              dot={chartConfig.dot}
              activeDot={chartConfig.activeDot}
              animationDuration={chartConfig.animationDuration}
              animationBegin={300 * (index + 1)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
