
import React from 'react';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  delay?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, delay = 0 }) => {
  const { name, address, rentalFee, nextPaymentDate, leaseExpiry, serviceChargeAmount } = property;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Format dates
  const formattedNextPayment = format(parseISO(nextPaymentDate), 'dd MMM yyyy');
  const formattedLeaseExpiry = format(parseISO(leaseExpiry), 'dd MMM yyyy');

  // Determine which page we're on
  const isServiceChargePage = location.pathname.includes('service-charge');
  const isCompliancePage = location.pathname.includes('compliance');
  const isUtilitiesPage = location.pathname.includes('utilities');
  
  const handleViewDetails = () => {
    // Handle navigation based on current page
    if (isCompliancePage) {
      // Stay on compliance page but show property details
      // This will be handled by the Compliance.tsx page's state
      navigate(`/compliance?propertyId=${property.id}`);
    } else if (isServiceChargePage) {
      navigate(`/service-charge?propertyId=${property.id}`);
    } else if (isUtilitiesPage) {
      navigate(`/utilities?propertyId=${property.id}`);
    } else {
      // Default to leases page for other cases
      navigate(`/leases?propertyId=${property.id}`);
    }
  };
  
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden card-gradient shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in h-full flex flex-col",
        "border border-gray-100 dark:border-gray-800"
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div 
        className="h-40 mellow-gradient relative cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white font-bold text-xl truncate">{name}</h3>
          <p className="text-white/90 text-sm truncate">{address}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4 flex-grow flex flex-col">
        {!isCompliancePage && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {isServiceChargePage ? 'Monthly Service Charge' : isUtilitiesPage ? 'Average Monthly Utility' : 'Monthly Rent'}
              </span>
              <span className="font-semibold text-lg">
                £{isServiceChargePage ? serviceChargeAmount?.toLocaleString() || '0' : 
                   isUtilitiesPage ? calculateAverageUtility(property) :
                   rentalFee.toLocaleString()}
              </span>
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
          </>
        )}
        
        <button 
          className="w-full mt-auto flex items-center justify-center gap-2 py-2 rounded-lg bg-tenant-yellow text-black hover:bg-tenant-gold transition-colors"
          onClick={handleViewDetails}
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Helper function to calculate average utility cost
const calculateAverageUtility = (property: Property): string => {
  if (!property.utilityData || property.utilityData.length === 0) {
    return '0';
  }
  
  let totalCost = 0;
  let count = 0;
  
  property.utilityData.forEach(data => {
    const costs = [
      data.gasCost || 0,
      data.waterCost || 0,
      data.electricityCost || 0
    ];
    
    totalCost += costs.reduce((acc, cost) => acc + cost, 0);
    count += costs.filter(cost => cost > 0).length;
  });
  
  const average = count > 0 ? totalCost / count : 0;
  return average.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

export default PropertyCard;
