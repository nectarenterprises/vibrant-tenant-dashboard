
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface VersionNotesFieldProps {
  versionNotes: string;
  setVersionNotes: (notes: string) => void;
}

const VersionNotesField: React.FC<VersionNotesFieldProps> = ({
  versionNotes,
  setVersionNotes
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="versionNotes">Version Notes (Optional)</Label>
      <Textarea
        id="versionNotes"
        value={versionNotes}
        onChange={(e) => setVersionNotes(e.target.value)}
        placeholder="Describe what's changed in this version"
        rows={2}
      />
    </div>
  );
};

export default VersionNotesField;
