
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Calendar as CalendarIcon, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ExtractedUtilityData, ConfidenceScores, UtilityType } from '@/types/utility';

interface UtilityBillVerificationFormProps {
  extractedData: ExtractedUtilityData;
  confidenceScores: ConfidenceScores;
  onSave: (verifiedData: ExtractedUtilityData) => void;
  onCancel: () => void;
}

const UtilityBillVerificationForm: React.FC<UtilityBillVerificationFormProps> = ({
  extractedData,
  confidenceScores,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<ExtractedUtilityData>({...extractedData});
  
  const getConfidenceIndicator = (score: number | undefined) => {
    if (!score) return null;
    
    if (score >= 0.8) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (score >= 0.6) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };
  
  const handleChange = (field: keyof ExtractedUtilityData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="py-2 space-y-4">
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <h3 className="text-sm font-medium mb-1">Please verify the extracted information</h3>
        <p className="text-xs text-muted-foreground">
          Our AI has extracted the following information from your utility bill. 
          Please verify the accuracy and make corrections if needed.
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="utilityType">Utility Type</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.utilityType)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.utilityType || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={formData.utilityType}
              onValueChange={(value) => handleChange('utilityType', value as UtilityType)}
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
            <div className="flex items-center gap-1">
              <Label htmlFor="billDate">Bill Date</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.billDate)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.billDate || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.billDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.billDate ? format(new Date(formData.billDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.billDate ? new Date(formData.billDate) : undefined}
                  onSelect={(date) => handleChange('billDate', date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="periodStart">Period Start</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.periodStart)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.periodStart || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.periodStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.periodStart ? format(new Date(formData.periodStart), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.periodStart ? new Date(formData.periodStart) : undefined}
                  onSelect={(date) => handleChange('periodStart', date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="periodEnd">Period End</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.periodEnd)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.periodEnd || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.periodEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.periodEnd ? format(new Date(formData.periodEnd), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.periodEnd ? new Date(formData.periodEnd) : undefined}
                  onSelect={(date) => handleChange('periodEnd', date ? format(date, 'yyyy-MM-dd') : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.totalAmount)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.totalAmount || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
              <Input 
                id="totalAmount" 
                value={formData.totalAmount} 
                onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value) || 0)}
                className="pl-8"
                type="number"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="meterReference">Meter Reference</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.meterReference)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.meterReference || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="meterReference" 
              value={formData.meterReference || ''} 
              onChange={(e) => handleChange('meterReference', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="usageQuantity">Usage Quantity</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.usageQuantity)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.usageQuantity || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="usageQuantity" 
              value={formData.usageQuantity || ''} 
              onChange={(e) => handleChange('usageQuantity', parseFloat(e.target.value) || 0)}
              type="number"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="usageUnit">Usage Unit</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1">
                      {getConfidenceIndicator(confidenceScores.usageUnit)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Confidence: {Math.round((confidenceScores.usageUnit || 0) * 100)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input 
              id="usageUnit" 
              value={formData.usageUnit || ''} 
              onChange={(e) => handleChange('usageUnit', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(formData)}
          className="bg-tenant-green hover:bg-tenant-darkGreen"
        >
          Save & Process
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UtilityBillVerificationForm;
