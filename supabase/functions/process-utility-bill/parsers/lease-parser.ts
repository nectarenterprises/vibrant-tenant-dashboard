
import { formatDate } from '../utils.ts';
import { extractTextEntity, extractNumberEntity, extractDateEntity, extractWithRegex } from '../helpers/extraction-helpers.ts';

// Parser for lease agreement documents
export function parseLeaseAgreementEntities(document: any, fullText: string) {
  // Extract entities
  const entities = document.entities || [];
  console.log(`Found ${entities.length} entities in lease agreement document`);
  
  // Extract basic fields from entities
  const fields: any = {
    tenantName: extractTextEntity(entities, 'tenant_name'),
    landlordName: extractTextEntity(entities, 'landlord_name'),
    startDate: extractDateEntity(entities, 'lease_start_date'),
    endDate: extractDateEntity(entities, 'lease_end_date'),
    rentalValue: extractNumberEntity(entities, 'rental_amount'),
    depositAmount: extractNumberEntity(entities, 'deposit_amount'),
    paymentFrequency: extractTextEntity(entities, 'payment_frequency'),
    noticeDate: extractDateEntity(entities, 'notice_date')
  };
  
  // Use regex-based extraction as fallback for fields that weren't found
  const regexExtractions = extractWithRegex(fullText, 'lease');
  
  // Fill in missing fields with regex extractions
  Object.keys(regexExtractions).forEach(key => {
    if (!fields[key]) {
      fields[key] = regexExtractions[key];
    }
  });
  
  // Set defaults for missing fields
  if (!fields.tenantName) fields.tenantName = "Unknown Tenant";
  if (!fields.landlordName) fields.landlordName = "Unknown Landlord";
  
  // Generate dates if not found
  const today = new Date();
  if (!fields.startDate) {
    fields.startDate = formatDate(today);
  }
  
  if (!fields.endDate) {
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    fields.endDate = formatDate(nextYear);
  }
  
  if (!fields.rentalValue) fields.rentalValue = 0;
  if (!fields.depositAmount) fields.depositAmount = fields.rentalValue * 1.5;
  if (!fields.paymentFrequency) fields.paymentFrequency = "monthly";
  
  // Calculate notice date if not found (typically 6 months before end)
  if (!fields.noticeDate) {
    const endDate = new Date(fields.endDate);
    const noticeDate = new Date(endDate);
    noticeDate.setMonth(noticeDate.getMonth() - 6);
    fields.noticeDate = formatDate(noticeDate);
  }
  
  // Check for breaker clause in text
  fields.isBreakerClause = fullText.toLowerCase().includes('break clause') || 
                          fullText.toLowerCase().includes('termination option') ||
                          regexExtractions.isBreakerClause || 
                          false;
  
  // Add default additional terms
  fields.additionalTerms = "Standard terms and conditions apply.";
  
  console.log('Extracted lease agreement fields:', fields);
  return fields;
}
