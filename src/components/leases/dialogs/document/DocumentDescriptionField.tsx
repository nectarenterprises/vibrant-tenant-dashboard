
import React from 'react';
import { Label } from '@/components/ui/label';
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
    <div className="grid gap-2">
      <Label htmlFor="documentDescription">Description (Optional)</Label>
      <Textarea
        id="documentDescription"
        value={documentDescription}
        onChange={(e) => setDocumentDescription(e.target.value)}
        placeholder="Add a brief description of this document"
        rows={2}
      />
    </div>
  );
};

export default DocumentDescriptionField;
