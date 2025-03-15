
import React from 'react';
import { Input } from '@/components/ui/input';

interface DocumentNameFieldProps {
  documentName: string;
  onNameChange: (name: string) => void;
}

const DocumentNameField: React.FC<DocumentNameFieldProps> = ({
  documentName,
  onNameChange
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="document-name" className="text-sm font-medium">
        Document Name
      </label>
      <Input 
        id="document-name" 
        value={documentName} 
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter document name"
      />
    </div>
  );
};

export default DocumentNameField;
