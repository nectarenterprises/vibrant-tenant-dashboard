
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConfidenceIndicatorProps {
  score: number | undefined;
  field: string;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ score, field }) => {
  if (!score) return null;
  
  let indicator;
  if (score >= 0.8) {
    indicator = <Check className="h-4 w-4 text-green-500" />;
  } else if (score >= 0.6) {
    indicator = <AlertTriangle className="h-4 w-4 text-amber-500" />;
  } else {
    indicator = <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="ml-1">
            {indicator}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Confidence: {Math.round((score || 0) * 100)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConfidenceIndicator;
