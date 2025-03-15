
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormFooterProps {
  onSave: () => void;
  onCancel: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ onSave, onCancel }) => {
  return (
    <DialogFooter className="mt-6">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        onClick={onSave}
        className="bg-tenant-green hover:bg-tenant-darkGreen"
      >
        Save & Process
      </Button>
    </DialogFooter>
  );
};

export default FormFooter;
