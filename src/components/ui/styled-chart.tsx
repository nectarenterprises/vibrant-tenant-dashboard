
import React from 'react';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

// Chart configuration
const chartConfig = {
  areaFillOpacity: 0.6,
  strokeWidth: 2,
  activeDot: { r: 6, strokeWidth: 0 },
  dot: { r: 0 },  // Hide dots by default
  animationDuration: 1000,
  cornerRadius: 4,
  gridStroke: '#f0f0f0',
  gridStrokeDasharray: '3 3',
};

// Color palette based on tenant colors
const TENANT_COLORS = {
  primary: '#2D6A4F',
  secondary: '#40916C',
  tertiary: '#74C69D',
  quaternary: '#B7E4C7',
  orange: '#F97316',
  teal: '#0EA5E9',
  purple: '#8B5CF6',
};

// Themed gradients for area charts
const areaGradients = {
  green: [
    { offset: '0%', color: TENANT_COLORS.primary, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.primary, opacity: 0 },
  ],
  mint: [
    { offset: '0%', color: TENANT_COLORS.quaternary, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.quaternary, opacity: 0 },
  ],
  orange: [
    { offset: '0%', color: TENANT_COLORS.orange, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.orange, opacity: 0 }, 
  ],
  teal: [
    { offset: '0%', color: TENANT_COLORS.teal, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.teal, opacity: 0 },
  ],
  purple: [
    { offset: '0%', color: TENANT_COLORS.purple, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.purple, opacity: 0 },
  ],
};

// Custom tooltip component with glass morphism effect
export const GlassTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 my-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p style={{ color: entry.color }}>
              {entry.name}: {formatter ? formatter(entry.value, entry.name, entry) : entry.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
  stroke = TENANT_COLORS.primary,
  fill = TENANT_COLORS.primary,
  gradientId = 'greenGradient',
  height = 300,
  tooltipFormatter,
  xAxisTickFormatter,
  yAxisTickFormatter,
  className,
  additionalLines = [],
  showGrid = true,
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
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            fill={`url(#${gradientId})`}
            fillOpacity={chartConfig.areaFillOpacity}
            strokeWidth={chartConfig.strokeWidth}
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
              fill={line.gradientId ? `url(#${line.gradientId})` : undefined}
              fillOpacity={chartConfig.areaFillOpacity}
              strokeWidth={chartConfig.strokeWidth}
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
  showGrid = true,
  yAxisWidth = 50,
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

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
  showGrid = true,
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

export {
  TENANT_COLORS,
  chartConfig
};
