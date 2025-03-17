
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtilityType } from '@/types/utility';

interface BillHistorySectionProps {
  utilityBills: any[];
  isLoading: boolean;
  selectedUtilityType: UtilityType | null;
  setSelectedUtilityType: (type: UtilityType | null) => void;
  onUploadClick: () => void;
}

const BillHistorySection: React.FC<BillHistorySectionProps> = ({
  utilityBills,
  isLoading,
  selectedUtilityType,
  setSelectedUtilityType,
  onUploadClick
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Bill History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : utilityBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-sm text-muted-foreground">No bills uploaded yet</p>
            <Button variant="outline" size="sm" onClick={onUploadClick}>
              Upload Bill
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 mb-4">
              <Button 
                variant={selectedUtilityType === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedUtilityType(null)}
              >
                All
              </Button>
              <Button 
                variant={selectedUtilityType === 'electricity' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedUtilityType('electricity')}
              >
                Electricity
              </Button>
              <Button 
                variant={selectedUtilityType === 'gas' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedUtilityType('gas')}
              >
                Gas
              </Button>
              <Button 
                variant={selectedUtilityType === 'water' ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedUtilityType('water')}
              >
                Water
              </Button>
            </div>
            <p>Bill list would go here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillHistorySection;
