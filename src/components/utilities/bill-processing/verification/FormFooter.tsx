
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormFooterProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ 
  onSave, 
  onCancel, 
  isSaving = false 
}) => {
  return (
    <>
      <Button variant="outline" onClick={onCancel} disabled={isSaving}>
        Cancel
      </Button>
      <Button 
        type="submit"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </>
  );
};

export default FormFooter;
