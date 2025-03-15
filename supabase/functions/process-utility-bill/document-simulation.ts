
import { formatDate } from './utils.ts';

// Mock function to simulate extraction - used as fallback if real processing fails
export function simulateExtractionForDemo(documentName: string) {
  // Generate random but plausible utility bill data
  const utilityTypes = ['electricity', 'gas', 'water', 'other'] as const;
  const utilityType = utilityTypes[Math.floor(Math.random() * utilityTypes.length)];
  
  const today = new Date();
  const billDate = new Date(today);
  billDate.setDate(billDate.getDate() - Math.floor(Math.random() * 30));
  
  const periodStart = new Date(billDate);
  periodStart.setDate(periodStart.getDate() - 30);
  
  const periodEnd = new Date(billDate);
  periodEnd.setDate(periodEnd.getDate() - 1);
  
  const totalAmount = parseFloat((Math.random() * 200 + 50).toFixed(2));
  const usageQuantity = parseFloat((Math.random() * 500 + 100).toFixed(2));
  
  let usageUnit;
  switch (utilityType) {
    case 'electricity':
      usageUnit = 'kWh';
      break;
    case 'gas':
      usageUnit = 'm³';
      break;
    case 'water':
      usageUnit = 'gallons';
      break;
    default:
      usageUnit = 'units';
  }
  
  const meterReference = `MET${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
  
  const rateInformation = {
    baseRate: parseFloat((Math.random() * 0.5 + 0.1).toFixed(4)),
    standingCharge: parseFloat((Math.random() * 20 + 5).toFixed(2)),
    taxes: parseFloat((Math.random() * 30 + 10).toFixed(2))
  };
  
  // Create confidence scores (higher for important fields)
  const confidenceScores = {
    utilityType: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    billDate: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    periodStart: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    periodEnd: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    totalAmount: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    usageQuantity: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    usageUnit: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    meterReference: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
    rateInformation: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2))
  };
  
  return {
    data: {
      utilityType,
      billDate: billDate.toISOString().split('T')[0],
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
      totalAmount,
      usageQuantity,
      usageUnit,
      meterReference,
      rateInformation
    },
    confidenceScores
  };
}
