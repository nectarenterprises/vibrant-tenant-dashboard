
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UtilityBillList from '../UtilityBillList';
import { UtilityBill, UtilityType } from '@/types/utility';

interface BillHistorySectionProps {
  utilityBills: UtilityBill[];
  isLoading: boolean;
  selectedUtilityType: string;
  setSelectedUtilityType: (value: string) => void;
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
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-md">Utility Bill History</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedUtilityType === 'all' ? 'all' : selectedUtilityType}
              onValueChange={(value) => setSelectedUtilityType(value === 'all' ? 'all' : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UtilityBillList 
          utilityBills={utilityBills}
          isLoading={isLoading}
          onUploadClick={onUploadClick}
        />
      </CardContent>
    </Card>
  );
};

export default BillHistorySection;
