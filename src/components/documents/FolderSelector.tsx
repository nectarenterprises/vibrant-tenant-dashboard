
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';
import { DocumentFolder } from '@/services/document/types';

interface FolderSelectorProps {
  folders: DocumentFolder[];
  selectedFolder: DocumentFolder | null;
  onSelectFolder: (folder: DocumentFolder) => void;
}

const FolderSelector = ({ folders, selectedFolder, onSelectFolder }: FolderSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Categories</CardTitle>
        <CardDescription>Organize by document type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {folders.map(folder => (
            <Button
              key={folder.id}
              variant={selectedFolder?.id === folder.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectFolder(folder)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folder.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderSelector;
