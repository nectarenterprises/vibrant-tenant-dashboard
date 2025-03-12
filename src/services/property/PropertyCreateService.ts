
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyImage, getPropertyImageUrl } from './PropertyImageService';

// Define a more specific type for the property parameter
interface PropertyInput extends Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {
  image?: File | null;
}

/**
 * Adds a new property for the current authenticated user
 */
export const addProperty = async (property: PropertyInput): Promise<Property | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to add properties",
      });
      return null;
    }

    // Upload image if provided
    let imagePath = null;
    if (property.image instanceof File) {
      imagePath = await uploadPropertyImage(property.image);
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({
        name: property.name,
        address: property.address,
        rental_fee: property.rentalFee,
        next_payment_date: property.nextPaymentDate,
        lease_expiry: property.leaseExpiry,
        user_id: user.id,
        image_path: imagePath
      })
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
    
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      rentalFee: Number(data.rental_fee),
      nextPaymentDate: data.next_payment_date,
      leaseExpiry: data.lease_expiry,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      image: data.image_path ? getPropertyImageUrl(data.image_path) : undefined
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
