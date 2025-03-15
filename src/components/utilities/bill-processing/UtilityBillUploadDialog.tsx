
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { UtilityBillUpload } from '@/types/utility';
import { useUtilityBillProcessing } from '@/hooks/utility/useUtilityBillProcessing';
import { format } from 'date-fns';

// Import state components
import UploadState from './dialog-states/UploadState';
import UploadingState from './dialog-states/UploadingState';
import ProcessingState from './dialog-states/ProcessingState';
import CompletedState from './dialog-states/CompletedState';
import FailedState from './dialog-states/FailedState';
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
          <UploadState
            fileUpload={fileUpload}
            handleFileChange={handleFileChange}
            formRegister={register}
            utilityType={utilityType}
            billDate={billDate}
            setValue={setValue}
            onSubmit={onSubmit}
            onClose={handleClose}
          />
        );
        
      case 'uploading':
        return <UploadingState uploadProgress={uploadProgress} />;
        
      case 'processing':
        return <ProcessingState />;
        
      case 'verifying':
        return (
          extractionResult && (
            <UtilityBillVerificationForm 
              extractedData={extractionResult.extractedData}
              confidenceScores={extractionResult.confidenceScores}
              onSave={handleSaveVerifiedData}
              onCancel={handleClose}
            />
          )
        );
        
      case 'completed':
        return <CompletedState onClose={handleClose} />;
        
      case 'failed':
        return <FailedState onClose={handleClose} onReset={resetProcessing} />;
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
