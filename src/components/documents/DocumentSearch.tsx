
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload, RefreshCcw } from 'lucide-react';

interface DocumentSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadClick: () => void;
  onRefresh: () => void;
}

const DocumentSearch = ({
  searchQuery,
  onSearchChange,
  onUploadClick,
  onRefresh
}: DocumentSearchProps) => {
  return (
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
  );
};

export default DocumentSearch;
