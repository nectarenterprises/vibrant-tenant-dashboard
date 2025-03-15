
import { formatDate } from './utils.ts';

// Mock function to simulate extraction - used as fallback if real processing fails
export function simulateExtractionForDemo(documentName: string, documentType: string = 'utility') {
  // Determine which type of document to simulate
  switch (documentType) {
    case 'utility':
      return simulateUtilityBill(documentName);
    case 'lease':
      return simulateLeaseAgreement(documentName);
    case 'service-charge':
      return simulateServiceChargeBudget(documentName);
    case 'compliance':
      return simulateComplianceDocument(documentName);
    default:
      // Fallback to utility bill if type not recognized
      return simulateUtilityBill(documentName);
  }
}

// Simulate utility bill data
function simulateUtilityBill(documentName: string) {
  // Generate random but plausible utility bill data
  const utilityTypes = ['electricity', 'gas', 'water', 'other'] as const;
  const utilityType = utilityTypes[Math.floor(Math.random() * utilityTypes.length)];
  
  const today = new Date();
  const billDate = new Date(today);
  billDate.setDate(billDate.getDate() - Math.floor(Math.random() * 30));
  
  const periodStart = new Date(billDate);
  periodStart.setDate(periodStart.getDate() - 30);
  
  const periodEnd = new Date(billDate);
  periodEnd.setDate(periodEnd.getDate() - 1);
  
  const totalAmount = parseFloat((Math.random() * 200 + 50).toFixed(2));
  const usageQuantity = parseFloat((Math.random() * 500 + 100).toFixed(2));
  
  let usageUnit;
  switch (utilityType) {
    case 'electricity':
      usageUnit = 'kWh';
      break;
    case 'gas':
      usageUnit = 'm³';
      break;
    case 'water':
      usageUnit = 'gallons';
      break;
    default:
      usageUnit = 'units';
  }
  
  const meterReference = `MET${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
  
  const rateInformation = {
    baseRate: parseFloat((Math.random() * 0.5 + 0.1).toFixed(4)),
    standingCharge: parseFloat((Math.random() * 20 + 5).toFixed(2)),
    taxes: parseFloat((Math.random() * 30 + 10).toFixed(2))
  };
  
  // Create confidence scores (higher for important fields)
  const confidenceScores = {
    utilityType: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    billDate: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    periodStart: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    periodEnd: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    totalAmount: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    usageQuantity: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    usageUnit: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    meterReference: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
    rateInformation: parseFloat((Math.random() * 0.5 + 0.5).toFixed(2))
  };
  
  return {
    data: {
      utilityType,
      billDate: billDate.toISOString().split('T')[0],
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
      totalAmount,
      usageQuantity,
      usageUnit,
      meterReference,
      rateInformation
    },
    confidenceScores
  };
}

// Simulate lease agreement data
function simulateLeaseAgreement(documentName: string) {
  // Generate random but plausible lease agreement data
  const today = new Date();
  
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - Math.floor(Math.random() * 6));
  
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + Math.floor(Math.random() * 5) + 1);
  
  const noticeDate = new Date(endDate);
  noticeDate.setMonth(noticeDate.getMonth() - 6);
  
  const rentalValue = parseFloat((Math.random() * 5000 + 1000).toFixed(2));
  const depositAmount = parseFloat((rentalValue * 1.5).toFixed(2));
  
  const tenantNames = [
    "John Smith",
    "Sarah Johnson",
    "Michael Williams",
    "Emma Brown",
    "James Taylor"
  ];
  
  const tenantName = tenantNames[Math.floor(Math.random() * tenantNames.length)];
  
  const landlordNames = [
    "Property Holdings Ltd",
    "City Estates",
    "Metropolitan Rentals",
    "Urban Dwellings",
    "Premier Properties"
  ];
  
  const landlordName = landlordNames[Math.floor(Math.random() * landlordNames.length)];
  
  const paymentFrequencies = ["monthly", "quarterly", "annually"];
  const paymentFrequency = paymentFrequencies[Math.floor(Math.random() * paymentFrequencies.length)];
  
  // Create confidence scores
  const confidenceScores = {
    tenantName: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    landlordName: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    startDate: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    endDate: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    rentalValue: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    depositAmount: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    paymentFrequency: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    noticeDate: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2))
  };
  
  return {
    data: {
      tenantName,
      landlordName,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      rentalValue,
      depositAmount,
      paymentFrequency,
      noticeDate: noticeDate.toISOString().split('T')[0],
      additionalTerms: "Standard terms and conditions apply.",
      isBreakerClause: Math.random() > 0.5
    },
    confidenceScores
  };
}

// Simulate service charge budget data
function simulateServiceChargeBudget(documentName: string) {
  // Generate random but plausible service charge budget data
  const today = new Date();
  
  const budgetYear = today.getFullYear() + (Math.random() > 0.5 ? 0 : 1);
  
  const periodStart = new Date(budgetYear, 0, 1);
  const periodEnd = new Date(budgetYear, 11, 31);
  
  const totalBudget = parseFloat((Math.random() * 50000 + 10000).toFixed(2));
  
  // Generate category breakdowns
  const categories = [
    { name: "Building Insurance", percent: 0.15 },
    { name: "Property Management", percent: 0.12 },
    { name: "Cleaning and Waste", percent: 0.18 },
    { name: "Repairs and Maintenance", percent: 0.25 },
    { name: "Utilities", percent: 0.2 },
    { name: "Security", percent: 0.1 }
  ];
  
  let remainingPercent = 1.0;
  const categoryBreakdown = categories.map(category => {
    // Adjust the last percentage to ensure sum is 100%
    const isLast = categories.indexOf(category) === categories.length - 1;
    let actualPercent = isLast ? remainingPercent : category.percent * (0.9 + Math.random() * 0.2);
    
    if (!isLast) {
      remainingPercent -= actualPercent;
    }
    
    return {
      category: category.name,
      amount: parseFloat((totalBudget * actualPercent).toFixed(2)),
      percent: parseFloat((actualPercent * 100).toFixed(1))
    };
  });
  
  // Calculate per unit costs for different unit types
  const unitCounts = {
    studio: Math.floor(Math.random() * 10) + 5,
    oneBed: Math.floor(Math.random() * 15) + 10,
    twoBed: Math.floor(Math.random() * 12) + 8,
    threeBed: Math.floor(Math.random() * 8) + 4
  };
  
  const totalUnits = unitCounts.studio + unitCounts.oneBed + unitCounts.twoBed + unitCounts.threeBed;
  
  const studioFactor = 0.7;
  const oneBedFactor = 1.0;
  const twoBedFactor = 1.3;
  const threeBedFactor = 1.6;
  
  const totalFactors = (
    unitCounts.studio * studioFactor +
    unitCounts.oneBed * oneBedFactor +
    unitCounts.twoBed * twoBedFactor +
    unitCounts.threeBed * threeBedFactor
  );
  
  const baseUnitCost = totalBudget / totalFactors;
  
  const unitCosts = {
    studio: parseFloat((baseUnitCost * studioFactor).toFixed(2)),
    oneBed: parseFloat((baseUnitCost * oneBedFactor).toFixed(2)),
    twoBed: parseFloat((baseUnitCost * twoBedFactor).toFixed(2)),
    threeBed: parseFloat((baseUnitCost * threeBedFactor).toFixed(2))
  };
  
  // Create confidence scores
  const confidenceScores = {
    budgetYear: parseFloat((Math.random() * 0.1 + 0.9).toFixed(2)),
    periodStart: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    periodEnd: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    totalBudget: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    categoryBreakdown: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    unitCounts: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
    unitCosts: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2))
  };
  
  return {
    data: {
      budgetYear,
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
      totalBudget,
      categoryBreakdown,
      unitCounts,
      unitCosts,
      notes: "Budget subject to annual review and adjustment."
    },
    confidenceScores
  };
}

// Simulate compliance document data
function simulateComplianceDocument(documentName: string) {
  // Generate random but plausible compliance document data
  const complianceTypes = [
    "Fire Safety Certificate",
    "Electrical Installation Certificate",
    "Energy Performance Certificate",
    "Gas Safety Certificate",
    "Asbestos Survey Report"
  ];
  
  const complianceType = complianceTypes[Math.floor(Math.random() * complianceTypes.length)];
  
  const today = new Date();
  const issueDate = new Date(today);
  issueDate.setMonth(today.getMonth() - Math.floor(Math.random() * 6));
  
  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + 1); // Most certificates valid for 1 year
  
  // For EPC, change validity to 10 years
  if (complianceType === "Energy Performance Certificate") {
    expiryDate.setFullYear(issueDate.getFullYear() + 10);
  }
  
  const assessorNames = [
    "Robert Johnson, RICS",
    "Amanda Smith, CIBSE",
    "David Wilson, NICEIC",
    "Susan Brown, CORGI",
    "Peter Thompson, Gas Safe"
  ];
  
  const assessorName = assessorNames[Math.floor(Math.random() * assessorNames.length)];
  
  const companyNames = [
    "SafeCert Inspections Ltd",
    "Compliance Solutions UK",
    "Property Standards Agency",
    "Building Safety Group",
    "Regulatory Assessments Ltd"
  ];
  
  const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
  
  const certificateNumber = `${complianceType.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  const ratings = ["A", "B", "C", "D", "E"];
  let rating = null;
  
  if (complianceType === "Energy Performance Certificate") {
    rating = ratings[Math.floor(Math.random() * ratings.length)];
  }
  
  const isCompliant = Math.random() > 0.1; // 90% compliance rate
  const recommendations = isCompliant ? [] : [
    "Upgrade fire alarm system to comply with BS 5839-1:2017",
    "Replace non-compliant fire doors on escape routes",
    "Install additional emergency lighting to BS 5266 standards"
  ];
  
  // Create confidence scores
  const confidenceScores = {
    complianceType: parseFloat((Math.random() * 0.1 + 0.9).toFixed(2)),
    issueDate: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    expiryDate: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    assessorName: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    companyName: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
    certificateNumber: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)),
    rating: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
    isCompliant: parseFloat((Math.random() * 0.1 + 0.9).toFixed(2))
  };
  
  return {
    data: {
      complianceType,
      issueDate: issueDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      assessorName,
      companyName,
      certificateNumber,
      rating,
      isCompliant,
      recommendations: isCompliant ? [] : recommendations
    },
    confidenceScores
  };
}
