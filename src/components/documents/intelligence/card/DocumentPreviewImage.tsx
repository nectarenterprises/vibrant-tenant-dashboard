
import React from 'react';
import { FileText } from 'lucide-react';

interface DocumentPreviewImageProps {
  isImage: boolean;
  isPdf: boolean;
  filePath: string;
  name: string;
}

const DocumentPreviewImage: React.FC<DocumentPreviewImageProps> = ({
  isImage,
  isPdf,
  filePath,
  name
}) => {
  return (
    <>
      {isImage ? (
        <div className="relative h-32 w-full bg-muted rounded-md overflow-hidden">
          <img
            src={`https://bzlzfdolanyeoqmxmwxp.supabase.co/storage/v1/object/public/documents/${filePath}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-muted rounded-md">
          <FileText className="h-12 w-12 text-primary opacity-70" />
        </div>
      )}
    </>
  );
};

export default DocumentPreviewImage;
