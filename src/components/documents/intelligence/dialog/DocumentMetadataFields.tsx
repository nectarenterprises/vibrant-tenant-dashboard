
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DocumentMetadataFieldsProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const DocumentMetadataFields: React.FC<DocumentMetadataFieldsProps> = ({
  name,
  setName,
  description,
  setDescription
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="documentName">Document Name</Label>
        <Input
          id="documentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lease Agreement 2023"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="documentDescription">Description (Optional)</Label>
        <Textarea
          id="documentDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a brief description of this document"
          rows={2}
        />
      </div>
    </>
  );
};

export default DocumentMetadataFields;
