
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Incentive } from '@/types/property';

interface IncentiveFormProps {
  incentive?: Incentive;
  index?: number;
  onChange?: (index: number, field: keyof Incentive, value: any) => void;
  onRemove?: (index: number) => void;
  initialIncentive?: Incentive;
  onSave?: (incentive: Incentive) => void;
  onCancel?: () => void;
}

const IncentiveForm: React.FC<IncentiveFormProps> = ({
  incentive,
  index,
  onChange,
  onRemove,
  initialIncentive,
  onSave,
  onCancel
}) => {
  // If we're using the standalone version with onSave/onCancel
  const [localIncentive, setLocalIncentive] = useState<Incentive>(
    initialIncentive || 
    incentive || 
    { type: 'rent-free', description: '', value: undefined, period: '' }
  );

  const handleFieldChange = (field: keyof Incentive, value: any) => {
    if (onChange && index !== undefined) {
      // For multi-incentive editor
      onChange(index, field, value);
    } else {
      // For standalone form
      setLocalIncentive(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localIncentive);
    }
  };

  // Determine if we're in standalone mode or integrated mode
  const isStandalone = !!onSave;

  if (isStandalone) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="incentive-type">Incentive Type</Label>
          <Select
            value={localIncentive.type}
            onValueChange={(value) => handleFieldChange('type', value)}
          >
            <SelectTrigger id="incentive-type">
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
        
        <div className="grid grid-cols-1 gap-3">
          <Label htmlFor="incentive-desc">Description</Label>
          <Textarea
            id="incentive-desc"
            placeholder="Describe the incentive..."
            value={localIncentive.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="incentive-value">Value (£)</Label>
            <Input
              id="incentive-value"
              type="number"
              placeholder="e.g. 5000"
              value={localIncentive.value || ''}
              onChange={(e) => handleFieldChange('value', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="incentive-period">Period</Label>
            <Input
              id="incentive-period"
              placeholder="e.g. 3 months"
              value={localIncentive.period || ''}
              onChange={(e) => handleFieldChange('period', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>
            Save Incentive
          </Button>
        </div>
      </div>
    );
  }

  // If we're in the multi-incentive editor mode
  return (
    <div className="p-4 border rounded-md space-y-3 relative">
      {onRemove && index !== undefined && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </Button>
      )}
      
      {incentive && (
        <>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor={`incentive-type-${index}`}>Incentive Type</Label>
            <Select
              value={incentive.type}
              onValueChange={(value) => onChange && index !== undefined && onChange(index, 'type', value)}
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
              onChange={(e) => onChange && index !== undefined && onChange(index, 'description', e.target.value)}
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
                onChange={(e) => onChange && index !== undefined && onChange(index, 'value', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor={`incentive-period-${index}`}>Period</Label>
              <Input
                id={`incentive-period-${index}`}
                placeholder="e.g. 3 months"
                value={incentive.period || ''}
                onChange={(e) => onChange && index !== undefined && onChange(index, 'period', e.target.value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IncentiveForm;
