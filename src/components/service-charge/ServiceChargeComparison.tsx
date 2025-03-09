
import React, { useState } from 'react';
import { Property } from '@/types/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ServiceChargeCategory {
  category: string;
  amount: number;
  percentage: number;
}

interface ServiceChargeComparisonProps {
  property: Property;
  currentYearCharges: ServiceChargeCategory[];
  onClose: () => void;
}

const ServiceChargeComparison: React.FC<ServiceChargeComparisonProps> = ({
  property,
  currentYearCharges,
  onClose
}) => {
  const [selectedYear, setSelectedYear] = useState('2022');
  const currentYear = new Date().getFullYear().toString();
  
  // Generate mock previous year data with some variations
  const generatePreviousYearData = (year: string) => {
    const yearVariationFactor = year === '2022' ? 0.85 : year === '2021' ? 0.75 : 0.65;
    
    return currentYearCharges.map(charge => ({
      ...charge,
      previousAmount: charge.amount * yearVariationFactor * (1 + (Math.random() * 0.2 - 0.1)),
    }));
  };
  
  const comparisonData = generatePreviousYearData(selectedYear);
  
  // Prepare data for the chart
  const chartData = comparisonData.map(item => ({
    category: item.category,
    [currentYear]: Math.round(item.amount),
    [selectedYear]: Math.round(item.previousAmount),
  }));
  
  // Calculate total for current and selected year
  const currentYearTotal = currentYearCharges.reduce((sum, charge) => sum + charge.amount, 0);
  const previousYearTotal = comparisonData.reduce((sum, charge) => sum + charge.previousAmount, 0);
  const percentageChange = ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year Comparison</CardTitle>
            <CardDescription>
              Compare {currentYear} service charges with previous years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="font-medium mr-1">{selectedYear}</span>
                <ArrowLeftRight className="h-4 w-4 mx-1" />
                <span className="font-medium ml-1">{currentYear}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Service Charge</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-2xl font-semibold">${Math.round(currentYearTotal).toLocaleString()}</p>
                    <span className="text-sm text-muted-foreground">/year</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">vs {selectedYear}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <p className="text-xl font-medium">${Math.round(previousYearTotal).toLocaleString()}</p>
                    {percentageChange > 0 ? (
                      <div className="flex items-center text-tenant-orange">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+{percentageChange.toFixed(1)}%</span>
                      </div>
                    ) : percentageChange < 0 ? (
                      <div className="flex items-center text-tenant-green">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        <span>{percentageChange.toFixed(1)}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <Minus className="h-4 w-4 mr-1" />
                        <span>0%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Cost Comparison by Category</CardTitle>
          <CardDescription>
            Comparing {currentYear} vs {selectedYear} service charge breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                barGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                <Bar 
                  dataKey={currentYear} 
                  name={`${currentYear} Cost`} 
                  fill="#2D6A4F" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Bar 
                  dataKey={selectedYear} 
                  name={`${selectedYear} Cost`} 
                  fill="#74C69D" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="font-medium text-lg">Detailed Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisonData.map((item) => {
                const difference = item.amount - item.previousAmount;
                const percentChange = (difference / item.previousAmount) * 100;
                
                return (
                  <Card key={item.category} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{item.category}</h4>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{currentYear}:</span>
                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{selectedYear}:</span>
                        <span className="font-medium">${item.previousAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Change:</span>
                        <div className={`flex items-center text-sm ${
                          percentChange > 0 
                            ? 'text-tenant-orange' 
                            : percentChange < 0 
                              ? 'text-tenant-green' 
                              : 'text-muted-foreground'
                        }`}>
                          {percentChange > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : percentChange < 0 ? (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          ) : (
                            <Minus className="h-3 w-3 mr-1" />
                          )}
                          <span>{percentChange.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceChargeComparison;
