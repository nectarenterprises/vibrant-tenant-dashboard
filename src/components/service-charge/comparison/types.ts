
export interface ServiceChargeComparisonItem {
  category: string;
  currentYear: number;
  previousYear: number;
  percentChange: number;
}

export type ComparisonPeriod = 'annual' | 'quarterly';
export type ViewMode = 'chart' | 'table';
