
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LeaseKeyDatesFieldsProps {
  commencementDate: Date | undefined;
  setCommencementDate: (date: Date | undefined) => void;
  leaseExpiryDate: Date | undefined;
  setLeaseExpiryDate: (date: Date | undefined) => void;
}

const LeaseKeyDatesFields: React.FC<LeaseKeyDatesFieldsProps> = ({
  commencementDate,
  setCommencementDate,
  leaseExpiryDate,
  setLeaseExpiryDate
}) => {
  return (
    <div className="grid gap-2 mt-2">
      <Label className="text-base font-medium">Lease Key Dates (Optional)</Label>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="commencementDate">Commencement Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="commencementDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !commencementDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {commencementDate ? format(commencementDate, "PPP") : <span>Set date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={commencementDate}
                onSelect={setCommencementDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="leaseExpiryDate">Lease Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="leaseExpiryDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !leaseExpiryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {leaseExpiryDate ? format(leaseExpiryDate, "PPP") : <span>Set date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={leaseExpiryDate}
                onSelect={setLeaseExpiryDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default LeaseKeyDatesFields;
