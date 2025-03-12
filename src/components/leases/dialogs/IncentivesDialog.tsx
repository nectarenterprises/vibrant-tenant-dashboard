
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Incentive } from '@/types/property';
import { PlusCircle, Trash } from 'lucide-react';

interface IncentivesDialogProps {
  showIncentivesDialog: boolean;
  setShowIncentivesDialog: (show: boolean) => void;
  incentives: Incentive[];
  setIncentives: (incentives: Incentive[]) => void;
  propertyId: string;
}

type IncentiveType = 'rent-free' | 'fitout' | 'break-option' | 'other';

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
      // Filter out any empty descriptions
      const validIncentives = localIncentives.filter(inc => inc.description.trim() !== '');
      
      const { error } = await supabase
        .from('properties')
        .update({ incentives: validIncentives })
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
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No incentives added yet</p>
              </div>
            ) : (
              localIncentives.map((incentive, index) => (
                <div key={index} className="p-4 border rounded-md space-y-3 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveIncentive(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor={`incentive-type-${index}`}>Incentive Type</Label>
                    <Select
                      value={incentive.type}
                      onValueChange={(value) => handleIncentiveChange(index, 'type', value as IncentiveType)}
                    >
                      <SelectTrigger id={`incentive-type-${index}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rent-free">Rent Free Period</SelectItem>
                        <SelectItem value="fitout">Fitout Contribution</SelectItem>
                        <SelectItem value="break-option">Break Option</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor={`incentive-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`incentive-desc-${index}`}
                      placeholder="Describe the incentive..."
                      value={incentive.description}
                      onChange={(e) => handleIncentiveChange(index, 'description', e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor={`incentive-value-${index}`}>Value (£)</Label>
                      <Input
                        id={`incentive-value-${index}`}
                        type="number"
                        placeholder="e.g. 5000"
                        value={incentive.value || ''}
                        onChange={(e) => handleIncentiveChange(index, 'value', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor={`incentive-period-${index}`}>Period</Label>
                      <Input
                        id={`incentive-period-${index}`}
                        placeholder="e.g. 3 months"
                        value={incentive.period || ''}
                        onChange={(e) => handleIncentiveChange(index, 'period', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddIncentive}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Incentive
            </Button>
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
