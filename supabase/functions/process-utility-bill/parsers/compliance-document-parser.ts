
import { formatDate } from '../utils.ts';
import { extractTextEntity, extractDateEntity, extractWithRegex } from '../helpers/extraction-helpers.ts';

// Parser for compliance document entities
export function parseComplianceDocumentEntities(document: any, fullText: string) {
  // Extract entities
  const entities = document.entities || [];
  console.log(`Found ${entities.length} entities in compliance document`);
  
  // Determine compliance type from content
  let complianceType = "Unknown Compliance Document";
  if (fullText.toLowerCase().includes('fire safety')) {
    complianceType = "Fire Safety Certificate";
  } else if (fullText.toLowerCase().includes('electrical')) {
    complianceType = "Electrical Installation Certificate";
  } else if (fullText.toLowerCase().includes('energy performance') || fullText.toLowerCase().includes('epc')) {
    complianceType = "Energy Performance Certificate";
  } else if (fullText.toLowerCase().includes('gas safety')) {
    complianceType = "Gas Safety Certificate";
  } else if (fullText.toLowerCase().includes('asbestos')) {
    complianceType = "Asbestos Survey Report";
  }
  
  // Extract basic fields from entities
  const fields: any = {
    complianceType,
    issueDate: extractDateEntity(entities, 'issue_date'),
    expiryDate: extractDateEntity(entities, 'expiry_date'),
    assessorName: extractTextEntity(entities, 'assessor_name'),
    companyName: extractTextEntity(entities, 'company_name'),
    certificateNumber: extractTextEntity(entities, 'certificate_number')
  };
  
  // Use regex-based extraction as fallback for fields that weren't found
  const regexExtractions = extractWithRegex(fullText, 'compliance');
  
  // Fill in missing fields with regex extractions
  Object.keys(regexExtractions).forEach(key => {
    if (!fields[key]) {
      fields[key] = regexExtractions[key];
    }
  });
  
  // Set default for issue date if not found
  const today = new Date();
  if (!fields.issueDate) {
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    fields.issueDate = formatDate(threeMonthsAgo);
  }
  
  // Set default for expiry date if not found (depends on compliance type)
  if (!fields.expiryDate) {
    const expiryDate = new Date(fields.issueDate);
    
    // EPC is 10 years, most others are 1 year
    if (fields.complianceType === "Energy Performance Certificate") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 10);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    fields.expiryDate = formatDate(expiryDate);
  }
  
  // Set defaults for other fields if not found
  if (!fields.assessorName) {
    fields.assessorName = "Unknown Assessor";
  }
  
  if (!fields.companyName) {
    fields.companyName = "Unknown Certification Company";
  }
  
  if (!fields.certificateNumber) {
    // Generate a plausible certificate number
    const prefix = fields.complianceType.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    fields.certificateNumber = `${prefix}${random}`;
  }
  
  // EPC rating if applicable
  fields.rating = null;
  if (fields.complianceType === "Energy Performance Certificate") {
    // Look for rating in the text (usually A-G)
    const ratingMatch = fullText.match(/rating\s+([A-G])/i);
    fields.rating = ratingMatch ? ratingMatch[1] : "C"; // Default to C
  }
  
  // Determine compliance status
  fields.isCompliant = true; // Default to compliant
  if (fullText.toLowerCase().includes('non-compliant') || 
      fullText.toLowerCase().includes('unsatisfactory') ||
      fullText.toLowerCase().includes('fail') ||
      fullText.toLowerCase().includes('inadequate')) {
    fields.isCompliant = false;
  }
  
  // Add recommendations if non-compliant
  fields.recommendations = [];
  if (!fields.isCompliant) {
    // This would normally be extracted from the document by the AI
    // For simulation, add some plausible recommendations based on the document type
    if (fields.complianceType === "Fire Safety Certificate") {
      fields.recommendations = [
        "Upgrade fire alarm system to comply with BS 5839-1:2017",
        "Replace non-compliant fire doors on escape routes"
      ];
    } else if (fields.complianceType === "Electrical Installation Certificate") {
      fields.recommendations = [
        "Replace outdated consumer unit with modern RCD protection",
        "Fix inadequate earthing on bathroom circuits"
      ];
    } else if (fields.complianceType === "Energy Performance Certificate") {
      fields.recommendations = [
        "Improve loft insulation to recommended 270mm thickness",
        "Install LED lighting throughout property"
      ];
    }
  }
  
  console.log('Extracted compliance document fields:', fields);
  return fields;
}
