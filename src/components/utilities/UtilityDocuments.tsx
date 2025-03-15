
import React from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyDocument } from '@/types/property';
import { FolderType } from '@/services/document/types';

interface UtilityDocumentsProps {
  utilityDocuments: PropertyDocument[];
  documentsLoading: boolean;
  documentType: FolderType;
  onUploadClick: () => void;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
}

const UtilityDocuments: React.FC<UtilityDocumentsProps> = ({
  utilityDocuments,
  documentsLoading,
  documentType,
  onUploadClick,
  onDownload,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Utility Documents</CardTitle>
        <Button 
          size="sm" 
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {documentsLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : utilityDocuments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No utility documents found</p>
            <Button 
              variant="outline" 
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Utility Bill
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {utilityDocuments.map((document) => (
              <div 
                key={document.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDownload(document)}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(document)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UtilityDocuments;
