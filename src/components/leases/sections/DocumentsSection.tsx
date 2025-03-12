
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Upload } from 'lucide-react';

interface DocumentsSectionProps {
  setShowDocumentDialog: (show: boolean) => void;
}

const DocumentsSection = ({ setShowDocumentDialog }: DocumentsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Documents</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowDocumentDialog(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
            <p className="text-muted-foreground">No documents uploaded</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setShowDocumentDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
