
import React from 'react';

interface BackButtonProps {
  onBack: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onBack, 
  label = "Back to utilities overview" 
}) => {
  return (
    <button 
      onClick={onBack}
      className="text-sm flex items-center gap-1 text-tenant-green hover:text-tenant-darkGreen transition-colors"
    >
      ← {label}
    </button>
  );
};

export default BackButton;
