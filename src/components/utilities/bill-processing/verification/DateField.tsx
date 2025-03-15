
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ConfidenceIndicator from './ConfidenceIndicator';

interface DateFieldProps {
  label: string;
  fieldName: string;
  value: string | undefined;
  confidenceScore: number | undefined;
  onChange: (value: string | undefined) => void;
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  fieldName,
  value,
  confidenceScore,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={fieldName}>{label}</Label>
        <ConfidenceIndicator score={confidenceScore} field={fieldName} />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : undefined)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateField;
