
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
  onTypeChange: (type: FolderType) => void;
}

const DocumentTypeField: React.FC<DocumentTypeFieldProps> = ({
  documentType,
  onTypeChange
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="document-type">Document Type</Label>
      <Select
        value={documentType}
        onValueChange={(value) => onTypeChange(value as FolderType)}
      >
        <SelectTrigger id="document-type">
          <SelectValue placeholder="Select document type" />
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
