import React, { useState, useEffect } from 'react';
import { PropertyDocument } from '@/types/property';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadDocument } from '@/services/document';
import { toast } from '@/components/ui/use-toast';

interface DocumentPreviewProps {
  document: PropertyDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  
  useEffect(() => {
    if (!document || !isOpen) {
      setPreviewUrl(null);
      return;
    }
    
    setLoading(true);
    
    const loadPreview = async () => {
      try {
        const fileExtension = document.filePath.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'pdf') {
          setIsPdf(true);
          setIsImage(false);
          setPreviewUrl(`/api/preview/${document.id}`);
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
          setIsImage(true);
          setIsPdf(false);
          setPreviewUrl(`/api/files/${document.filePath}`);
        } else {
          setIsImage(false);
          setIsPdf(false);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Error loading preview:', error);
        toast({
          title: "Preview failed",
          description: "Could not load document preview",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPreview();
    
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [document, isOpen]);
  
  const handleDownload = async () => {
    if (!document) return;
    
    try {
      await downloadDocument(document.filePath, document.name);
      await updateDocumentAccessTimestamp(document.id);
      
      toast({
        title: "Download started",
        description: `${document.name} is being downloaded`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not download the document",
        variant: "destructive"
      });
    }
  };
  
  if (!document) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[600px]">{document.name}</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : isPdf && previewUrl ? (
            <iframe 
              src={previewUrl} 
              className="w-full h-[500px] border-0"
              title={document.name}
            />
          ) : isImage && previewUrl ? (
            <div className="flex items-center justify-center h-[500px] bg-black/5">
              <img 
                src={previewUrl} 
                alt={document.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-4">
              <p className="text-muted-foreground mb-4">
                Preview not available for this file type
              </p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
