
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { downloadDocument } from '@/services/FileStorageService';
import { DocumentVersion } from '@/services/document/types';
import { format } from 'date-fns';
import { Download, Check } from 'lucide-react';
import { PropertyDocument } from '@/types/property';

interface DocumentVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  document: PropertyDocument | null;
  versions: DocumentVersion[];
  isLoading: boolean;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  isOpen,
  onClose,
  document,
  versions,
  isLoading
}) => {
  const handleDownload = async (filePath: string) => {
    await downloadDocument(filePath);
  };
  
  if (!document) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Version History - {document.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.length === 0 ? (
                <p className="text-center text-muted-foreground">No version history available</p>
              ) : (
                versions.map((version, index) => (
                  <div 
                    key={`${version.version}-${index}`}
                    className={`flex items-start justify-between p-4 rounded-md ${index === 0 ? 'bg-muted/50 border' : 'border'}`}
                  >
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">Version {version.version}</h3>
                        {index === 0 && (
                          <div className="ml-2 bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Current
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Uploaded on {format(new Date(version.uploadDate), 'PPP')}
                      </p>
                      {version.notes && (
                        <p className="text-sm mt-2 bg-muted p-2 rounded">
                          {version.notes}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(version.filePath)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVersionHistory;
