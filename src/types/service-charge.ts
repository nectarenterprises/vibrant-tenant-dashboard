
export interface ServiceChargeBudget {
  id: string;
  propertyId: string;
  year: number;
  periodType: string;
  totalAmount: number;
  isActual: boolean;
  breakdown: ServiceChargeCategoryBreakdown[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceChargeCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface ServiceChargeComparison {
  category: string;
  currentYear: number;
  previousYear: number;
  percentChange: number;
}

export interface BudgetComparisonProps {
  property: any;
  currentBudget?: ServiceChargeBudget;
  previousBudget?: ServiceChargeBudget;
}

export interface ServiceChargeDataItem {
  id: string;
  propertyId: string;
  category: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  periodType: string;
  year: number;
}

export interface FileComparisonData {
  fileName: string;
  year: number;
  totalAmount: number;
  breakdown: ServiceChargeCategoryBreakdown[];
}
