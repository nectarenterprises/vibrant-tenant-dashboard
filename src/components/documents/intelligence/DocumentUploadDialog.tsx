
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentTag } from '@/types/property';
import { FolderType } from '@/services/document/types';

// Import smaller component pieces
import FileUploadField from './dialog/FileUploadField';
import VersionNotesField from './dialog/VersionNotesField';
import DocumentTypeField from './dialog/DocumentTypeField';
import DocumentMetadataFields from './dialog/DocumentMetadataFields';
import TagSelector from './dialog/TagSelector';
import DateFields from './dialog/DateFields';
import DialogActions from './dialog/DialogActions';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    file: File, 
    documentType: FolderType, 
    name: string, 
    description: string,
    tags: DocumentTag[],
    expiryDate?: string,
    keyDates?: {
      commencement?: string;
      expiry?: string;
    },
    notificationPeriod?: number
  ) => Promise<void>;
  availableTags: DocumentTag[];
  isUploading: boolean;
  existingDocument?: { id: string } | null;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  availableTags,
  isUploading,
  existingDocument
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<FolderType>('lease');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [commencementDate, setCommencementDate] = useState<Date | undefined>(undefined);
  const [leaseExpiryDate, setLeaseExpiryDate] = useState<Date | undefined>(undefined);
  const [notificationPeriod, setNotificationPeriod] = useState<number>(90);
  const [versionNotes, setVersionNotes] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) {
        setName(e.target.files[0].name);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    const keyDates = {
      commencement: commencementDate?.toISOString(),
      expiry: leaseExpiryDate?.toISOString(),
    };
    
    await onUpload(
      file, 
      documentType, 
      name, 
      description,
      selectedTags,
      expiryDate?.toISOString(),
      keyDates,
      notificationPeriod
    );
    
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setFile(null);
    setDocumentType('lease');
    setName('');
    setDescription('');
    setSelectedTags([]);
    setExpiryDate(undefined);
    setCommencementDate(undefined);
    setLeaseExpiryDate(undefined);
    setNotificationPeriod(90);
    setVersionNotes('');
  };
  
  const toggleTag = (tag: DocumentTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const title = existingDocument ? 'Upload New Version' : 'Upload Document';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onClose();
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <FileUploadField 
            file={file}
            setFile={setFile}
            onFileChange={handleFileChange}
          />
          
          {existingDocument ? (
            <VersionNotesField 
              versionNotes={versionNotes}
              setVersionNotes={setVersionNotes}
            />
          ) : (
            <>
              <DocumentTypeField 
                documentType={documentType}
                setDocumentType={setDocumentType}
              />
              
              <DocumentMetadataFields 
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
              />
              
              <TagSelector 
                selectedTags={selectedTags}
                availableTags={availableTags}
                toggleTag={toggleTag}
              />
              
              <DateFields 
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                notificationPeriod={notificationPeriod}
                setNotificationPeriod={setNotificationPeriod}
                commencementDate={commencementDate}
                setCommencementDate={setCommencementDate}
                leaseExpiryDate={leaseExpiryDate}
                setLeaseExpiryDate={setLeaseExpiryDate}
              />
            </>
          )}
        </div>
        
        <DialogActions 
          isUploading={isUploading}
          file={file}
          name={name}
          existingDocument={existingDocument}
          onClose={onClose}
          onUpload={handleUpload}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
