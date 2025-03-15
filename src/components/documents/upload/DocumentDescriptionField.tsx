
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DocumentDescriptionFieldProps {
  documentDescription: string;
  onDescriptionChange: (description: string) => void;
}

const DocumentDescriptionField: React.FC<DocumentDescriptionFieldProps> = ({
  documentDescription,
  onDescriptionChange
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="document-description" className="text-sm font-medium">
        Description (Optional)
      </label>
      <Textarea 
        id="document-description" 
        value={documentDescription} 
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Enter document description"
        rows={3}
      />
    </div>
  );
};

export default DocumentDescriptionField;
