
import { supabase } from '@/integrations/supabase/client';
import { addProperty } from './property/PropertyCreateService';
import { Property } from '@/types/property';
import { toast } from '@/components/ui/use-toast';

/**
 * Seeds the database with initial data for testing
 * Now requires explicit user action rather than running automatically
 */
export const seedInitialData = async (forceSeed: boolean = false): Promise<void> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to seed data",
      });
      return;
    }

    // Check if user already has ANY properties, not just ones from seed
    const { data: existingProperties, error: checkError } = await supabase
      .from('properties')
      .select('id')
      .eq('user_id', user.id);
    
    if (checkError) {
      console.error('Error checking for existing properties:', checkError);
      return;
    }
    
    // If user already has ANY properties, don't seed
    if (!forceSeed && existingProperties && existingProperties.length > 0) {
      console.log('User already has properties, skipping seed');
      return;
    }
    
    // Sample properties to seed - using the same type definition as in addProperty
    const sampleProperties: Array<Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { image?: File | null }> = [
      {
        name: 'Victoria Office',
        address: '123 Buckingham Palace Road, Victoria, London SW1W 9SH',
        rentalFee: 3500,
        nextPaymentDate: '2023-04-15',
        leaseExpiry: '2024-03-31',
        incentives: [] // Add required incentives array
      },
      {
        name: 'Covent Garden Retail',
        address: '45 Long Acre, Covent Garden, London WC2E 9JT',
        rentalFee: 4200,
        nextPaymentDate: '2023-04-10',
        leaseExpiry: '2023-12-31',
        incentives: [] // Add required incentives array
      }
    ];
    
    // Add each property
    for (const property of sampleProperties) {
      await addProperty(property);
    }
    
    toast({
      title: "Demo data added",
      description: "Sample properties have been added to your account.",
    });
    
  } catch (error: any) {
    console.error('Error seeding initial data:', error);
  }
};
