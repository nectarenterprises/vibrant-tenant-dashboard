
import React from 'react';
import CompletedState from '../CompletedState';

interface CompletedStateHandlerProps {
  onClose: () => void;
}

const CompletedStateHandler: React.FC<CompletedStateHandlerProps> = ({
  onClose
}) => {
  return <CompletedState onClose={onClose} />;
};

export default CompletedStateHandler;
