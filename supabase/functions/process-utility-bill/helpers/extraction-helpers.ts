
import { formatDate } from '../utils.ts';

// Helper functions for entity extraction
export function extractTextEntity(entities: any[], type: string): string {
  const entity = entities.find(e => e.type === type);
  return entity?.mentionText || '';
}

export function extractNumberEntity(entities: any[], type: string): number | null {
  const entity = entities.find(e => e.type === type);
  if (!entity || !entity.mentionText) return null;
  
  // Clean the value and convert to number
  const value = entity.mentionText.replace(/[^0-9.]/g, '');
  const number = parseFloat(value);
  return isNaN(number) ? null : number;
}

export function extractDateEntity(entities: any[], type: string): string {
  const entity = entities.find(e => e.type === type);
  if (!entity || !entity.normalizedValue || !entity.normalizedValue.dateValue) return '';
  
  const dateValue = entity.normalizedValue.dateValue;
  const year = dateValue.year || new Date().getFullYear();
  const month = dateValue.month || 1;
  const day = dateValue.day || 1;
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function getAverageEntityConfidence(document: any, type: string): number {
  try {
    const entities = document.entities || [];
    const matchingEntities = entities.filter((e: any) => e.type === type);
    
    if (matchingEntities.length === 0) return 0;
    
    const sum = matchingEntities.reduce((acc: number, entity: any) => {
      return acc + (entity.confidence || 0);
    }, 0);
    
    return sum / matchingEntities.length;
  } catch (error) {
    console.error('Error calculating entity confidence:', error);
    return 0;
  }
}

// Enhanced regex-based extraction as fallback for when entities aren't found
export function extractWithRegex(text: string, documentType: string) {
  const extractions: Record<string, any> = {};
  
  switch (documentType) {
    case 'utility':
      // Try to extract utility type from content
      if (text.toLowerCase().includes('electric') || text.toLowerCase().includes('kwh')) {
        extractions.utilityType = 'electricity';
      } else if (text.toLowerCase().includes('gas') || text.toLowerCase().includes('therm')) {
        extractions.utilityType = 'gas';
      } else if (text.toLowerCase().includes('water') || text.toLowerCase().includes('gallon')) {
        extractions.utilityType = 'water';
      }
      
      // Try to extract meter numbers
      const meterRegex = /(meter|reference)\s*#?\s*([A-Z0-9]{5,})/i;
      const meterMatch = text.match(meterRegex);
      if (meterMatch) {
        extractions.meterReference = meterMatch[2];
      }
      
      // Usage patterns for utility
      const usageRegex = /([0-9,.]+)\s*(kwh|kw|m3|gallons|therms|units)/i;
      const usageMatch = text.match(usageRegex);
      if (usageMatch) {
        extractions.usageQuantity = parseFloat(usageMatch[1].replace(/,/g, ''));
        extractions.usageUnit = usageMatch[2].toLowerCase();
      }
      break;
      
    case 'lease':
      // Look for tenant and landlord
      const tenantRegex = /(tenant|lessee)[\s:]*([A-Za-z\s]+)(?:,|\.|and)/i;
      const tenantMatch = text.match(tenantRegex);
      if (tenantMatch) {
        extractions.tenantName = tenantMatch[2].trim();
      }
      
      const landlordRegex = /(landlord|lessor)[\s:]*([A-Za-z\s]+)(?:,|\.|and)/i;
      const landlordMatch = text.match(landlordRegex);
      if (landlordMatch) {
        extractions.landlordName = landlordMatch[2].trim();
      }
      
      // Look for rental value
      const rentalRegex = /(rent|rental value|annual rent)[\s:]*[$£]?([0-9,.]+)/i;
      const rentalMatch = text.match(rentalRegex);
      if (rentalMatch) {
        extractions.rentalValue = parseFloat(rentalMatch[2].replace(/,/g, ''));
      }
      
      // Look for deposit
      const depositRegex = /(deposit|security)[\s:]*[$£]?([0-9,.]+)/i;
      const depositMatch = text.match(depositRegex);
      if (depositMatch) {
        extractions.depositAmount = parseFloat(depositMatch[2].replace(/,/g, ''));
      }
      
      // Look for payment frequency
      if (text.toLowerCase().includes('monthly')) {
        extractions.paymentFrequency = 'monthly';
      } else if (text.toLowerCase().includes('quarterly')) {
        extractions.paymentFrequency = 'quarterly';
      } else if (text.toLowerCase().includes('annually')) {
        extractions.paymentFrequency = 'annually';
      }
      
      // Check for break clause
      if (text.toLowerCase().includes('break clause') || text.toLowerCase().includes('termination option')) {
        extractions.isBreakerClause = true;
      }
      break;
      
    case 'service-charge':
      // Look for total budget
      const budgetRegex = /(total budget|total charge|annual charge)[\s:]*[$£]?([0-9,.]+)/i;
      const budgetMatch = text.match(budgetRegex);
      if (budgetMatch) {
        extractions.totalBudget = parseFloat(budgetMatch[2].replace(/,/g, ''));
      }
      
      // Look for budget year
      const yearRegex = /(budget|financial|year)[\s:]*([0-9]{4})/i;
      const yearMatch = text.match(yearRegex);
      if (yearMatch) {
        extractions.budgetYear = parseInt(yearMatch[2]);
      }
      break;
      
    case 'compliance':
      // Extract compliance type
      if (text.toLowerCase().includes('fire safety')) {
        extractions.complianceType = 'Fire Safety Certificate';
      } else if (text.toLowerCase().includes('electrical')) {
        extractions.complianceType = 'Electrical Installation Certificate';
      } else if (text.toLowerCase().includes('energy performance') || text.toLowerCase().includes('epc')) {
        extractions.complianceType = 'Energy Performance Certificate';
      } else if (text.toLowerCase().includes('gas safety')) {
        extractions.complianceType = 'Gas Safety Certificate';
      } else if (text.toLowerCase().includes('asbestos')) {
        extractions.complianceType = 'Asbestos Survey Report';
      }
      
      // Look for certificate number
      const certRegex = /(certificate|cert|reference)[\s#:]*([A-Z0-9-]{5,})/i;
      const certMatch = text.match(certRegex);
      if (certMatch) {
        extractions.certificateNumber = certMatch[2];
      }
      
      // Look for compliance status
      if (text.toLowerCase().includes('compliant') || text.toLowerCase().includes('satisfactory')) {
        extractions.isCompliant = true;
      } else if (text.toLowerCase().includes('non-compliant') || text.toLowerCase().includes('unsatisfactory')) {
        extractions.isCompliant = false;
      }
      
      // Look for EPC rating
      const ratingRegex = /rating\s+([A-G])/i;
      const ratingMatch = text.match(ratingRegex);
      if (ratingMatch) {
        extractions.rating = ratingMatch[1];
      }
      break;
  }
  
  // Try to find amounts (for all document types)
  const amountRegex = /\$\s*([0-9,]+\.[0-9]{2})/g;
  const amounts: number[] = [];
  let match;
  while ((match = amountRegex.exec(text)) !== null) {
    amounts.push(parseFloat(match[1].replace(/,/g, '')));
  }
  
  // Usually the largest amount is the total
  if (amounts.length > 0) {
    extractions.totalAmount = Math.max(...amounts);
  }
  
  // Try to find dates (for all document types)
  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const dates: Date[] = [];
  while ((match = dateRegex.exec(text)) !== null) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    
    // Fix two-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }
    
    dates.push(new Date(year, month - 1, day));
  }
  
  // Sort dates from oldest to newest
  dates.sort((a, b) => a.getTime() - b.getTime());
  
  if (dates.length >= 2) {
    extractions.periodStart = formatDate(dates[0]);
    extractions.periodEnd = formatDate(dates[dates.length - 1]);
    
    // Bill date is usually the newest date
    extractions.billDate = formatDate(dates[dates.length - 1]);
    
    // For lease/compliance documents
    extractions.issueDate = formatDate(dates[0]);
    extractions.expiryDate = formatDate(dates[dates.length - 1]);
    extractions.startDate = formatDate(dates[0]);
    extractions.endDate = formatDate(dates[dates.length - 1]);
  } else if (dates.length === 1) {
    extractions.billDate = formatDate(dates[0]);
    extractions.issueDate = formatDate(dates[0]);
  }
  
  return extractions;
}
