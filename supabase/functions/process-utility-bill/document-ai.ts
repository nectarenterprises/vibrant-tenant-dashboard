
// Function to process a document with Google Document AI
export async function processDocumentWithGoogleDocAI(
  base64Content,
  fileName,
  apiKey,
  processorId,
  documentType
) {
  try {
    console.log(`Processing document ${fileName} with Google Document AI`);
    
    // Form the request URL with the processor ID
    const url = `https://documentai.googleapis.com/v1/projects/project-id/locations/us/processors/${processorId}:process`;
    
    // Prepare the request body
    const requestBody = {
      rawDocument: {
        content: base64Content,
        mimeType: getMimeType(fileName),
      },
    };
    
    // Send the request to Google Document AI
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Document AI API error: ${response.status} ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Process the extracted data based on document type
    let extractedData;
    if (documentType === 'utility') {
      extractedData = extractUtilityBillData(data);
    } else {
      extractedData = extractGenericData(data);
    }
    
    return {
      success: true,
      extractedData: extractedData.data,
      confidenceScores: extractedData.confidenceScores,
    };
  } catch (error) {
    console.error('Error processing document with Document AI:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Helper function to determine mime type based on file name
function getMimeType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'tiff':
      return 'image/tiff';
    default:
      return 'application/pdf'; // Default to PDF
  }
}

// Extract utility bill data from Document AI response
function extractUtilityBillData(documentAiResponse) {
  try {
    // In a real implementation, you would extract specific fields based on
    // the Document AI processor output structure. This is a simplified version.
    const entities = documentAiResponse.document?.entities || [];
    
    const data = {
      amount: findEntityValue(entities, 'amount'),
      date: findEntityValue(entities, 'date'),
      supplier: findEntityValue(entities, 'supplier'),
      accountNumber: findEntityValue(entities, 'account_number'),
      period: {
        start: findEntityValue(entities, 'period_start'),
        end: findEntityValue(entities, 'period_end'),
      },
      usage: findEntityValue(entities, 'usage'),
      rate: findEntityValue(entities, 'rate'),
    };
    
    const confidenceScores = {
      amount: findEntityConfidence(entities, 'amount'),
      date: findEntityConfidence(entities, 'date'),
      supplier: findEntityConfidence(entities, 'supplier'),
      accountNumber: findEntityConfidence(entities, 'account_number'),
      periodStart: findEntityConfidence(entities, 'period_start'),
      periodEnd: findEntityConfidence(entities, 'period_end'),
      usage: findEntityConfidence(entities, 'usage'),
      rate: findEntityConfidence(entities, 'rate'),
    };
    
    return { data, confidenceScores };
  } catch (error) {
    console.error('Error extracting utility bill data:', error);
    return {
      data: {},
      confidenceScores: {},
    };
  }
}

// Extract generic data from Document AI response
function extractGenericData(documentAiResponse) {
  try {
    // A simplified generic extractor that returns basic text from the document
    const text = documentAiResponse.document?.text || '';
    
    return {
      data: { text },
      confidenceScores: { text: 1.0 },
    };
  } catch (error) {
    console.error('Error extracting generic data:', error);
    return {
      data: {},
      confidenceScores: {},
    };
  }
}

// Helper function to find entity value by type
function findEntityValue(entities, type) {
  const entity = entities.find(e => e.type === type);
  return entity ? entity.mentionText : null;
}

// Helper function to find entity confidence by type
function findEntityConfidence(entities, type) {
  const entity = entities.find(e => e.type === type);
  return entity ? entity.confidence : 0;
}
