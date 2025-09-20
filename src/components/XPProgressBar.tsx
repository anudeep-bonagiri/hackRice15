import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star, Crown } from 'lucide-react';
import { FrogStage, getLevel, getNextMilestone, getStageInfo, hasEvolved } from '@/lib/points';

interface XPProgressBarProps {
  currentXP: number;
  previousXP?: number;
  streak?: number;
  size?: 'sm' | 'md' | 'lg';
  showStreak?: boolean;
  onEvolution?: (newStage: FrogStage) => void;
  className?: string;
}

const stageIcons = {
  'Tadpole': '🐸',
  'Froglet': '🐸',
  'Young Frog': '🐸',
  'Wise Frog': '👑'
};

const stageColors = {
  'Tadpole': 'bg-green-500',
  'Froglet': 'bg-blue-500',
  'Young Frog': 'bg-purple-500',
  'Wise Frog': 'bg-yellow-500'
};

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  previousXP = 0,
  streak = 0,
  size = 'md',
  showStreak = true,
  onEvolution,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [evolvedStage, setEvolvedStage] = useState<FrogStage | null>(null);

  const currentStage = getLevel(currentXP);
  const previousStage = previousXP > 0 ? getLevel(previousXP) : 'Tadpole';
  const xpToNext = getNextMilestone(currentXP);
  const stageInfo = getStageInfo(currentStage);
  
  // Check if user has evolved
  const hasEvolvedStage = hasEvolved(previousStage, currentStage);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-16',
      progress: 'h-2',
      text: 'text-xs',
      icon: 'w-6 h-6',
      badge: 'text-xs px-2 py-1'
    },
    md: {
      container: 'h-20',
      progress: 'h-3',
      text: 'text-sm',
      icon: 'w-8 h-8',
      badge: 'text-sm px-3 py-1'
    },
    lg: {
      container: 'h-24',
      progress: 'h-4',
      text: 'text-base',
      icon: 'w-10 h-10',
      badge: 'text-base px-4 py-2'
    }
  };

  const config = sizeConfig[size];

  // Calculate progress percentage for current stage
  const getProgressPercentage = () => {
    if (xpToNext === 0) return 100; // At max stage
    
    const stageStartXP = stageInfo.minXP;
    const stageEndXP = stageInfo.maxXP === Infinity ? currentXP + xpToNext : stageInfo.maxXP;
    const stageTotalXP = stageEndXP - stageStartXP;
    const currentStageXP = currentXP - stageStartXP;
    
    return Math.min(100, Math.max(0, (currentStageXP / stageTotalXP) * 100));
  };

  // Handle evolution animation
  useEffect(() => {
    if (hasEvolvedStage && onEvolution) {
      setEvolvedStage(currentStage);
      setShowCelebration(true);
      setIsAnimating(true);
      onEvolution(currentStage);
      
      // Hide celebration after animation
      setTimeout(() => {
        setShowCelebration(false);
        setIsAnimating(false);
        setEvolvedStage(null);
      }, 3000);
    }
  }, [hasEvolvedStage, currentStage, onEvolution]);

  return (
    <div className={`relative ${config.container} ${className}`}>
      {/* Main progress container */}
      <div className="flex items-center gap-3 h-full">
        {/* Frog stage icon */}
        <motion.div
          className={`${config.icon} flex items-center justify-center text-2xl`}
          animate={isAnimating ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {stageIcons[currentStage]}
        </motion.div>

        {/* Progress section */}
        <div className="flex-1 space-y-1">
          {/* Stage name and XP */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${config.text} text-foreground`}>
                {stageInfo.displayName}
              </span>
              <Badge 
                variant="secondary" 
                className={`${config.badge} ${stageColors[currentStage]} text-white`}
              >
                {currentXP} XP
              </Badge>
            </div>
            
            {xpToNext > 0 && (
              <span className={`${config.text} text-muted-foreground`}>
                {xpToNext} to next stage
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative">
            <Progress 
              value={getProgressPercentage()} 
              className={`${config.progress} transition-all duration-500`}
            />
            
            {/* Animated progress fill */}
            <motion.div
              className={`absolute top-0 left-0 ${config.progress} ${stageColors[currentStage]} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Streak indicator */}
        {showStreak && streak > 0 && (
          <motion.div
            className="flex items-center gap-1"
            animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className={`${config.text} font-semibold text-yellow-600`}>
              {streak}
            </span>
          </motion.div>
        )}
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti effect */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Evolution message */}
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">Level Up! {evolvedStage}</span>
                <Crown className="w-5 h-5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPProgressBar;
