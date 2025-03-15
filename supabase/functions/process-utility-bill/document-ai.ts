
import { formatDate, getDefaultUtilityData } from './utils.ts';

// Helper functions for entity extraction
function extractTextEntity(entities: any[], type: string): string {
  const entity = entities.find(e => e.type === type);
  return entity?.mentionText || '';
}

function extractNumberEntity(entities: any[], type: string): number | null {
  const entity = entities.find(e => e.type === type);
  if (!entity || !entity.mentionText) return null;
  
  // Clean the value and convert to number
  const value = entity.mentionText.replace(/[^0-9.]/g, '');
  const number = parseFloat(value);
  return isNaN(number) ? null : number;
}

function extractDateEntity(entities: any[], type: string): string {
  const entity = entities.find(e => e.type === type);
  if (!entity || !entity.normalizedValue || !entity.normalizedValue.dateValue) return '';
  
  const dateValue = entity.normalizedValue.dateValue;
  const year = dateValue.year || new Date().getFullYear();
  const month = dateValue.month || 1;
  const day = dateValue.day || 1;
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

function getAverageEntityConfidence(document: any, type: string): number {
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
function extractWithRegex(text: string) {
  const extractions: Record<string, any> = {};
  
  // Try to extract utility type from content
  if (text.toLowerCase().includes('electric') || text.toLowerCase().includes('kwh')) {
    extractions.utilityType = 'electricity';
  } else if (text.toLowerCase().includes('gas') || text.toLowerCase().includes('therm')) {
    extractions.utilityType = 'gas';
  } else if (text.toLowerCase().includes('water') || text.toLowerCase().includes('gallon')) {
    extractions.utilityType = 'water';
  }
  
  // Try to extract amounts
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
  
  // Look for meter numbers
  const meterRegex = /(meter|reference)\s*#?\s*([A-Z0-9]{5,})/i;
  const meterMatch = text.match(meterRegex);
  if (meterMatch) {
    extractions.meterReference = meterMatch[2];
  }
  
  // Try to find dates
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
  } else if (dates.length === 1) {
    extractions.billDate = formatDate(dates[0]);
  }
  
  // Usage patterns
  const usageRegex = /([0-9,.]+)\s*(kwh|kw|m3|gallons|therms|units)/i;
  const usageMatch = text.match(usageRegex);
  if (usageMatch) {
    extractions.usageQuantity = parseFloat(usageMatch[1].replace(/,/g, ''));
    extractions.usageUnit = usageMatch[2].toLowerCase();
  }
  
  return extractions;
}

// Parse entities from Document AI response
export function parseDocumentEntities(document: any) {
  try {
    console.log('Parsing document entities...');
    
    // Get the full text for fallback extraction
    const fullText = document.text || '';
    
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
    console.log(`Found ${entities.length} entities in document`);
    
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
    const regexExtractions = extractWithRegex(fullText);
    
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
    
    console.log('Extracted fields:', fields);
    return fields;
  } catch (error) {
    console.error('Error parsing document entities:', error);
    return getDefaultUtilityData();
  }
}

// Function to generate confidence scores from Document AI response
export function generateConfidenceScores(document: any) {
  // Base confidence on entity extraction or set reasonable defaults
  return {
    utilityType: getAverageEntityConfidence(document, 'utility_type') || 0.8,
    billDate: getAverageEntityConfidence(document, 'invoice_date') || 0.85,
    periodStart: getAverageEntityConfidence(document, 'service_period_start') || 0.75,
    periodEnd: getAverageEntityConfidence(document, 'service_period_end') || 0.75,
    totalAmount: getAverageEntityConfidence(document, 'total_amount') || 0.9,
    usageQuantity: getAverageEntityConfidence(document, 'usage_quantity') || 0.7,
    usageUnit: getAverageEntityConfidence(document, 'usage_unit') || 0.7,
    meterReference: getAverageEntityConfidence(document, 'meter_number') || 0.6,
    rateInformation: getAverageEntityConfidence(document, 'rate') || 0.5
  };
}

// Function to process document with Google Document AI
export async function processDocumentWithGoogleDocAI(base64Content: string, fileName: string, googleApiKey: string, processorId: string) {
  try {
    const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';
    
    // Prepare the Document AI API request
    const endpoint = `https://documentai.googleapis.com/v1/${processorId}:process`;
    
    console.log(`Preparing Document AI request to ${endpoint}`);
    
    const payload = {
      rawDocument: {
        content: base64Content,
        mimeType: fileType
      }
    };
    
    // Call the Document AI API
    console.log('Sending request to Document AI');
    const response = await fetch(`${endpoint}?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Log response status
    console.log(`Document AI response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Document AI API error:', errorText);
      throw new Error(`Document AI API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Document AI processing complete');
    
    // Parse entities from the Document AI response
    const extractedData = parseDocumentEntities(result.document);
    
    // Generate confidence scores
    const confidenceScores = generateConfidenceScores(result.document);
    
    return {
      success: true,
      extractedData,
      confidenceScores
    };
  } catch (error) {
    console.error('Error in Document AI processing:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
