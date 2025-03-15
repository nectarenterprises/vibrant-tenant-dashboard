
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewCategoryInputProps {
  newCategoryName: string;
  onNameChange: (name: string) => void;
  onAddCategory: () => void;
}

const NewCategoryInput: React.FC<NewCategoryInputProps> = ({ 
  newCategoryName, 
  onNameChange, 
  onAddCategory 
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center mt-4">
      <div className="col-span-5">
        <Input 
          placeholder="New category name" 
          value={newCategoryName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div className="col-span-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onAddCategory}
          className="w-full"
        >
          Add Category
        </Button>
      </div>
    </div>
  );
};

export default NewCategoryInput;
