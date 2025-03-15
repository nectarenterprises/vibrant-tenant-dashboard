
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  count: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, count, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all border-2 border-border"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="my-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{count} document{count !== 1 ? 's' : ''}</p>
        <div className="flex items-center text-tenant-green mt-2">
          <span className="mr-1">View documents</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
