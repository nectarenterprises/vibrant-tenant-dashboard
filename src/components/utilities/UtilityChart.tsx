
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UtilityChartProps {
  data: any[];
}

const UtilityChart: React.FC<UtilityChartProps> = ({ data }) => {
  const [activeUtilities, setActiveUtilities] = useState({
    electricity: true,
    gas: true,
    water: true
  });

  const toggleUtility = (utility: keyof typeof activeUtilities) => {
    setActiveUtilities(prev => ({
      ...prev,
      [utility]: !prev[utility]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Utility Costs</CardTitle>
        <div className="flex space-x-2 mt-2">
          <button
            className={`px-2 py-1 text-xs rounded ${activeUtilities.electricity ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleUtility('electricity')}
          >
            Electricity
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${activeUtilities.gas ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleUtility('gas')}
          >
            Gas
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${activeUtilities.water ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => toggleUtility('water')}
          >
            Water
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activeUtilities.electricity && (
                <Line
                  type="monotone"
                  dataKey="electricityCost"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  name="Electricity"
                />
              )}
              {activeUtilities.gas && (
                <Line
                  type="monotone"
                  dataKey="gasCost"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                  name="Gas"
                />
              )}
              {activeUtilities.water && (
                <Line
                  type="monotone"
                  dataKey="waterCost"
                  stroke="#22c55e"
                  activeDot={{ r: 8 }}
                  name="Water"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilityChart;
