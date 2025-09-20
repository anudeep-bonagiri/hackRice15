import { useState, useEffect } from 'react';
import growFiLogo from '@/assets/GrowFi.png';
import frogMascot from '@/assets/frog-mascot.png';
import { getLevel, FrogStage } from '@/lib/points';

interface MascotProps {
  xp: number;
  previousXP?: number;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onEvolution?: (newStage: FrogStage) => void;
}

export const Mascot = ({ 
  xp, 
  previousXP = 0, 
  isAnimating = false, 
  size = 'md',
  onEvolution 
}: MascotProps) => {
  const [showEvolution, setShowEvolution] = useState(false);
  
  // Get current stage based on XP
  const currentStage = getLevel(xp);
  const previousStage = previousXP > 0 ? getLevel(previousXP) : 'Tadpole';
  
  // Determine which image to show based on stage
  const getMascotImage = (stage: FrogStage) => {
    switch (stage) {
      case 'Tadpole':
        return growFiLogo;
      case 'Froglet':
      case 'Young Frog':
      case 'Wise Frog':
        return frogMascot;
      default:
        return growFiLogo;
    }
  };
  
  const mascotImage = getMascotImage(currentStage);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40'
  };

  // Check if user has evolved to a new stage
  const hasEvolved = currentStage !== previousStage && previousXP > 0;

  useEffect(() => {
    if (isAnimating || hasEvolved) {
      setShowEvolution(true);
      if (hasEvolved && onEvolution) {
        onEvolution(currentStage);
      }
      const timer = setTimeout(() => setShowEvolution(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, hasEvolved, currentStage, onEvolution]);

  return (
    <div className="relative flex items-center justify-center">
      <img
        src={mascotImage}
        alt={`GrowFi ${currentStage} Mascot`}
        className={`
          ${sizeClasses[size]} 
          object-contain
          ${isAnimating ? 'animate-mascot-grow' : ''}
          ${showEvolution ? 'achievement-glow' : ''}
          transition-all duration-300
        `}
      />
      {showEvolution && (
        <div className="absolute -top-4 -right-4 bg-achievement text-achievement-foreground rounded-full px-2 py-1 text-xs font-bold animate-achievement-pulse">
          Level Up!
        </div>
      )}
    </div>
  );
};