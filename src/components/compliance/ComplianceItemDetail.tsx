
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ComplianceItem } from '@/types/compliance';
import { ArrowLeft, Download, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComplianceItemDetailProps {
  item: ComplianceItem;
  onBack: () => void;
}

const ComplianceItemDetail: React.FC<ComplianceItemDetailProps> = ({ item, onBack }) => {
  const { name, icon: Icon, lastCompleted, nextDue, status, certificates } = item;
  
  // Format dates
  const formattedLastCompleted = format(parseISO(lastCompleted), 'dd MMMM yyyy');
  const formattedNextDue = format(parseISO(nextDue), 'dd MMMM yyyy');
  
  // Calculate days until next due date
  const today = new Date();
  const daysUntilDue = differenceInDays(parseISO(nextDue), today);
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'upcoming':
        return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusInfo = () => {
    if (status === 'overdue') {
      return `Overdue by ${Math.abs(daysUntilDue)} days`;
    } else if (status === 'upcoming') {
      return `Due in ${daysUntilDue} days`;
    } else {
      return `Next due in ${daysUntilDue} days`;
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4 gap-2 p-0 h-auto hover:bg-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to compliance items</span>
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-muted">
              <Icon className="h-6 w-6 text-tenant-green" />
            </div>
            <div>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Compliance requirement details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Status Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor())}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Last completed:</span>
                  <span>{formattedLastCompleted}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Next due:</span>
                  <span>{formattedNextDue}</span>
                </div>
                
                <div className="flex items-center p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>{getStatusInfo()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Certificates & History</h3>
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <div 
                    key={certificate.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-tenant-green" />
                      <div>
                        <p className="font-medium">{certificate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(certificate.date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <a href={certificate.fileUrl}>
                        <Download className="h-4 w-4" />
                        <span className="sr-md:not-sr-only sr-only">Download</span>
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4">Upload New Certificate</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceItemDetail;
