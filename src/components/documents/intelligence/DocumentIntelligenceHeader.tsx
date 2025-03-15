
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Filter, SortAsc, SortDesc, Calendar, Clock, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentIntelligenceHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onUploadClick: () => void;
  onBatchUploadClick: () => void;
  onSortChange: (sortBy: 'date' | 'name' | 'type', sortOrder: 'asc' | 'desc') => void;
  onFilterClick: () => void;
}

const DocumentIntelligenceHeader: React.FC<DocumentIntelligenceHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onUploadClick,
  onBatchUploadClick,
  onSortChange,
  onFilterClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by name or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SortAsc className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onSortChange('date', 'desc')}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Newest first</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('date', 'asc')}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Oldest first</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('name', 'asc')}>
                  <SortAsc className="mr-2 h-4 w-4" />
                  <span>Name (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('name', 'desc')}>
                  <SortDesc className="mr-2 h-4 w-4" />
                  <span>Name (Z-A)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSortChange('type', 'asc')}>
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Type (A-Z)</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="icon" onClick={onFilterClick}>
            <Filter className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onUploadClick}>
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>Single Upload</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onBatchUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                <span>Batch Upload</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-1" />
            Calendar View
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DocumentIntelligenceHeader;
