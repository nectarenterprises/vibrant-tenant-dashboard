
import React from 'react';
import { ProcessingStatus } from '@/hooks/utility/useUtilityBillProcessing';
import { ExtractedUtilityData, ProcessingResult } from '@/types/utility';
import {
  IdleStateHandler,
  UploadingStateHandler,
  ProcessingStateHandler,
  VerifyingStateHandler,
  CompletedStateHandler,
  FailedStateHandler
} from './handlers';

interface DialogStateContainerProps {
  processingStatus: ProcessingStatus;
  fileUpload: File | null;
  handleFileChange: (file: File | null) => void;
  formRegister: any;
  utilityType: string;
  billDate: string;
  setValue: (name: string, value: any) => void;
  onSubmit: () => void;
  handleClose: () => void;
  uploadProgress: number;
  extractionResult: ProcessingResult | null;
  processingError: string | null;
  isFallbackData: boolean;
  handleSaveVerifiedData: (verifiedData: ExtractedUtilityData) => Promise<void>;
  resetProcessing: () => void;
}

const DialogStateContainer: React.FC<DialogStateContainerProps> = ({
  processingStatus,
  fileUpload,
  handleFileChange,
  formRegister,
  utilityType,
  billDate,
  setValue,
  onSubmit,
  handleClose,
  uploadProgress,
  extractionResult,
  processingError,
  isFallbackData,
  handleSaveVerifiedData,
  resetProcessing
}) => {
  // Render the appropriate component based on the processing status
  switch (processingStatus) {
    case 'idle':
      return (
        <IdleStateHandler
          fileUpload={fileUpload}
          handleFileChange={handleFileChange}
          formRegister={formRegister}
          utilityType={utilityType}
          billDate={billDate}
          setValue={setValue}
          onSubmit={onSubmit}
          onClose={handleClose}
        />
      );
      
    case 'uploading':
      return <UploadingStateHandler uploadProgress={uploadProgress} />;
      
    case 'processing':
      return <ProcessingStateHandler />;
      
    case 'verifying':
      return (
        <VerifyingStateHandler
          extractionResult={extractionResult}
          handleSaveVerifiedData={handleSaveVerifiedData}
          handleClose={handleClose}
          isFallbackData={isFallbackData}
        />
      );
      
    case 'completed':
      return <CompletedStateHandler onClose={handleClose} />;
      
    case 'failed':
      return (
        <FailedStateHandler
          onClose={handleClose}
          onReset={resetProcessing}
          errorMessage={processingError}
        />
      );
      
    default:
      return null;
  }
};

export default DialogStateContainer;
