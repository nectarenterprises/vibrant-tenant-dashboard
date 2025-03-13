
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';

interface PremisesScheduleSectionProps {
  premisesSchedule?: string;
  setShowPremisesDialog: (show: boolean) => void;
  isLoading?: boolean;
}

const PremisesScheduleSection = ({ premisesSchedule, setShowPremisesDialog, isLoading }: PremisesScheduleSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Premises Schedule</CardTitle>
          <CardDescription>Definition of the tenant's demise</CardDescription>
        </div>
        <Button 
          variant="ghost"
          size="sm"
          className="h-8 w-8"
          onClick={() => setShowPremisesDialog(true)}
          disabled={isLoading}
        >
          {premisesSchedule ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        {isLoading ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : premisesSchedule ? (
          <div className="bg-muted p-4 rounded-md">
            <p>{premisesSchedule}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 border border-dashed border-gray-200 rounded-md">
            <p className="text-muted-foreground italic">No premises schedule defined</p>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowPremisesDialog(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Premises Schedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PremisesScheduleSection;
