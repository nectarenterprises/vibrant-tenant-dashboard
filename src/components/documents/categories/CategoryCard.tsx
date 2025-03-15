
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  count: number;
  onClick: () => void;
  bgColor?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  icon, 
  count, 
  onClick,
  bgColor = "bg-tenant-green" 
}) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all overflow-hidden border-0"
      onClick={onClick}
    >
      <div className={`${bgColor} p-4 text-white`}>
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      </div>
      <CardContent className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
        <p className="text-muted-foreground">
          {count} document{count !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center text-tenant-green">
          <span className="mr-1">View Details</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
