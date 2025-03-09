
import React from 'react';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  delay?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, delay = 0 }) => {
  const { name, address, rentalFee, nextPaymentDate, leaseExpiry } = property;
  
  // Format dates
  const formattedNextPayment = format(parseISO(nextPaymentDate), 'dd MMM yyyy');
  const formattedLeaseExpiry = format(parseISO(leaseExpiry), 'dd MMM yyyy');
  
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden card-gradient shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in",
        "border border-gray-100 dark:border-gray-800"
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="h-40 mellow-gradient relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white font-bold text-xl">{name}</h3>
          <p className="text-white/90 text-sm">{address}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Monthly Rent</span>
          <span className="font-semibold text-lg">${rentalFee.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-tenant-gold" />
            <span className="text-muted-foreground">Next Payment:</span>
            <span className="font-medium">{formattedNextPayment}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-tenant-orange" />
            <span className="text-muted-foreground">Lease Expiry:</span>
            <span className="font-medium">{formattedLeaseExpiry}</span>
          </div>
        </div>
        
        <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-lg bg-tenant-yellow text-black hover:bg-tenant-gold transition-colors">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
