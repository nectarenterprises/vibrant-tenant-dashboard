
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

// Parse entities from Document AI response
export function parseDocumentEntities(document: any) {
  try {
    // Default utility type extraction based on content
    let utilityType = 'other';
    const text = document.text.toLowerCase();
    
    if (text.includes('electric') || text.includes('power') || text.includes('kwh')) {
      utilityType = 'electricity';
    } else if (text.includes('gas') || text.includes('natural gas') || text.includes('therms')) {
      utilityType = 'gas';
    } else if (text.includes('water') || text.includes('sewage') || text.includes('gallons')) {
      utilityType = 'water';
    }
    
    // Extract entities
    const entities = document.entities || [];
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
    
    // Generate dates if not found in entities
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
    
    return fields;
  } catch (error) {
    console.error('Error parsing document entities:', error);
    return getDefaultUtilityData();
  }
}

// Function to generate confidence scores from Document AI response
export function generateConfidenceScores(document: any) {
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
    const payload = {
      rawDocument: {
        content: base64Content,
        mimeType: fileType
      }
    };
    
    console.log(`Sending request to Document AI: ${endpoint}`);
    
    // Call the Document AI API
    const response = await fetch(`${endpoint}?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
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
