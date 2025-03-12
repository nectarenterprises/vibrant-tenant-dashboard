
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderPlus, Folder } from 'lucide-react';

interface EmptyStateProps {
  type: 'property' | 'folder';
}

const EmptyState = ({ type }: EmptyStateProps) => {
  return (
    <Card className="h-96 flex items-center justify-center text-center">
      <CardContent>
        {type === 'property' ? (
          <>
            <FolderPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Property</h3>
            <p className="text-muted-foreground">Choose a property from the sidebar to view and manage its documents</p>
          </>
        ) : (
          <>
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Category</h3>
            <p className="text-muted-foreground">Choose a document category to view and manage documents</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
