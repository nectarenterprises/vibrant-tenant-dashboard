
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Filter } from 'lucide-react';
import { ViewMode } from './types';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onViewModeChange(viewMode === 'chart' ? 'table' : 'chart')}
    >
      {viewMode === 'chart' ? (
        <><BarChart3 className="h-4 w-4 mr-2" /> View as Table</>
      ) : (
        <><Filter className="h-4 w-4 mr-2" /> View as Chart</>
      )}
    </Button>
  );
};

export default ViewModeSelector;
