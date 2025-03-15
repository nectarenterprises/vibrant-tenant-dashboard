
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentTag } from '@/types/property';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TagManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tags: DocumentTag[];
  onAddTag: (tag: Omit<DocumentTag, 'id'>) => void;
  onUpdateTag: (tag: DocumentTag) => void;
  onDeleteTag: (tagId: string) => void;
}

const TagManagementDialog: React.FC<TagManagementDialogProps> = ({
  isOpen,
  onClose,
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [editingTag, setEditingTag] = useState<DocumentTag | null>(null);
  
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    onAddTag({
      name: newTagName.trim(),
      color: newTagColor
    });
    
    setNewTagName('');
    setNewTagColor('#3b82f6');
  };
  
  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) return;
    
    onUpdateTag(editingTag);
    setEditingTag(null);
  };
  
  const startEditing = (tag: DocumentTag) => {
    setEditingTag({ ...tag });
  };
  
  const cancelEditing = () => {
    setEditingTag(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Add New Tag</h3>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="tagName" className="sr-only">Tag Name</Label>
                <Input
                  id="tagName"
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tagColor" className="sr-only">Tag Color</Label>
                <input
                  id="tagColor"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="h-10 w-10 border border-input rounded cursor-pointer"
                />
              </div>
              <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Existing Tags</h3>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags created yet.</p>
            ) : (
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center justify-between border rounded-md p-2">
                    {editingTag && editingTag.id === tag.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="color"
                          value={editingTag.color}
                          onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                          className="h-6 w-6 border border-input rounded cursor-pointer"
                        />
                        <Input
                          value={editingTag.name}
                          onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                          className="h-8 flex-1"
                        />
                        <Button variant="ghost" size="sm" onClick={handleUpdateTag} disabled={!editingTag.name.trim()}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{ 
                              backgroundColor: tag.color,
                              color: 'white'
                            }}
                          >
                            {tag.name}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(tag)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteTag(tag.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;
