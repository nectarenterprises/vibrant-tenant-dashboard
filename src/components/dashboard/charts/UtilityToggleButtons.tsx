
import React from 'react';

interface UtilityToggleButtonsProps {
  activeUtilities: {
    gas: boolean;
    water: boolean;
    electricity: boolean;
  };
  toggleUtility: (utility: keyof typeof activeUtilities) => void;
}

const UtilityToggleButtons: React.FC<UtilityToggleButtonsProps> = ({ 
  activeUtilities, 
  toggleUtility 
}) => {
  return (
    <div className="flex gap-2">
      <button 
        className={`px-3 py-1 rounded-full text-sm ${activeUtilities.electricity ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleUtility('electricity')}
      >
        Electricity
      </button>
      <button 
        className={`px-3 py-1 rounded-full text-sm ${activeUtilities.water ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleUtility('water')}
      >
        Water
      </button>
      <button 
        className={`px-3 py-1 rounded-full text-sm ${activeUtilities.gas ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}
        onClick={() => toggleUtility('gas')}
      >
        Gas
      </button>
    </div>
  );
};

export default UtilityToggleButtons;
