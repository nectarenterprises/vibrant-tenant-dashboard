
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DialogFooter } from '@/components/ui/dialog';
import { FileUpload } from '../FileUpload';
import { UtilityBillUpload, UtilityType } from '@/types/utility';

interface UploadStateProps {
  fileUpload: File | null;
  handleFileChange: (file: File | null) => void;
  formRegister: ReturnType<typeof useForm>['register'];
  utilityType: string;
  billDate: string;
  setValue: (name: string, value: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const UploadState: React.FC<UploadStateProps> = ({
  fileUpload,
  handleFileChange,
  formRegister,
  utilityType,
  billDate,
  setValue,
  onSubmit,
  onClose
}) => {
  return (
    <>
      <form>
        <div className="grid gap-4 py-4">
          <FileUpload 
            file={fileUpload} 
            onFileChange={handleFileChange} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utilityType">Utility Type</Label>
              <Select
                value={utilityType as string}
                onValueChange={(value) => setValue('utilityType', value as UtilityType)}
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
            
            <div className="space-y-2">
              <Label htmlFor="billDate">Bill Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !billDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {billDate ? format(new Date(billDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={billDate ? new Date(billDate) : undefined}
                    onSelect={(date) => setValue('billDate', date ? format(date, 'yyyy-MM-dd') : '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this bill"
              {...formRegister('notes')}
            />
          </div>
        </div>
      </form>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={!fileUpload}
          className="bg-tenant-green hover:bg-tenant-darkGreen"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload & Process
        </Button>
      </DialogFooter>
    </>
  );
};

export default UploadState;
