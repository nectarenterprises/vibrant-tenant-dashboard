
import React from 'react';
import FailedState from '../FailedState';

interface FailedStateHandlerProps {
  onClose: () => void;
  onReset: () => void;
  errorMessage: string | null;
}

const FailedStateHandler: React.FC<FailedStateHandlerProps> = ({
  onClose,
  onReset,
  errorMessage
}) => {
  return (
    <FailedState 
      onClose={onClose} 
      onReset={onReset} 
      errorMessage={errorMessage} 
    />
  );
};

export default FailedStateHandler;
