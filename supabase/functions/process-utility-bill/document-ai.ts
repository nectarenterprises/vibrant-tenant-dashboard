
import { getDefaultUtilityData } from './utils.ts';
import { parseUtilityBillEntities } from './parsers/utility-bill-parser.ts';
import { parseLeaseAgreementEntities } from './parsers/lease-parser.ts';
import { parseServiceChargeEntities } from './parsers/service-charge-parser.ts';
import { parseComplianceDocumentEntities } from './parsers/compliance-document-parser.ts';
import { generateConfidenceScores } from './confidence/confidence-generator.ts';
import { processDocumentWithGoogleDocAI } from './document-ai-processor.ts';

// Parse entities from Document AI response based on document type
export function parseDocumentEntities(document: any, documentType: string = 'utility') {
  try {
    console.log(`Parsing ${documentType} document entities...`);
    
    // Get the full text for fallback extraction
    const fullText = document.text || '';
    
    // Choose the right parser based on document type
    switch (documentType) {
      case 'utility':
        return parseUtilityBillEntities(document, fullText);
      case 'lease':
        return parseLeaseAgreementEntities(document, fullText);
      case 'service-charge':
        return parseServiceChargeEntities(document, fullText);
      case 'compliance':
        return parseComplianceDocumentEntities(document, fullText);
      default:
        // Fallback to utility parser if type not recognized
        return parseUtilityBillEntities(document, fullText);
    }
  } catch (error) {
    console.error(`Error parsing ${documentType} document entities:`, error);
    // Return fallback data
    return getDefaultUtilityData();
  }
}

// Re-export the confidence score generator
export { generateConfidenceScores };

// Re-export the Document AI processor
export { processDocumentWithGoogleDocAI };
