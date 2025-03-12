
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PremisesScheduleSectionProps {
  premisesSchedule?: string;
}

const PremisesScheduleSection = ({ premisesSchedule }: PremisesScheduleSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premises Schedule</CardTitle>
        <CardDescription>Definition of the tenant's demise</CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        {premisesSchedule ? (
          <div className="bg-muted p-4 rounded-md">
            <p>{premisesSchedule}</p>
          </div>
        ) : (
          <p className="text-muted-foreground italic">No premises schedule defined</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PremisesScheduleSection;
