
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { addProperty } from '@/services/property';
import { useQueryClient } from '@tanstack/react-query';
import DatePickerField from '../form-fields/DatePickerField';
import ImageUploadField from '../form-fields/ImageUploadField';

interface PropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ onSuccess, onCancel }: PropertyFormProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [rentalFee, setRentalFee] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | undefined>(undefined);
  const [leaseExpiry, setLeaseExpiry] = useState<Date | undefined>(undefined);
  const [propertyImage, setPropertyImage] = useState<File | null>(null);

  const resetForm = () => {
    setName('');
    setAddress('');
    setRentalFee('');
    setServiceCharge('');
    setNextPaymentDate(undefined);
    setLeaseExpiry(undefined);
    setPropertyImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !address || !rentalFee || !nextPaymentDate || !leaseExpiry) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in all the required fields.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const property = await addProperty({
        name,
        address,
        rentalFee: parseFloat(rentalFee),
        serviceChargeAmount: serviceCharge ? parseFloat(serviceCharge) : 0,
        nextPaymentDate: format(nextPaymentDate, 'yyyy-MM-dd'),
        leaseExpiry: format(leaseExpiry, 'yyyy-MM-dd'),
        image: propertyImage,
        incentives: [] // Add required empty incentives array
      });
      
      if (property) {
        toast({
          title: "Property added",
          description: `${name} has been added successfully.`,
        });
        
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['property-events'] });
        
        resetForm();
        onSuccess();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding property",
        description: error.message || "An error occurred while adding the property.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-3">
        <Label htmlFor="name">Property Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Downtown Office"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full property address"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="rentalFee">Monthly Rental Fee (£)</Label>
          <Input
            id="rentalFee"
            type="number"
            value={rentalFee}
            onChange={(e) => setRentalFee(e.target.value)}
            placeholder="e.g. 1500"
            required
            min={0}
            step={0.01}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="serviceCharge">Service Charge (£)</Label>
          <Input
            id="serviceCharge"
            type="number"
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            placeholder="e.g. 250"
            min={0}
            step={0.01}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <DatePickerField 
          label="Next Payment Date"
          selected={nextPaymentDate}
          onSelect={setNextPaymentDate}
        />
        
        <DatePickerField 
          label="Lease Expiry Date"
          selected={leaseExpiry}
          onSelect={setLeaseExpiry}
        />
      </div>
      
      <ImageUploadField 
        propertyImage={propertyImage}
        setPropertyImage={setPropertyImage}
      />
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            resetForm();
            onCancel();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
