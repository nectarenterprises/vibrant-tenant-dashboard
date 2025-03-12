
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PremisesScheduleDialogProps {
  showPremisesDialog: boolean;
  setShowPremisesDialog: (show: boolean) => void;
  premisesSchedule: string;
  setPremisesSchedule: (premises: string) => void;
  propertyId: string;
}

const PremisesScheduleDialog: React.FC<PremisesScheduleDialogProps> = ({
  showPremisesDialog,
  setShowPremisesDialog,
  premisesSchedule,
  setPremisesSchedule,
  propertyId
}) => {
  const [localPremisesSchedule, setLocalPremisesSchedule] = useState(premisesSchedule);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('properties')
        .update({ premises_schedule: localPremisesSchedule })
        .eq('id', propertyId);

      if (error) throw error;

      setPremisesSchedule(localPremisesSchedule);
      toast({
        title: "Success",
        description: "Premises schedule updated successfully.",
      });
      setShowPremisesDialog(false);
    } catch (error: any) {
      console.error('Error updating premises schedule:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update premises schedule: ${error.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalPremisesSchedule(premisesSchedule);
    setShowPremisesDialog(false);
  };

  return (
    <Dialog open={showPremisesDialog} onOpenChange={setShowPremisesDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{premisesSchedule ? 'Edit' : 'Add'} Premises Schedule</DialogTitle>
            <DialogDescription>
              Define the premises covered under this lease agreement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="premisesSchedule">Premises Description</Label>
              <Textarea
                id="premisesSchedule"
                placeholder="Describe the premises in detail..."
                rows={8}
                value={localPremisesSchedule}
                onChange={(e) => setLocalPremisesSchedule(e.target.value)}
                className="resize-y"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PremisesScheduleDialog;
