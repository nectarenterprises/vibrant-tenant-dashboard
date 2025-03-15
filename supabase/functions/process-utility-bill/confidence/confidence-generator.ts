
import { getAverageEntityConfidence } from '../helpers/extraction-helpers.ts';

// Function to generate confidence scores from Document AI response based on document type
export function generateConfidenceScores(document: any, documentType: string = 'utility') {
  switch (documentType) {
    case 'utility':
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
      
    case 'lease':
      return {
        tenantName: getAverageEntityConfidence(document, 'tenant_name') || 0.8,
        landlordName: getAverageEntityConfidence(document, 'landlord_name') || 0.8,
        startDate: getAverageEntityConfidence(document, 'lease_start_date') || 0.85,
        endDate: getAverageEntityConfidence(document, 'lease_end_date') || 0.85,
        rentalValue: getAverageEntityConfidence(document, 'rental_amount') || 0.9,
        depositAmount: getAverageEntityConfidence(document, 'deposit_amount') || 0.7,
        paymentFrequency: getAverageEntityConfidence(document, 'payment_frequency') || 0.7,
        noticeDate: getAverageEntityConfidence(document, 'notice_date') || 0.6,
        isBreakerClause: getAverageEntityConfidence(document, 'break_clause') || 0.6
      };
      
    case 'service-charge':
      return {
        budgetYear: getAverageEntityConfidence(document, 'budget_year') || 0.9,
        periodStart: getAverageEntityConfidence(document, 'period_start') || 0.8,
        periodEnd: getAverageEntityConfidence(document, 'period_end') || 0.8,
        totalBudget: getAverageEntityConfidence(document, 'total_budget') || 0.85,
        categoryBreakdown: getAverageEntityConfidence(document, 'category_breakdown') || 0.7,
        unitCounts: getAverageEntityConfidence(document, 'unit_counts') || 0.6,
        unitCosts: getAverageEntityConfidence(document, 'unit_costs') || 0.6
      };
      
    case 'compliance':
      return {
        complianceType: getAverageEntityConfidence(document, 'compliance_type') || 0.9,
        issueDate: getAverageEntityConfidence(document, 'issue_date') || 0.85,
        expiryDate: getAverageEntityConfidence(document, 'expiry_date') || 0.85,
        assessorName: getAverageEntityConfidence(document, 'assessor_name') || 0.7,
        companyName: getAverageEntityConfidence(document, 'company_name') || 0.7,
        certificateNumber: getAverageEntityConfidence(document, 'certificate_number') || 0.8,
        rating: getAverageEntityConfidence(document, 'rating') || 0.6,
        isCompliant: getAverageEntityConfidence(document, 'compliance_status') || 0.9
      };
      
    default:
      // Return utility scores if type not recognized
      return generateConfidenceScores(document, 'utility');
  }
}
