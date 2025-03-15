
import React from 'react';
import { Property } from '@/types/property';
import { DocumentFolder } from '@/services/document/types';
import PropertySelector from './PropertySelector';
import FolderSelector from './FolderSelector';

interface SidebarSelectorsProps {
  properties: Property[];
  selectedProperty: Property | null;
  folderStructure: DocumentFolder[];
  selectedFolder: DocumentFolder | null;
  propertiesLoading: boolean;
  handlePropertySelect: (propertyId: string) => void;
  handleFolderSelect: (folder: DocumentFolder) => void;
}

const SidebarSelectors = ({
  properties,
  selectedProperty,
  folderStructure,
  selectedFolder,
  propertiesLoading,
  handlePropertySelect,
  handleFolderSelect
}: SidebarSelectorsProps) => {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold mb-2">Documents</h2>
      
      {/* Property Selector */}
      <PropertySelector
        properties={properties}
        selectedProperty={selectedProperty}
        isLoading={propertiesLoading}
        onSelectProperty={handlePropertySelect}
      />
      
      {/* Folder Selector (only show if property is selected) */}
      {selectedProperty && (
        <FolderSelector
          folders={folderStructure}
          selectedFolder={selectedFolder}
          onSelectFolder={handleFolderSelect}
        />
      )}
    </div>
  );
};

export default SidebarSelectors;
