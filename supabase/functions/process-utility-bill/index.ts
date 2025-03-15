
import { corsHeaders } from './cors.ts';
import { createSupabaseClient, updateExtractionStatus } from './database.ts';
import { processDocumentWithGoogleDocAI } from './document-ai.ts';
import { simulateExtractionForDemo } from './document-simulation.ts';

interface RequestPayload {
  documentId: string;
  propertyId: string;
  userId: string;
}

// Main handler function for the edge function
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract the request payload
    const payload: RequestPayload = await req.json();
    const { documentId, propertyId, userId } = payload;

    if (!documentId || !propertyId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables for Google Document AI
    const googleApiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY') || '';
    const processorId = Deno.env.get('GOOGLE_DOCUMENT_AI_PROCESSOR_ID') || '';
    const useSimulation = !googleApiKey || !processorId || Deno.env.get('USE_SIMULATION') === 'true';

    // Output configuration for debugging
    console.log('Processing utility bill with configuration:');
    console.log(`Document ID: ${documentId}`);
    console.log(`Property ID: ${propertyId}`);
    console.log(`Google API Key Available: ${!!googleApiKey}`);
    console.log(`Processor ID Available: ${!!processorId}`);
    console.log(`Using Simulation: ${useSimulation}`);

    // Create Supabase client for database operations
    const supabase = createSupabaseClient();
    
    // Update extraction status to processing
    await updateExtractionStatus(supabase, documentId, 'processing');
    
    // Get document details for processing
    const { data: documentData, error: documentError } = await supabase
      .from('property_documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError || !documentData) {
      throw new Error('Document not found: ' + (documentError?.message || 'unknown error'));
    }
    
    // Use simulation instead of actual processing for now
    if (useSimulation) {
      console.log('Using simulated data extraction for demonstration');
      const mockExtractedData = simulateExtractionForDemo(documentData.name);
      
      // Update the extraction record with the simulated results
      await updateExtractionStatus(
        supabase,
        documentId,
        'completed',
        mockExtractedData.data,
        mockExtractedData.confidenceScores
      );
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedData: mockExtractedData.data,
          confidenceScores: mockExtractedData.confidenceScores,
          fallback: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // The following section will be executed when actual Document AI processing is available
    console.log(`Processing utility bill with Document AI: ${documentId} for property: ${propertyId}`);

    // Get document URL
    const { data: documentUrl } = supabase
      .storage
      .from('documents')
      .getPublicUrl(documentData.file_path);

    if (!documentUrl) {
      return new Response(
        JSON.stringify({ error: 'Document URL not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Document URL obtained:', documentUrl.publicUrl);

    try {
      // Fetch the document content
      console.log('Fetching document content...');
      const fileResponse = await fetch(documentUrl.publicUrl);
      
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch document: ${fileResponse.statusText} (${fileResponse.status})`);
      }
      
      // Convert to base64
      console.log('Converting document to base64...');
      const fileArrayBuffer = await fileResponse.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileArrayBuffer)));
      
      // Process document with Google Document AI
      console.log('Sending to Google Document AI for processing...');
      const result = await processDocumentWithGoogleDocAI(
        fileBase64,
        documentData.name,
        googleApiKey,
        processorId
      );
      
      console.log('Document AI processing result:', JSON.stringify(result));
      
      if (!result.success) {
        throw new Error('Document processing failed: ' + (result.error || 'unknown error'));
      }
      
      // Update the extraction record with the results
      await updateExtractionStatus(
        supabase,
        documentId,
        'completed',
        result.extractedData,
        result.confidenceScores
      );

      console.log('Extraction completed successfully');
      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedData: result.extractedData,
          confidenceScores: result.confidenceScores,
          fallback: false
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Document processing error:', error);
      
      // Fall back to simulation if real processing fails
      console.log('Falling back to simulated extraction due to error:', error.message);
      const mockExtractedData = simulateExtractionForDemo(documentData.name);
      
      // Update the extraction record with the simulated results
      await updateExtractionStatus(
        supabase,
        documentId,
        'completed',
        mockExtractedData.data,
        mockExtractedData.confidenceScores
      );

      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedData: mockExtractedData.data,
          confidenceScores: mockExtractedData.confidenceScores,
          fallback: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing utility bill:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
