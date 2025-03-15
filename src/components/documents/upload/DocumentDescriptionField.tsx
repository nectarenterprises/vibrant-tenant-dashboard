
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DocumentDescriptionFieldProps {
  documentDescription: string;
  setDocumentDescription: (description: string) => void;
}

const DocumentDescriptionField: React.FC<DocumentDescriptionFieldProps> = ({
  documentDescription,
  setDocumentDescription
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="document-description" className="text-sm font-medium">
        Description (Optional)
      </label>
      <Textarea 
        id="document-description" 
        value={documentDescription} 
        onChange={(e) => setDocumentDescription(e.target.value)}
        placeholder="Enter document description"
        rows={3}
      />
    </div>
  );
};

export default DocumentDescriptionField;
