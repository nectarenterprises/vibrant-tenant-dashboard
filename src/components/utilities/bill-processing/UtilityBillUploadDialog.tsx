
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Label } from '@/components/ui/label';
import { FileUpload } from './FileUpload';
import { UtilityBillUpload, UtilityType } from '@/types/utility';
import { useUtilityBillProcessing } from '@/hooks/utility/useUtilityBillProcessing';
import { Progress } from '@/components/ui/progress';
import UtilityBillVerificationForm from './UtilityBillVerificationForm';

interface UtilityBillUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

const UtilityBillUploadDialog: React.FC<UtilityBillUploadDialogProps> = ({
  isOpen,
  onClose,
  propertyId
}) => {
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const { register, handleSubmit, setValue, watch, reset } = useForm<UtilityBillUpload>({
    defaultValues: {
      propertyId,
      utilityType: 'electricity',
      billDate: format(new Date(), 'yyyy-MM-dd')
    }
  });
  
  const {
    uploadProgress,
    processingStatus,
    extractionResult,
    uploadMutation,
    saveMutation,
    resetProcessing
  } = useUtilityBillProcessing(propertyId);
  
  const utilityType = watch('utilityType');
  const billDate = watch('billDate');
  
  const handleFileChange = (file: File | null) => {
    setFileUpload(file);
    if (file) {
      // Auto-detect utility type from filename if possible
      const filename = file.name.toLowerCase();
      if (filename.includes('electric') || filename.includes('power')) {
        setValue('utilityType', 'electricity');
      } else if (filename.includes('gas') || filename.includes('natural gas')) {
        setValue('utilityType', 'gas');
      } else if (filename.includes('water')) {
        setValue('utilityType', 'water');
      }
    }
  };
  
  const onSubmit = handleSubmit(async (data) => {
    if (!fileUpload) return;
    
    const uploadData: UtilityBillUpload = {
      ...data,
      file: fileUpload,
      propertyId
    };
    
    try {
      await uploadMutation.mutateAsync(uploadData);
    } catch (error) {
      console.error('Error uploading utility bill:', error);
    }
  });
  
  const handleSaveVerifiedData = async (verifiedData: any) => {
    if (!extractionResult) return;
    
    try {
      await saveMutation.mutateAsync({
        data: verifiedData,
        documentId: extractionResult.documentId
      });
      handleClose();
    } catch (error) {
      console.error('Error saving verified data:', error);
    }
  };
  
  const handleClose = () => {
    if (processingStatus === 'idle' || processingStatus === 'completed' || processingStatus === 'failed') {
      resetProcessing();
      setFileUpload(null);
      reset();
      onClose();
    }
  };
  
  // Render different content based on processing status
  const renderDialogContent = () => {
    switch (processingStatus) {
      case 'idle':
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
                    {...register('notes')}
                  />
                </div>
              </div>
            </form>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
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
        
      case 'uploading':
        return (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Uploading Utility Bill</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we upload your document
              </p>
            </div>
            
            <Progress value={uploadProgress} className="w-full h-2" />
            
            <p className="text-center text-sm">
              {uploadProgress}% complete
            </p>
          </div>
        );
        
      case 'processing':
        return (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Processing Utility Bill</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI is extracting information from your bill
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tenant-green rounded-full"></div>
            </div>
            
            <p className="text-center text-sm">
              This may take a few moments...
            </p>
          </div>
        );
        
      case 'verifying':
        return (
          <>
            {extractionResult && (
              <UtilityBillVerificationForm 
                extractedData={extractionResult.extractedData}
                confidenceScores={extractionResult.confidenceScores}
                onSave={handleSaveVerifiedData}
                onCancel={handleClose}
              />
            )}
          </>
        );
        
      case 'completed':
        return (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-tenant-green">Processing Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your utility bill has been processed and saved successfully.
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        );
        
      case 'failed':
        return (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-destructive">Processing Failed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There was an error processing your utility bill.
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={() => resetProcessing()}>
                Try Again
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Utility Bill</DialogTitle>
        </DialogHeader>
        
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default UtilityBillUploadDialog;
