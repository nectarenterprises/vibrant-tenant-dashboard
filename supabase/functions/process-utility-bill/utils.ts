
// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get default utility data
export function getDefaultUtilityData() {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return {
    utilityType: 'electricity',
    billDate: formatDate(today),
    periodStart: formatDate(lastMonth),
    periodEnd: formatDate(today),
    totalAmount: 100,
    usageQuantity: 500,
    usageUnit: 'kWh',
    meterReference: 'METER123',
    rateInformation: {
      baseRate: 0.15,
      standingCharge: 10,
      taxes: 5
    }
  };
}
