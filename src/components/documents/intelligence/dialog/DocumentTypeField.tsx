
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FolderType, DOCUMENT_TYPES } from '@/services/document/types';

interface DocumentTypeFieldProps {
  documentType: FolderType;
  setDocumentType: (type: FolderType) => void;
}

const DocumentTypeField: React.FC<DocumentTypeFieldProps> = ({
  documentType,
  setDocumentType
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentType">Document Type</Label>
      <Select
        value={documentType}
        onValueChange={(value) => setDocumentType(value as FolderType)}
      >
        <SelectTrigger id="documentType">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DOCUMENT_TYPES).map(([type, label]) => (
            <SelectItem key={type} value={type}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeField;
