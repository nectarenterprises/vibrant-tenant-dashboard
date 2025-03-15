
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File, Upload } from 'lucide-react';
import { PropertyDocument } from '@/types/property';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DocumentsListProps {
  title: string;
  documents: PropertyDocument[];
  isLoading: boolean;
  onDownload: (document: PropertyDocument) => void;
  onUpload?: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  title,
  documents,
  isLoading,
  onDownload,
  onUpload
}) => {
  const renderSkeletonItems = () => (
    Array(3).fill(0).map((_, index) => (
      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
        <div className="space-y-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
    ))
  );

  return (
    <Card>
      <CardHeader className={cn("pb-2", onUpload && "flex flex-row items-center justify-between")}>
        <CardTitle className="text-lg">{title} Invoices</CardTitle>
        {onUpload && (
          <Button size="sm" onClick={onUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {renderSkeletonItems()}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 border rounded-md border-dashed">
            <File className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No invoices found</p>
            {onUpload && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.uploadDate).toLocaleDateString()} • {document.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => onDownload(document)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsList;
