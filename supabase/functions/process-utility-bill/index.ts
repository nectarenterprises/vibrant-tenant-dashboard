
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RequestPayload {
  documentId: string;
  propertyId: string;
  userId: string;
}

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

    console.log(`Processing utility bill: ${documentId} for property: ${propertyId}`);

    // Update extraction status to processing
    const { error: updateError } = await supabase
      .from('utility_data_extractions')
      .insert({
        document_id: documentId,
        extraction_status: 'processing',
        extraction_date: new Date().toISOString()
      });

    if (updateError) {
      console.error('Error updating extraction status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update extraction status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get document details
    const { data: documentData, error: documentError } = await supabase
      .from('property_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (documentError || !documentData) {
      console.error('Error fetching document:', documentError);
      return new Response(
        JSON.stringify({ error: 'Document not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // In a real implementation, this is where you would call your OCR/AI service
    // For demo purposes, we'll simulate the extraction with mock data
    const mockExtractedData = simulateExtractionForDemo(documentData.name);

    // Update the extraction record with the results
    const { error: extractionError } = await supabase
      .from('utility_data_extractions')
      .update({
        extraction_status: 'completed',
        extracted_data: mockExtractedData.data,
        confidence_scores: mockExtractedData.confidenceScores,
      })
      .eq('document_id', documentId);

    if (extractionError) {
      console.error('Error updating extraction data:', extractionError);
      return new Response(
        JSON.stringify({ error: 'Failed to update extraction data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: mockExtractedData.data,
        confidenceScores: mockExtractedData.confidenceScores
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing utility bill:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Mock function to simulate extraction - in production, replace with actual OCR/AI service
function simulateExtractionForDemo(documentName: string) {
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
