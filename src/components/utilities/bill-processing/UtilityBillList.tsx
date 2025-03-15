
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  Upload, 
  Zap, 
  Droplets, 
  Flame, 
  File, 
  ArrowUpRight 
} from 'lucide-react';
import { UtilityBill } from '@/types/utility';

interface UtilityBillListProps {
  utilityBills: UtilityBill[];
  isLoading: boolean;
  onUploadClick: () => void;
}

const UtilityBillList: React.FC<UtilityBillListProps> = ({
  utilityBills,
  isLoading,
  onUploadClick
}) => {
  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <Zap className="h-4 w-4 text-tenant-purple" />;
      case 'gas':
        return <Flame className="h-4 w-4 text-tenant-orange" />;
      case 'water':
        return <Droplets className="h-4 w-4 text-tenant-teal" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-tenant-green rounded-full"></div>
      </div>
    );
  }
  
  if (utilityBills.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-muted-foreground">No utility bills found</p>
        <Button 
          variant="outline"
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Utility Bill
        </Button>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Bill Date</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Meter Ref</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {utilityBills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getUtilityIcon(bill.utilityType)}
                <span className="capitalize">{bill.utilityType}</span>
              </div>
            </TableCell>
            <TableCell>{format(new Date(bill.billDate), 'dd MMM yyyy')}</TableCell>
            <TableCell>
              {format(new Date(bill.periodStart), 'dd MMM')} - {format(new Date(bill.periodEnd), 'dd MMM yyyy')}
            </TableCell>
            <TableCell>£{bill.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              {bill.usageQuantity ? `${bill.usageQuantity} ${bill.usageUnit || ''}` : '-'}
            </TableCell>
            <TableCell>{bill.meterReference || '-'}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(bill.createdAt), { addSuffix: true })}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UtilityBillList;
