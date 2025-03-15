
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceItem } from '@/types/compliance';
import { AlertTriangle, CheckCircle, AlertCircle, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ComplianceWidgetProps {
  complianceItems: ComplianceItem[];
}

const ComplianceWidget: React.FC<ComplianceWidgetProps> = ({ complianceItems }) => {
  const sortedItems = [...complianceItems].sort((a, b) => {
    // Sort by status: overdue first, then upcoming, then completed
    const statusOrder = { 'overdue': 0, 'upcoming': 1, 'completed': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'upcoming': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'overdue': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': 
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'upcoming': 
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Upcoming</Badge>;
      case 'overdue': 
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedItems.length > 0 ? (
          <div className="space-y-4">
            {sortedItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 border-b pb-3 last:border-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(item.nextDue).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No compliance items to display
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceWidget;
