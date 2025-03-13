
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { uploadPropertyImage, getPropertyImageUrl } from './PropertyImageService';

// Define a new interface for property input that doesn't extend Property
// This avoids the type conflict with the image field
interface PropertyInput {
  name: string;
  address: string;
  rentalFee: number;
  nextPaymentDate: string;
  leaseExpiry: string;
  image?: File | null;
  serviceChargeAmount?: number;
  utilityData?: any;
  complianceStatus?: any;
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

    // Set default values for new fields
    const serviceChargeAmount = property.serviceChargeAmount || 0;
    const utilityData = property.utilityData || createDefaultUtilityData();
    const complianceStatus = property.complianceStatus || createDefaultComplianceStatus();

    const { data, error } = await supabase
      .from('properties')
      .insert({
        name: property.name,
        address: property.address,
        rental_fee: property.rentalFee,
        next_payment_date: property.nextPaymentDate,
        lease_expiry: property.leaseExpiry,
        user_id: user.id,
        image_path: imagePath,
        service_charge_amount: serviceChargeAmount,
        utility_data: utilityData,
        compliance_status: complianceStatus
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
      image: data.image_path ? getPropertyImageUrl(data.image_path) : undefined,
      serviceChargeAmount: data.service_charge_amount,
      utilityData: data.utility_data,
      complianceStatus: data.compliance_status
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

/**
 * Creates default utility data for a new property
 */
const createDefaultUtilityData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    gasUsage: Math.floor(Math.random() * 300) + 100,
    gasCost: Math.floor(Math.random() * 150) + 50,
    waterUsage: Math.floor(Math.random() * 50) + 30,
    waterCost: Math.floor(Math.random() * 40) + 30,
    electricityUsage: Math.floor(Math.random() * 350) + 250,
    electricityCost: Math.floor(Math.random() * 100) + 60
  }));
};

/**
 * Creates default compliance status for a new property
 */
const createDefaultComplianceStatus = () => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);
  
  return {
    fireRiskAssessment: {
      lastCompleted: today.toISOString().split('T')[0],
      nextDue: nextYear.toISOString().split('T')[0],
      status: 'completed'
    },
    electricalSafety: {
      lastCompleted: today.toISOString().split('T')[0],
      nextDue: nextYear.toISOString().split('T')[0],
      status: 'completed'
    },
    gasInspection: {
      lastCompleted: today.toISOString().split('T')[0],
      nextDue: nextYear.toISOString().split('T')[0],
      status: 'completed'
    },
    buildingInsurance: {
      lastCompleted: today.toISOString().split('T')[0],
      nextDue: nextYear.toISOString().split('T')[0],
      status: 'completed'
    },
    asbestosReport: {
      lastCompleted: '',
      nextDue: nextMonth.toISOString().split('T')[0],
      status: 'upcoming'
    },
    energyPerformance: {
      lastCompleted: '',
      nextDue: nextMonth.toISOString().split('T')[0],
      status: 'upcoming'
    }
  };
};
