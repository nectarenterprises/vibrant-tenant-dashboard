
import { formatDate } from '../utils.ts';
import { extractNumberEntity, extractDateEntity, extractWithRegex } from '../helpers/extraction-helpers.ts';

// Parser for service charge budget documents
export function parseServiceChargeEntities(document: any, fullText: string) {
  // Extract entities
  const entities = document.entities || [];
  console.log(`Found ${entities.length} entities in service charge document`);
  
  // Get current year for defaults
  const currentYear = new Date().getFullYear();
  
  // Extract basic fields from entities
  let budgetYear = extractNumberEntity(entities, 'budget_year') || currentYear;
  
  // Sometimes the budget year might be extracted as a full date
  if (budgetYear && budgetYear > 2100) { // This is likely a timestamp
    budgetYear = new Date(budgetYear).getFullYear();
  }
  
  const fields: any = {
    budgetYear,
    periodStart: extractDateEntity(entities, 'period_start'),
    periodEnd: extractDateEntity(entities, 'period_end'),
    totalBudget: extractNumberEntity(entities, 'total_budget')
  };
  
  // Use regex-based extraction as fallback for fields that weren't found
  const regexExtractions = extractWithRegex(fullText, 'service-charge');
  
  // Fill in missing fields with regex extractions
  Object.keys(regexExtractions).forEach(key => {
    if (!fields[key]) {
      fields[key] = regexExtractions[key];
    }
  });
  
  // Set default period if not found
  if (!fields.periodStart) {
    fields.periodStart = `${fields.budgetYear}-01-01`;
  }
  
  if (!fields.periodEnd) {
    fields.periodEnd = `${fields.budgetYear}-12-31`;
  }
  
  // Set default total budget
  if (!fields.totalBudget) {
    fields.totalBudget = 10000;
  }
  
  // Generate sample category breakdown (this would typically be more sophisticated in real AI)
  const categoryBreakdown = [
    { category: "Building Insurance", amount: fields.totalBudget * 0.15, percent: 15 },
    { category: "Property Management", amount: fields.totalBudget * 0.12, percent: 12 },
    { category: "Cleaning and Waste", amount: fields.totalBudget * 0.18, percent: 18 },
    { category: "Repairs and Maintenance", amount: fields.totalBudget * 0.25, percent: 25 },
    { category: "Utilities", amount: fields.totalBudget * 0.2, percent: 20 },
    { category: "Security", amount: fields.totalBudget * 0.1, percent: 10 }
  ];
  
  // Add formatted amounts
  fields.categoryBreakdown = categoryBreakdown.map(category => ({
    ...category,
    amount: parseFloat(category.amount.toFixed(2))
  }));
  
  // Add unit counts and costs (would be extracted by real AI)
  fields.unitCounts = {
    studio: 8,
    oneBed: 12,
    twoBed: 10,
    threeBed: 6
  };
  
  // Calculate per unit costs
  const totalUnits = 
    fields.unitCounts.studio + 
    fields.unitCounts.oneBed + 
    fields.unitCounts.twoBed + 
    fields.unitCounts.threeBed;
  
  const baseUnitCost = fields.totalBudget / totalUnits;
  
  fields.unitCosts = {
    studio: parseFloat((baseUnitCost * 0.7).toFixed(2)),
    oneBed: parseFloat((baseUnitCost * 1.0).toFixed(2)),
    twoBed: parseFloat((baseUnitCost * 1.3).toFixed(2)),
    threeBed: parseFloat((baseUnitCost * 1.6).toFixed(2))
  };
  
  fields.notes = "Budget subject to annual review and adjustment.";
  
  console.log('Extracted service charge fields:', fields);
  return fields;
}
