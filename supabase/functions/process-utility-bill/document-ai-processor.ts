
// Function to process document with Google Document AI
export async function processDocumentWithGoogleDocAI(
  base64Content: string, 
  fileName: string, 
  googleApiKey: string, 
  processorId: string,
  documentType: string = 'utility'
) {
  try {
    const fileType = fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';
    
    // Prepare the Document AI API request
    const endpoint = `https://documentai.googleapis.com/v1/${processorId}:process`;
    
    console.log(`Preparing Document AI request to ${endpoint} for ${documentType} document`);
    
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
    
    return result;
  } catch (error) {
    console.error(`Error in Document AI processing for ${documentType}:`, error);
    throw error;
  }
}
