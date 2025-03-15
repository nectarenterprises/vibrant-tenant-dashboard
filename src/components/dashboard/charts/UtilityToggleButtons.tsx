
import React from 'react';
import { Zap, Droplets, Flame } from 'lucide-react';

interface UtilityToggleButtonsProps {
  activeUtilities: {
    gas: boolean;
    water: boolean;
    electricity: boolean;
  };
  toggleUtility: (utility: 'gas' | 'water' | 'electricity') => void;
}

const UtilityToggleButtons: React.FC<UtilityToggleButtonsProps> = ({ 
  activeUtilities, 
  toggleUtility 
}) => {
  const utilityClasses = {
    gas: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.gas 
          ? 'bg-tenant-orange/10 border-tenant-orange/30 text-tenant-orange' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Flame className="h-4 w-4" />
    },
    water: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.water 
          ? 'bg-tenant-teal/10 border-tenant-teal/30 text-tenant-teal' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Droplets className="h-4 w-4" />
    },
    electricity: {
      button: `px-3 py-1.5 rounded-lg flex items-center gap-1.5 border text-sm transition-all ${
        activeUtilities.electricity 
          ? 'bg-tenant-purple/10 border-tenant-purple/30 text-tenant-purple' 
          : 'bg-gray-100 border-gray-200 text-gray-500'
      }`,
      icon: <Zap className="h-4 w-4" />
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        className={utilityClasses.gas.button}
        onClick={() => toggleUtility('gas')}
      >
        {utilityClasses.gas.icon}
        <span>Gas</span>
      </button>
      <button 
        className={utilityClasses.water.button}
        onClick={() => toggleUtility('water')}
      >
        {utilityClasses.water.icon}
        <span>Water</span>
      </button>
      <button 
        className={utilityClasses.electricity.button}
        onClick={() => toggleUtility('electricity')}
      >
        {utilityClasses.electricity.icon}
        <span>Electricity</span>
      </button>
    </div>
  );
};

export default UtilityToggleButtons;
