import { useState, useEffect } from 'react';
import GrowFiLogo from '@/assets/GrowFi.png';
import tadpoleMascot from '@/assets/tadpole-mascot.png';
import frogMascot from '@/assets/frog-mascot.png';

interface MascotProps {
  level: number;
  points: number;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  useLogo?: boolean; // New prop to use GrowFi logo instead of mascot
}

export const Mascot = ({ level, points, isAnimating = false, size = 'md', useLogo = false }: MascotProps) => {
  const [showEvolution, setShowEvolution] = useState(false);
  
  // If useLogo is true, always use GrowFi logo without animations
  if (useLogo) {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-20 h-20',
      lg: 'w-32 h-32'
    };

    return (
      <div className="relative flex items-center justify-center">
        <img
          src={GrowFiLogo}
          alt="GrowFi Logo"
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
    );
  }
  
  // Mascot evolves at different thresholds
  const isEvolved = points >= 300; // Halfway to graduation
  const mascotImage = isEvolved ? frogMascot : tadpoleMascot;
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  useEffect(() => {
    if (isAnimating) {
      setShowEvolution(true);
      const timer = setTimeout(() => setShowEvolution(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="relative flex items-center justify-center">
      <img
        src={mascotImage}
        alt={isEvolved ? "GrowFi Frog Mascot" : "GrowFi Tadpole Mascot"}
        className={`
          ${sizeClasses[size]} 
          object-contain
          ${isAnimating ? 'animate-mascot-grow' : 'mascot-bounce'}
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