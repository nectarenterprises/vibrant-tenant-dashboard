
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Incentive } from '@/types/property';
import { PlusCircle } from 'lucide-react';
import IncentiveForm from './incentives/IncentiveForm';
import EmptyState from './incentives/EmptyState';

interface IncentivesDialogProps {
  showIncentivesDialog: boolean;
  setShowIncentivesDialog: (show: boolean) => void;
  incentives: Incentive[];
  setIncentives: (incentives: Incentive[]) => void;
  propertyId: string;
}

const IncentivesDialog: React.FC<IncentivesDialogProps> = ({
  showIncentivesDialog,
  setShowIncentivesDialog,
  incentives,
  setIncentives,
  propertyId
}) => {
  const [localIncentives, setLocalIncentives] = useState<Incentive[]>(incentives || []);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleAddIncentive = () => {
    const newIncentive: Incentive = {
      type: 'rent-free',
      description: '',
    };
    setLocalIncentives([...localIncentives, newIncentive]);
  };
  
  const handleIncentiveChange = (index: number, field: keyof Incentive, value: any) => {
    const updatedIncentives = [...localIncentives];
    updatedIncentives[index] = {
      ...updatedIncentives[index],
      [field]: value
    };
    setLocalIncentives(updatedIncentives);
  };
  
  const handleRemoveIncentive = (index: number) => {
    const updatedIncentives = localIncentives.filter((_, i) => i !== index);
    setLocalIncentives(updatedIncentives);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const validIncentives = localIncentives.filter(inc => inc.description.trim() !== '');
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          incentives: JSON.stringify(validIncentives)
        })
        .eq('id', propertyId);

      if (error) throw error;

      setIncentives(validIncentives);
      toast({
        title: "Success",
        description: "Lease incentives updated successfully.",
      });
      setShowIncentivesDialog(false);
    } catch (error: any) {
      console.error('Error updating incentives:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update incentives: ${error.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalIncentives(incentives || []);
    setShowIncentivesDialog(false);
  };

  return (
    <Dialog open={showIncentivesDialog} onOpenChange={setShowIncentivesDialog}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{incentives?.length ? 'Edit' : 'Add'} Lease Incentives</DialogTitle>
            <DialogDescription>
              Define special terms and benefits included in the lease.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {localIncentives.length === 0 ? (
              <EmptyState onAddIncentive={handleAddIncentive} />
            ) : (
              <>
                {localIncentives.map((incentive, index) => (
                  <IncentiveForm
                    key={index}
                    incentive={incentive}
                    index={index}
                    onChange={handleIncentiveChange}
                    onRemove={handleRemoveIncentive}
                  />
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddIncentive}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Incentive
                </Button>
              </>
            )}
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

export default IncentivesDialog;
