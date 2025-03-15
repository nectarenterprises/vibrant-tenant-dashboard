
import React from 'react';
import CategoryComparisonCard from './CategoryComparisonCard';

interface DetailedComparisonGridProps {
  comparisonData: any[];
  currentYear: string;
  selectedYear: string;
}

const DetailedComparisonGrid: React.FC<DetailedComparisonGridProps> = ({
  comparisonData,
  currentYear,
  selectedYear
}) => {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-medium text-lg">Detailed Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonData.map((item) => (
          <CategoryComparisonCard
            key={item.category}
            category={item.category}
            currentAmount={item.amount}
            previousAmount={item.previousAmount}
            currentYear={currentYear}
            selectedYear={selectedYear}
          />
        ))}
      </div>
    </div>
  );
};

export default DetailedComparisonGrid;
