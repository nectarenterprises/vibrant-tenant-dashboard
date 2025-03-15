
import React from 'react';
import { ProcessingStatus } from '@/hooks/utility/useUtilityBillProcessing';
import { ExtractedUtilityData, ProcessingResult } from '@/types/utility';

// Import state components
import UploadState from './UploadState';
import UploadingState from './UploadingState';
import ProcessingState from './ProcessingState';
import CompletedState from './CompletedState';
import FailedState from './FailedState';
import UtilityBillVerificationForm from '../UtilityBillVerificationForm';

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
  // Render different content based on processing status
  switch (processingStatus) {
    case 'idle':
      return (
        <UploadState
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
            isFallbackData={isFallbackData}
          />
        )
      );
      
    case 'completed':
      return <CompletedState onClose={handleClose} />;
      
    case 'failed':
      return <FailedState onClose={handleClose} onReset={resetProcessing} errorMessage={processingError} />;
      
    default:
      return null;
  }
};

export default DialogStateContainer;
