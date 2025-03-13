
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Incentive } from '@/types/property';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EmptyState from './incentives/EmptyState';
import IncentiveForm from './incentives/IncentiveForm';

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
  const [localIncentives, setLocalIncentives] = useState<Incentive[]>(incentives);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddIncentive = () => {
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEditIncentive = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveIncentive = (index: number) => {
    setLocalIncentives(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveIncentive = (incentive: Incentive) => {
    if (editingIndex !== null) {
      // Edit existing incentive
      setLocalIncentives(prev => prev.map((item, i) => i === editingIndex ? incentive : item));
    } else {
      // Add new incentive
      setLocalIncentives(prev => [...prev, incentive]);
    }
    setShowForm(false);
  };

  const saveIncentivesToDatabase = async () => {
    setIsSaving(true);
    
    try {
      const { data: currentProperty, error: fetchError } = await supabase
        .from('properties')
        .select('incentives')
        .eq('id', propertyId)
        .maybeSingle();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Parse existing metadata or create new object
      let metadata: Record<string, any> = {};
      try {
        const incentivesData = currentProperty?.incentives;
        if (incentivesData) {
          metadata = typeof incentivesData === 'string' 
            ? JSON.parse(incentivesData) 
            : incentivesData;
        }
      } catch (e) {
        console.error("Error parsing incentives data:", e);
        metadata = {};
      }
      
      // Update incentives while preserving other data
      metadata.incentives = localIncentives;
      
      const { error } = await supabase
        .from('properties')
        .update({ 
          incentives: metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);
      
      if (error) throw error;
      
      // Update parent state
      setIncentives(localIncentives);
      toast({
        title: "Success",
        description: "Lease incentives saved successfully.",
      });
      setShowIncentivesDialog(false);
    } catch (error: any) {
      console.error('Error saving incentives:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save incentives: ${error.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalIncentives(incentives);
    setShowIncentivesDialog(false);
  };

  return (
    <Dialog open={showIncentivesDialog} onOpenChange={setShowIncentivesDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Lease Incentives</DialogTitle>
          <DialogDescription>
            Add or edit special terms and incentives included in the lease.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {showForm ? (
            <IncentiveForm 
              initialIncentive={editingIndex !== null ? localIncentives[editingIndex] : undefined}
              onSave={handleSaveIncentive}
              onCancel={() => setShowForm(false)}
            />
          ) : localIncentives.length > 0 ? (
            <div className="space-y-4">
              {localIncentives.map((incentive, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-md">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {incentive.type === 'rent-free' ? 'Rent Free Period' :
                       incentive.type === 'fitout' ? 'Fitout Contribution' :
                       incentive.type === 'break-option' ? 'Break Option' : 
                       'Other Incentive'}
                    </h4>
                    <p className="text-sm">{incentive.description}</p>
                    {incentive.value && (
                      <p className="text-sm mt-1 font-medium">£{incentive.value.toLocaleString()}</p>
                    )}
                    {incentive.period && (
                      <p className="text-sm text-muted-foreground">{incentive.period}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditIncentive(index)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRemoveIncentive(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={handleAddIncentive}
              >
                Add Another Incentive
              </Button>
            </div>
          ) : (
            <EmptyState onAddIncentive={handleAddIncentive} />
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving || showForm}>
            Cancel
          </Button>
          <Button 
            onClick={saveIncentivesToDatabase} 
            disabled={isSaving || showForm || localIncentives.length === 0}
          >
            {isSaving ? 'Saving...' : 'Save Incentives'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncentivesDialog;
