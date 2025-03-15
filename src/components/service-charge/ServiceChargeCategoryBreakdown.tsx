
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, Calendar } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';

interface ServiceChargeCategoryBreakdownProps {
  property: Property;
}

const ServiceChargeCategoryBreakdown: React.FC<ServiceChargeCategoryBreakdownProps> = ({ property }) => {
  const [timeframe, setTimeframe] = useState<'current' | '1year' | '3year' | 'custom'>('current');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Mock data - would be replaced with real data from API
  const categoryData = [
    { category: 'Maintenance', value: 6300, percent: 26.9, color: '#f97316' },
    { category: 'Security', value: 4200, percent: 17.9, color: '#3b82f6' },
    { category: 'Cleaning', value: 3360, percent: 14.3, color: '#22c55e' },
    { category: 'Utilities', value: 5040, percent: 21.5, color: '#8b5cf6' },
    { category: 'Insurance', value: 2100, percent: 9.0, color: '#ec4899' },
    { category: 'Management Fee', value: 2520, percent: 10.8, color: '#f59e0b' }
  ];
  
  // Mock subcategories for a category detail drill-down
  const getSubcategoryData = (category: string) => {
    switch(category) {
      case 'Maintenance':
        return [
          { name: 'Building Fabric', value: 2500, percent: 39.7, color: '#f97316' },
          { name: 'HVAC Systems', value: 1600, percent: 25.4, color: '#fb923c' },
          { name: 'Electrical', value: 1200, percent: 19.0, color: '#fdba74' },
          { name: 'Plumbing', value: 1000, percent: 15.9, color: '#fed7aa' }
        ];
      case 'Utilities':
        return [
          { name: 'Electricity', value: 2800, percent: 55.6, color: '#8b5cf6' },
          { name: 'Water', value: 1200, percent: 23.8, color: '#a78bfa' },
          { name: 'Gas', value: 1040, percent: 20.6, color: '#c4b5fd' }
        ];
      default:
        return [];
    }
  };
  
  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB')}`;
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.percent}% of total</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCategoryDetail = () => {
    if (!selectedCategory) return null;
    
    const subcategories = getSubcategoryData(selectedCategory);
    const categoryInfo = categoryData.find(c => c.category === selectedCategory);
    
    if (!categoryInfo || subcategories.length === 0) {
      return (
        <div className="text-center py-10">
          <p>No detailed breakdown available for this category</p>
          <Button 
            variant="outline" 
            onClick={() => setSelectedCategory(null)} 
            className="mt-4"
          >
            Return to overview
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{selectedCategory} Breakdown</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedCategory(null)}
          >
            Back to overview
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'pie' ? (
                    <PieChart>
                      <Pie
                        data={subcategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {subcategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={subcategories}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `£${value}`} />
                      <Tooltip formatter={(value) => [`£${value}`, '']} />
                      <Bar dataKey="value">
                        {subcategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total {selectedCategory} Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(categoryInfo.value)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">% of Total Service Charge</p>
                  <p className="text-xl font-medium">{categoryInfo.percent}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Cost per sqft</p>
                  <p className="text-xl font-medium">£3.15</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Benchmark Comparison</p>
                  <p className="text-xl font-medium text-amber-600">+4.2% above market</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderCategoryOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Category Breakdown</CardTitle>
              <Tabs 
                value={chartType} 
                onValueChange={(value: 'pie' | 'bar') => setChartType(value)} 
                className="w-auto"
              >
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="pie" className="flex items-center gap-1 px-3">
                    <PieChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Pie</span>
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-1 px-3">
                    <BarChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Bar</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="category"
                      label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      onClick={(data) => setSelectedCategory(data.category)}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart
                    data={categoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    onClick={(data) => data && data.activePayload && setSelectedCategory(data.activePayload[0].payload.category)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `£${value}`} />
                    <Tooltip formatter={(value) => [`£${value}`, '']} />
                    <Bar dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Summary Information</CardTitle>
            <CardDescription>Click on a category to see details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">{property.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <Select value={timeframe} onValueChange={(v: any) => setTimeframe(v)}>
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Year</SelectItem>
                      <SelectItem value="1year">vs Last Year</SelectItem>
                      <SelectItem value="3year">3 Year Trend</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Service Charge</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(categoryData.reduce((sum, item) => sum + item.value, 0))}
                </p>
              </div>
              
              <div className="pt-2 space-y-3">
                <p className="text-sm font-medium">Categories</p>
                {categoryData.map((category, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{category.category}</span>
                        <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${category.percent}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {selectedCategory ? renderCategoryDetail() : renderCategoryOverview()}
    </div>
  );
};

export default ServiceChargeCategoryBreakdown;
