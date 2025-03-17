
import React from 'react';
import UploadState from '../UploadState';

interface IdleStateHandlerProps {
  fileUpload: File | null;
  handleFileChange: (file: File | null) => void;
  formRegister: any;
  utilityType: string;
  billDate: string;
  setValue: (name: string, value: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const IdleStateHandler: React.FC<IdleStateHandlerProps> = ({
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
    <UploadState
      fileUpload={fileUpload}
      handleFileChange={handleFileChange}
      formRegister={formRegister}
      utilityType={utilityType}
      billDate={billDate}
      setValue={setValue}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default IdleStateHandler;
