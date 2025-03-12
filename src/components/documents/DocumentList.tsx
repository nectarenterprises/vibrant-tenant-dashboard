
import React from 'react';
import { format } from 'date-fns';
import { FileText, Upload, Download, Trash2, Search, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyDocument } from '@/types/property';
import { FolderType } from '@/services/document/types';

interface DocumentListProps {
  documents: PropertyDocument[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
  onRefresh: () => void;
  onDownload: (document: PropertyDocument) => void;
  onDelete: (document: PropertyDocument) => void;
}

const DocumentList = ({
  documents,
  isLoading,
  searchQuery,
  onSearchChange,
  onUploadClick,
  onRefresh,
  onDownload,
  onDelete
}: DocumentListProps) => {
  return (
    <>
      <div className="flex justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={onUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 border rounded-md border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-1">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={onUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <div 
              key={document.id} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{document.name}</p>
                  {document.description && (
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uploaded {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDownload(document)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDelete(document)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DocumentList;
