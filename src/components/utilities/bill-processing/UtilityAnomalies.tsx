
import React from 'react';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Zap, Droplets, Flame, File, BarChart } from 'lucide-react';

interface UtilityAnomalyProps {
  anomalies: Array<{
    billId: string;
    utilityType: string;
    anomalyType: string;
    severity: string;
    description: string;
  }>;
}

const UtilityAnomalies: React.FC<UtilityAnomalyProps> = ({ anomalies }) => {
  if (anomalies.length === 0) return null;
  
  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <Zap className="h-4 w-4" />;
      case 'gas':
        return <Flame className="h-4 w-4" />;
      case 'water':
        return <Droplets className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'usage_increase':
        return <TrendingUp className="h-4 w-4" />;
      case 'cost_increase':
        return <BarChart className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
      case 'medium':
        return 'bg-amber-500 text-white hover:bg-amber-600';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };
  
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Anomalies Detected</AlertTitle>
      <AlertDescription>
        We've detected {anomalies.length} anomalies in your utility consumption patterns.
      </AlertDescription>
      
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="anomalies">
          <AccordionTrigger>View Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
              {anomalies.map((anomaly, index) => (
                <div 
                  key={`${anomaly.billId}-${index}`}
                  className="flex items-start gap-2 p-3 bg-background/50 rounded-md border"
                >
                  <div className="mt-0.5">
                    {getUtilityIcon(anomaly.utilityType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">
                        {anomaly.utilityType}
                      </span>
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{anomaly.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Alert>
  );
};

export default UtilityAnomalies;
