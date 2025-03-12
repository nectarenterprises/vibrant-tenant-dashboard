
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Incentive } from '@/types/property';

interface IncentiveFormProps {
  incentive: Incentive;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Incentive, value: any) => void;
}

const IncentiveForm: React.FC<IncentiveFormProps> = ({
  incentive,
  index,
  onRemove,
  onChange,
}) => {
  return (
    <div className="p-4 border rounded-md space-y-3 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(index)}
      >
        <Trash className="h-4 w-4" />
      </Button>
      
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor={`incentive-type-${index}`}>Incentive Type</Label>
        <Select
          value={incentive.type}
          onValueChange={(value) => onChange(index, 'type', value)}
        >
          <SelectTrigger id={`incentive-type-${index}`}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rent-free">Rent Free Period</SelectItem>
            <SelectItem value="fitout">Fitout Contribution</SelectItem>
            <SelectItem value="break-option">Break Option</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor={`incentive-desc-${index}`}>Description</Label>
        <Textarea
          id={`incentive-desc-${index}`}
          placeholder="Describe the incentive..."
          value={incentive.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          className="resize-none"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor={`incentive-value-${index}`}>Value (£)</Label>
          <Input
            id={`incentive-value-${index}`}
            type="number"
            placeholder="e.g. 5000"
            value={incentive.value || ''}
            onChange={(e) => onChange(index, 'value', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor={`incentive-period-${index}`}>Period</Label>
          <Input
            id={`incentive-period-${index}`}
            placeholder="e.g. 3 months"
            value={incentive.period || ''}
            onChange={(e) => onChange(index, 'period', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default IncentiveForm;
