
import React from 'react';

// Color palette based on tenant colors
export const TENANT_COLORS = {
  primary: '#2D6A4F',
  secondary: '#40916C',
  tertiary: '#74C69D',
  quaternary: '#B7E4C7',
  orange: '#F97316',
  teal: '#0EA5E9',
  purple: '#8B5CF6',
  chartGreen: '#2D6A4F',
  chartPink: '#FFEAE2',
};

// Chart configuration
export const chartConfig = {
  areaFillOpacity: 0.7,
  strokeWidth: 3,
  activeDot: { r: 6, strokeWidth: 0 },
  dot: { r: 0 },  // Hide dots by default
  animationDuration: 1000,
  cornerRadius: 4,
  gridStroke: '#f0f0f0',
  gridStrokeDasharray: '3 3',
};

// Themed gradients for area charts
export const areaGradients = {
  green: [
    { offset: '0%', color: TENANT_COLORS.chartGreen, opacity: 0.8 },
    { offset: '100%', color: TENANT_COLORS.chartGreen, opacity: 0 },
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
