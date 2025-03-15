
export type ReportType = 'property-summary' | 'service-charge' | 'document-inventory' | 'key-dates' | 'portfolio';

export interface ReportOptions {
  includeCharts: boolean;
  includeBranding: boolean;
  includeAppendix: boolean;
  sections: string[];
}

export interface ScheduledReport {
  id: string;
  name: string;
  reportType: ReportType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastRun: string | null;
  nextRun: string;
  recipients: string[];
  options: ReportOptions;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomReport {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  options: ReportOptions;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'text' | 'metrics';
  content: any;
  options?: Record<string, any>;
}
