
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PropertySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search properties..."
        className="pl-10 bg-background"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default PropertySearch;
