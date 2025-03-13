
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentType } from '@/types/property';

interface DocumentTypeSelectorProps {
  documentType: DocumentType;
  setDocumentType: (type: DocumentType) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  documentType,
  setDocumentType
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="documentType">Document Type</Label>
      <Select
        value={documentType}
        onValueChange={(value) => setDocumentType(value as DocumentType)}
      >
        <SelectTrigger id="documentType">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lease">Lease Agreement</SelectItem>
          <SelectItem value="utility">Utility Bill</SelectItem>
          <SelectItem value="compliance">Compliance Document</SelectItem>
          <SelectItem value="service-charge">Service Charge Statement</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
