
import { formatDate } from '../utils.ts';
import { extractTextEntity, extractNumberEntity, extractDateEntity, extractWithRegex } from '../helpers/extraction-helpers.ts';

// Parser for utility bill documents
export function parseUtilityBillEntities(document: any, fullText: string) {
  // Default utility type extraction based on content
  let utilityType = 'other';
  const text = fullText.toLowerCase();
  
  if (text.includes('electric') || text.includes('power') || text.includes('kwh')) {
    utilityType = 'electricity';
  } else if (text.includes('gas') || text.includes('natural gas') || text.includes('therms')) {
    utilityType = 'gas';
  } else if (text.includes('water') || text.includes('sewage') || text.includes('gallons')) {
    utilityType = 'water';
  }
  
  // Extract entities
  const entities = document.entities || [];
  console.log(`Found ${entities.length} entities in utility bill document`);
  
  // Extract basic fields from entities
  const fields: any = {
    utilityType,
    billDate: extractDateEntity(entities, 'invoice_date'),
    periodStart: extractDateEntity(entities, 'service_period_start'),
    periodEnd: extractDateEntity(entities, 'service_period_end'),
    totalAmount: extractNumberEntity(entities, 'total_amount'),
    usageQuantity: extractNumberEntity(entities, 'usage_quantity'),
    usageUnit: extractTextEntity(entities, 'usage_unit'),
    meterReference: extractTextEntity(entities, 'meter_number')
  };
  
  // Extract rate information
  const baseRate = extractNumberEntity(entities, 'unit_price');
  const standingCharge = extractNumberEntity(entities, 'standing_charge');
  const taxes = extractNumberEntity(entities, 'tax_amount');
  
  fields.rateInformation = {
    baseRate: baseRate || 0,
    standingCharge: standingCharge || 0,
    taxes: taxes || 0
  };
  
  // Use regex-based extraction as fallback for fields that weren't found
  const regexExtractions = extractWithRegex(fullText, 'utility');
  
  // Fill in missing fields with regex extractions
  Object.keys(regexExtractions).forEach(key => {
    if (!fields[key] && key !== 'rateInformation') {
      fields[key] = regexExtractions[key];
    }
  });
  
  // Generate dates if not found in entities or regex
  const today = new Date();
  if (!fields.billDate) {
    fields.billDate = formatDate(today);
  }
  
  if (!fields.periodStart) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    fields.periodStart = formatDate(lastMonth);
  }
  
  if (!fields.periodEnd) {
    fields.periodEnd = formatDate(today);
  }
  
  // Ensure required fields have values
  if (!fields.totalAmount) {
    fields.totalAmount = 0;
  }
  
  if (!fields.usageUnit) {
    // Set default usage unit based on utility type
    switch (fields.utilityType) {
      case 'electricity':
        fields.usageUnit = 'kWh';
        break;
      case 'gas':
        fields.usageUnit = 'therms';
        break;
      case 'water':
        fields.usageUnit = 'gallons';
        break;
      default:
        fields.usageUnit = 'units';
    }
  }
  
  console.log('Extracted utility bill fields:', fields);
  return fields;
}
