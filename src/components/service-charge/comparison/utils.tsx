
import React from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

export const getChangeColor = (percentChange: number): string => {
  if (percentChange < 0) return 'text-emerald-600';
  if (percentChange <= 5) return 'text-amber-600';
  return 'text-red-600';
};

export const getChangeBadgeColor = (percentChange: number): string => {
  if (percentChange < 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (percentChange <= 5) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

export const getBarColor = (percentChange: number): string => {
  if (percentChange < 0) return '#10b981'; // emerald-500
  if (percentChange <= 5) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

export const getChangeIcon = (percentChange: number): React.ReactElement => {
  if (percentChange < 0) return <ArrowDown className="h-3 w-3" />;
  return <ArrowUp className="h-3 w-3" />;
};

export const formatCurrency = (value: number): string => {
  return `£${value.toLocaleString('en-GB')}`;
};
