
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DocumentExpiryFieldsProps {
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
  notificationPeriod: number;
  setNotificationPeriod: (days: number) => void;
}

const DocumentExpiryFields: React.FC<DocumentExpiryFieldsProps> = ({
  expiryDate,
  setExpiryDate,
  notificationPeriod,
  setNotificationPeriod
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="expiryDate">Document Expiry Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="expiryDate"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !expiryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiryDate ? format(expiryDate, "PPP") : <span>Set expiry date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expiryDate}
              onSelect={setExpiryDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="notificationPeriod">Notification Period (days)</Label>
        <Input
          id="notificationPeriod"
          type="number"
          min={1}
          value={notificationPeriod}
          onChange={(e) => setNotificationPeriod(parseInt(e.target.value) || 90)}
        />
      </div>
    </div>
  );
};

export default DocumentExpiryFields;
