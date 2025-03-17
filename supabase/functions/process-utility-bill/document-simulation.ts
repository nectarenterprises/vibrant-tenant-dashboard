
// Function to simulate document extraction for demo purposes
export function simulateExtractionForDemo(documentName, documentType) {
  console.log(`Simulating extraction for ${documentType} document: ${documentName}`);
  
  // Generate random data based on document type
  if (documentType === 'utility') {
    return simulateUtilityBillExtraction(documentName);
  } else {
    return simulateGenericExtraction(documentName);
  }
}

// Simulate utility bill data extraction
function simulateUtilityBillExtraction(documentName) {
  // Create mock data with realistic utility bill information
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  // Format dates
  const billDate = formatDate(today);
  const periodStart = formatDate(lastMonth);
  const periodEnd = formatDate(today);
  
  // Generate random amount and usage
  const amount = (Math.random() * 200 + 50).toFixed(2);
  const usage = (Math.random() * 500 + 100).toFixed(1);
  const rate = (amount / usage).toFixed(4);
  
  // Determine utility type from filename (simplified)
  const utilityType = determineUtilityType(documentName);
  
  // Generate account number
  const accountNumber = `ACC-${Math.floor(Math.random() * 10000).toString().padStart(6, '0')}`;
  
  // Create supplier based on utility type
  const suppliers = {
    electricity: ['Edison Power', 'Spark Energy', 'Bright Electric'],
    gas: ['National Gas', 'Flame Energy', 'GasWorks'],
    water: ['Clear Waters', 'Aqua Utilities', 'Blue Stream'],
    default: ['Utility Provider', 'Energy Co', 'Resource Supply']
  };
  
  const supplierOptions = suppliers[utilityType] || suppliers.default;
  const supplier = supplierOptions[Math.floor(Math.random() * supplierOptions.length)];
  
  // Create mock extracted data
  const data = {
    amount: amount,
    date: billDate,
    supplier: supplier,
    accountNumber: accountNumber,
    utilityType: utilityType,
    period: {
      start: periodStart,
      end: periodEnd,
    },
    usage: usage,
    rate: rate,
    unit: getUnitForUtilityType(utilityType),
  };
  
  // Create mock confidence scores (all high for demo)
  const confidenceScores = {
    amount: 0.92,
    date: 0.95,
    supplier: 0.89,
    accountNumber: 0.97,
    utilityType: 0.94,
    periodStart: 0.88,
    periodEnd: 0.87, 
    usage: 0.91,
    rate: 0.86,
  };
  
  return { data, confidenceScores };
}

// Simulate generic document extraction
function simulateGenericExtraction(documentName) {
  // For non-utility documents, return a simpler data structure
  const data = {
    title: documentName.replace(/\.[^/.]+$/, ""), // Remove file extension
    extractedText: "This is simulated extracted text from the document. " + 
                   "In a real implementation, this would contain the actual text content " +
                   "extracted from the document using Document AI.",
    documentType: "generic",
    pageCount: Math.floor(Math.random() * 10) + 1,
  };
  
  const confidenceScores = {
    text: 0.93,
    title: 0.97,
    documentType: 0.88,
  };
  
  return { data, confidenceScores };
}

// Helper function to format date
function formatDate(date) {
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

// Helper function to determine utility type from document name
function determineUtilityType(documentName) {
  const name = documentName.toLowerCase();
  
  if (name.includes('electric') || name.includes('power') || name.includes('energy')) {
    return 'electricity';
  } else if (name.includes('gas') || name.includes('heat')) {
    return 'gas';
  } else if (name.includes('water') || name.includes('sewage')) {
    return 'water';
  }
  
  // Default - randomly assign a type
  const types = ['electricity', 'gas', 'water'];
  return types[Math.floor(Math.random() * types.length)];
}

// Helper function to get the appropriate unit for a utility type
function getUnitForUtilityType(type) {
  switch (type) {
    case 'electricity':
      return 'kWh';
    case 'gas':
      return 'm³';
    case 'water':
      return 'gallons';
    default:
      return 'units';
  }
}
