
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
  handlePropertySelect: (propertyId: string, properties: Property[]) => void;
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
    <div className="space-y-6">
      {/* Property Selector */}
      <PropertySelector
        properties={properties}
        selectedProperty={selectedProperty}
        isLoading={propertiesLoading}
        onSelectProperty={(propertyId) => handlePropertySelect(propertyId, properties)}
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
