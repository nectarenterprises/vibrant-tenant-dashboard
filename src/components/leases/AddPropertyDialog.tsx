
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Upload } from 'lucide-react';
import { addProperty } from '@/services/PropertyService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPropertyDialog = ({ open, onOpenChange }: AddPropertyDialogProps) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [rentalFee, setRentalFee] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | undefined>(undefined);
  const [leaseExpiry, setLeaseExpiry] = useState<Date | undefined>(undefined);
  const [propertyImage, setPropertyImage] = useState<File | null>(null);

  const resetForm = () => {
    setName('');
    setAddress('');
    setRentalFee('');
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
        nextPaymentDate: format(nextPaymentDate, 'yyyy-MM-dd'),
        leaseExpiry: format(leaseExpiry, 'yyyy-MM-dd'),
        image: propertyImage
      });
      
      if (property) {
        toast({
          title: "Property added",
          description: `${name} has been added successfully.`,
        });
        
        // Refresh the properties list
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        
        // Reset form and close dialog
        resetForm();
        onOpenChange(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "The maximum file size is 10MB.",
        });
        return;
      }
      setPropertyImage(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Enter the details for your new property. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
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
          
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-3">
              <Label>Next Payment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !nextPaymentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextPaymentDate ? format(nextPaymentDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={nextPaymentDate}
                    onSelect={setNextPaymentDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Label>Lease Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !leaseExpiry && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {leaseExpiry ? format(leaseExpiry, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={leaseExpiry}
                    onSelect={setLeaseExpiry}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Label htmlFor="propertyImage">Property Image (Optional)</Label>
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('propertyImage')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              <span className="text-sm text-muted-foreground">
                {propertyImage ? propertyImage.name : "No file chosen"}
              </span>
              <input
                id="propertyImage"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Accepted formats: JPEG, PNG. Max size: 10MB.
            </p>
          </div>
          
          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
