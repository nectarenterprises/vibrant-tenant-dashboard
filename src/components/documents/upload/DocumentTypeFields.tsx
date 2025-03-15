
import React from 'react';
import { FolderType } from '@/services/document/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentTypeFieldsProps {
  documentType: FolderType;
  formValues: Record<string, any>;
  setFormValues: (values: Record<string, any>) => void;
}

const DocumentTypeFields: React.FC<DocumentTypeFieldsProps> = ({
  documentType,
  formValues,
  setFormValues
}) => {
  const handleInputChange = (field: string, value: any) => {
    setFormValues({
      ...formValues,
      [field]: value
    });
  };

  // Handle utility type change and update unit type accordingly
  const handleUtilityTypeChange = (value: string) => {
    let unitType = '';
    switch (value) {
      case 'electricity':
        unitType = 'kWh';
        break;
      case 'gas':
        unitType = 'm³';
        break;
      case 'water':
        unitType = 'liters';
        break;
      default:
        unitType = '';
    }

    setFormValues({
      ...formValues,
      utilityType: value,
      unitType
    });
  };

  // Render fields based on document type
  if (documentType === 'lease') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leaseStart">Lease Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues.leaseStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues.leaseStart ? format(new Date(formValues.leaseStart), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.leaseStart ? new Date(formValues.leaseStart) : undefined}
                  onSelect={(date) => handleInputChange('leaseStart', date ? date.toISOString() : '')}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leaseExpiry">Lease Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues.leaseExpiry && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues.leaseExpiry ? format(new Date(formValues.leaseExpiry), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.leaseExpiry ? new Date(formValues.leaseExpiry) : undefined}
                  onSelect={(date) => handleInputChange('leaseExpiry', date ? date.toISOString() : '')}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rentalFee">Rental Fee</Label>
          <Input
            id="rentalFee"
            type="number"
            placeholder="Enter rental fee"
            value={formValues.rentalFee || ''}
            onChange={(e) => handleInputChange('rentalFee', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="leaseType">Lease Type</Label>
          <Input
            id="leaseType"
            placeholder="E.g., Commercial, Residential"
            value={formValues.leaseType || ''}
            onChange={(e) => handleInputChange('leaseType', e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (documentType === 'utility') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="utilityType">Utility Type</Label>
          <Select
            value={formValues.utilityType || ''}
            onValueChange={handleUtilityTypeChange}
          >
            <SelectTrigger id="utilityType">
              <SelectValue placeholder="Select utility type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Price</Label>
            <Input
              id="totalAmount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formValues.totalAmount || ''}
              onChange={(e) => handleInputChange('totalAmount', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usageQuantity">Units Consumed</Label>
            <div className="flex">
              <Input
                id="usageQuantity"
                type="number"
                step="0.01"
                placeholder="Enter usage"
                value={formValues.usageQuantity || ''}
                onChange={(e) => handleInputChange('usageQuantity', e.target.value)}
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                {formValues.unitType || ''}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="periodStart">Period From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues.periodStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues.periodStart ? format(new Date(formValues.periodStart), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.periodStart ? new Date(formValues.periodStart) : undefined}
                  onSelect={(date) => handleInputChange('periodStart', date ? date.toISOString() : '')}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodEnd">Period To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues.periodEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues.periodEnd ? format(new Date(formValues.periodEnd), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.periodEnd ? new Date(formValues.periodEnd) : undefined}
                  onSelect={(date) => handleInputChange('periodEnd', date ? date.toISOString() : '')}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billDate">Date of Invoice</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formValues.billDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formValues.billDate ? format(new Date(formValues.billDate), "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formValues.billDate ? new Date(formValues.billDate) : undefined}
                  onSelect={(date) => handleInputChange('billDate', date ? date.toISOString() : '')}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meterReference">Supply Number</Label>
            <Input
              id="meterReference"
              placeholder="MPAN / Gas Supply Number"
              value={formValues.meterReference || ''}
              onChange={(e) => handleInputChange('meterReference', e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Return empty div for other document types
  return null;
};

export default DocumentTypeFields;
