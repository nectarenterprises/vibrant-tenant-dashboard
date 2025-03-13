
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DocumentNameFieldProps {
  documentName: string;
  setDocumentName: (name: string) => void;
}

const DocumentNameField: React.FC<DocumentNameFieldProps> = ({
  documentName,
  setDocumentName
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentName">Document Name</Label>
      <Input
        id="documentName"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        placeholder="e.g. Lease Agreement 2023"
      />
    </div>
  );
};

export default DocumentNameField;
