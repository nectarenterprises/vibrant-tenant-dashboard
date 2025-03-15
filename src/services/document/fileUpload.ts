
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { uploadFile } from './storage';
import { saveDocumentMetadata } from './metadata';
import { FolderType } from './types';
import { PropertyDocument, DocumentType, DocumentTag } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_BUCKET = 'documents';

/**
 * Uploads a document and saves its metadata
 */
export const uploadPropertyDocument = async (
  propertyId: string,
  file: File,
  documentType: DocumentType,
  documentName: string,
  documentDescription?: string,
  tags?: DocumentTag[],
  expiryDate?: string,
  keyDates?: PropertyDocument['keyDates'],
  notificationPeriod?: number,
  additionalMetadata?: Record<string, any>
): Promise<boolean> => {
  try {
    console.log('Starting document upload process');
    // Generate a unique file path
    const fileExtension = file.name.split('.').pop() || '';
    const filePath = `${propertyId}/${documentType}/${uuidv4()}.${fileExtension}`;
    
    console.log(`Generated file path: ${filePath}`);
    
    // Upload the file to storage
    const uploadSuccess = await uploadFile(STORAGE_BUCKET, filePath, file);
    
    if (!uploadSuccess) {
      console.error('File upload failed');
      return false;
    }
    
    console.log('File uploaded successfully, saving metadata');
    
    // Save document metadata
    const docType = documentType as FolderType; // Type assertion since DocumentType and FolderType are the same
    const documentId = await saveDocumentMetadata(
      propertyId,
      documentName,
      filePath,
      docType,
      documentDescription,
      tags,
      expiryDate,
      keyDates,
      notificationPeriod
    );
    
    // If additional metadata is provided and the document was saved successfully
    if (additionalMetadata && documentId) {
      console.log('Saving additional metadata', additionalMetadata);
      
      // Handle utility bill metadata
      if (documentType === 'utility' && additionalMetadata.utilityType) {
        await saveUtilityBillMetadata(documentId, propertyId, additionalMetadata);
      }
      
      // Handle lease document metadata
      if (documentType === 'lease' && (additionalMetadata.leaseStart || additionalMetadata.leaseExpiry)) {
        await saveLeaseMetadata(propertyId, additionalMetadata);
      }
    }
    
    console.log('Document upload complete:', !!documentId);
    return !!documentId;
  } catch (error) {
    console.error('Error uploading document:', error);
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: "There was an error uploading your document.",
    });
    return false;
  }
};

// Save utility bill metadata to the utility_bills table
const saveUtilityBillMetadata = async (
  documentId: string,
  propertyId: string,
  metadata: Record<string, any>
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error('User ID not available');
      return false;
    }
    
    // Format dates if they are provided as ISO strings
    const billDate = metadata.billDate ? new Date(metadata.billDate).toISOString().split('T')[0] : null;
    const periodStart = metadata.periodStart ? new Date(metadata.periodStart).toISOString().split('T')[0] : null;
    const periodEnd = metadata.periodEnd ? new Date(metadata.periodEnd).toISOString().split('T')[0] : null;
    
    // Insert utility bill record
    const { data, error } = await supabase
      .from('utility_bills')
      .insert({
        property_id: propertyId,
        user_id: userId,
        utility_type: metadata.utilityType,
        bill_date: billDate,
        period_start: periodStart,
        period_end: periodEnd,
        total_amount: parseFloat(metadata.totalAmount) || 0,
        usage_quantity: parseFloat(metadata.usageQuantity) || 0,
        usage_unit: metadata.unitType,
        meter_reference: metadata.meterReference,
        notes: metadata.notes
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error saving utility bill metadata:', error);
      return false;
    }
    
    // Link the utility bill to the document
    if (data?.id) {
      const { error: linkError } = await supabase
        .from('utility_bill_documents')
        .insert({
          utility_bill_id: data.id,
          document_id: documentId,
          is_original: true
        });
        
      if (linkError) {
        console.error('Error linking utility bill to document:', linkError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveUtilityBillMetadata:', error);
    return false;
  }
};

// Update property with lease information
const saveLeaseMetadata = async (
  propertyId: string,
  metadata: Record<string, any>
) => {
  try {
    // Format dates
    const leaseStart = metadata.leaseStart ? new Date(metadata.leaseStart).toISOString() : null;
    const leaseExpiry = metadata.leaseExpiry ? new Date(metadata.leaseExpiry).toISOString().split('T')[0] : null;
    
    // Update property with lease information
    const { error } = await supabase
      .from('properties')
      .update({
        lease_start: leaseStart,
        lease_expiry: leaseExpiry,
        rental_fee: parseFloat(metadata.rentalFee) || null,
        lease_type: metadata.leaseType || null
      })
      .eq('id', propertyId);
      
    if (error) {
      console.error('Error updating property lease information:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveLeaseMetadata:', error);
    return false;
  }
};
