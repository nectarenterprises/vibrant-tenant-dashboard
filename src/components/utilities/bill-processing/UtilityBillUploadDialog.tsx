
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
import DialogStateContainer from './dialog-states/DialogStateContainer';

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
    processingError,
    isFallbackData,
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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Utility Bill</DialogTitle>
        </DialogHeader>
        
        <DialogStateContainer
          processingStatus={processingStatus}
          fileUpload={fileUpload}
          handleFileChange={handleFileChange}
          formRegister={register}
          utilityType={utilityType}
          billDate={billDate}
          setValue={setValue}
          onSubmit={onSubmit}
          handleClose={handleClose}
          uploadProgress={uploadProgress}
          extractionResult={extractionResult}
          processingError={processingError}
          isFallbackData={isFallbackData}
          handleSaveVerifiedData={handleSaveVerifiedData}
          resetProcessing={resetProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UtilityBillUploadDialog;
