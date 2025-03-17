
import React from 'react';
import UploadingState from '../UploadingState';

interface UploadingStateHandlerProps {
  uploadProgress: number;
}

const UploadingStateHandler: React.FC<UploadingStateHandlerProps> = ({
  uploadProgress
}) => {
  return <UploadingState uploadProgress={uploadProgress} />;
};

export default UploadingStateHandler;
