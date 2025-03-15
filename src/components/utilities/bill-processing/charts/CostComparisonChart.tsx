
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface CostComparisonChartProps {
  data: any[];
  onUploadClick: () => void;
}

const CostComparisonChart: React.FC<CostComparisonChartProps> = ({ data, onUploadClick }) => {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Utility Cost Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
            <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No cost data available</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Upload utility bills to see cost comparison charts
            </p>
            <Button 
              variant="outline"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Bills
            </Button>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="electricity" name="Electricity" fill="#8B5CF6" />
                <Bar dataKey="gas" name="Gas" fill="#F97316" />
                <Bar dataKey="water" name="Water" fill="#0EA5E9" />
                <Bar dataKey="other" name="Other" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostComparisonChart;
