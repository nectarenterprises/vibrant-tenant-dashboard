
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyImage, getPropertyImageUrl } from './PropertyImageService';
import { FolderType } from '@/services/document/types';

interface PropertyInput {
  name: string;
  address: string;
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
  image?: File | null;
  serviceChargeAmount?: number;
  utilityData?: any;
  incentives: Array<any>;
}

const initializeDocumentFolders = async (propertyId: string) => {
  const folders: FolderType[] = ['lease', 'utility', 'compliance', 'service-charge', 'other'];
  
  for (const folder of folders) {
    const folderPath = `${propertyId}/${folder}`;
    const { error } = await supabase.storage
      .from('documents')
      .upload(`${folderPath}/.keep`, new Uint8Array(0));
    
    if (error && error.message !== 'The resource already exists') {
      console.error(`Error creating folder ${folder}:`, error);
    }
  }
};

/**
 * Adds a new property for the current authenticated user
 */
export const addProperty = async (property: PropertyInput): Promise<Property | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to add properties",
      });
      return null;
    }

    let imagePath = null;
    if (property.image instanceof File) {
      imagePath = await uploadPropertyImage(property.image);
    }

    // Only use provided values, don't generate mock data
    const serviceChargeAmount = property.serviceChargeAmount || 0;
    const utilityData = property.utilityData || [];

    const insertData = {
      name: property.name,
      address: property.address,
      rental_fee: property.rentalFee,
      next_payment_date: property.nextPaymentDate,
      lease_expiry: property.leaseExpiry,
      user_id: user.id,
      image_path: imagePath,
    };

    const metadata = {
      service_charge_amount: serviceChargeAmount,
      utility_data: utilityData
    };

    const dataToInsert = {
      ...insertData,
      incentives: JSON.stringify(metadata)
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(dataToInsert)
      .select()
      .single();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to add property",
        description: error.message,
      });
      return null;
    }
    
    await initializeDocumentFolders(data.id);
    
    let metadataObj: Record<string, any> = {};
    try {
      metadataObj = data.incentives ? (typeof data.incentives === 'string' ? JSON.parse(data.incentives) : data.incentives) : {};
    } catch (e) {
      console.error("Failed to parse incentives JSON:", e);
      metadataObj = {};
    }
    
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      rentalFee: Number(data.rental_fee),
      nextPaymentDate: data.next_payment_date,
      leaseExpiry: data.lease_expiry,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      image: data.image_path ? getPropertyImageUrl(data.image_path) : undefined,
      incentives: property.incentives || [],
      serviceChargeAmount: metadataObj.service_charge_amount || 0,
      utilityData: metadataObj.utility_data || []
    };
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Failed to add property",
      description: error.message || "An error occurred while adding the property",
    });
    return null;
  }
};
