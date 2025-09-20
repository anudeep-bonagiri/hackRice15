// GrowFi Point System - Centralized XP Management
// This utility manages all XP changes, frog evolution, and streak tracking

export type FrogStage = 'Tadpole' | 'Froglet' | 'Young Frog' | 'Wise Frog';

export interface XPConfig {
  stages: {
    [key in FrogStage]: {
      minXP: number;
      maxXP: number;
      displayName: string;
      description: string;
    };
  };
  flashcardRewards: {
    correct: number;
    incorrect: number;
  };
  quizRewards: {
    completionBonus: number;
    correctAnswer: number;
    minimumScoreForBonus: number;
  };
  streakRewards: {
    dailyBonus: number;
    weeklyBonus: number;
    monthlyBonus: number;
  };
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string; // ISO date string
  currentStage: FrogStage;
  xpToNextStage: number;
}

export interface XPAction {
  amount: number;
  reason: string;
  timestamp: string;
  type: 'award' | 'deduct';
}

// Configuration for XP system
export const XP_CONFIG: XPConfig = {
  stages: {
    'Tadpole': {
      minXP: 0,
      maxXP: 49,
      displayName: 'Tadpole',
      description: 'Just starting your financial journey!'
    },
    'Froglet': {
      minXP: 50,
      maxXP: 149,
      displayName: 'Froglet',
      description: 'Growing stronger with each lesson!'
    },
    'Young Frog': {
      minXP: 150,
      maxXP: 299,
      displayName: 'Young Frog',
      description: 'Developing financial wisdom!'
    },
    'Wise Frog': {
      minXP: 300,
      maxXP: Infinity,
      displayName: 'Wise Frog',
      description: 'Master of financial literacy!'
    }
  },
  flashcardRewards: {
    correct: 10,
    incorrect: -2
  },
  quizRewards: {
    completionBonus: 50,
    correctAnswer: 10,
    minimumScoreForBonus: 80
  },
  streakRewards: {
    dailyBonus: 5,
    weeklyBonus: 25,
    monthlyBonus: 100
  }
};

/**
 * Get the current frog stage based on XP
 */
export function getLevel(xp: number): FrogStage {
  const stages = Object.entries(XP_CONFIG.stages) as [FrogStage, typeof XP_CONFIG.stages[FrogStage]][];
  
  for (const [stage, config] of stages) {
    if (xp >= config.minXP && xp <= config.maxXP) {
      return stage;
    }
  }
  
  // Fallback to highest stage if XP exceeds all defined ranges
  return 'Wise Frog';
}

/**
 * Get XP needed to reach the next stage
 */
export function getNextMilestone(xp: number): number {
  const currentStage = getLevel(xp);
  const stages = Object.values(XP_CONFIG.stages);
  const currentStageIndex = stages.findIndex(stage => stage.minXP <= xp && xp <= stage.maxXP);
  
  if (currentStageIndex === -1 || currentStageIndex === stages.length - 1) {
    return 0; // Already at highest stage
  }
  
  const nextStage = stages[currentStageIndex + 1];
  return nextStage.minXP - xp;
}

/**
 * Award XP to user
 */
export function awardXP(amount: number, reason: string): XPAction {
  if (amount <= 0) {
    throw new Error('XP amount must be positive');
  }
  
  return {
    amount,
    reason,
    timestamp: new Date().toISOString(),
    type: 'award'
  };
}

/**
 * Deduct XP from user (with minimum of 0)
 */
export function deductXP(amount: number, reason: string): XPAction {
  if (amount <= 0) {
    throw new Error('Deduction amount must be positive');
  }
  
  return {
    amount: -Math.abs(amount), // Ensure negative
    reason,
    timestamp: new Date().toISOString(),
    type: 'deduct'
  };
}

/**
 * Calculate XP for flashcard answer
 */
export function calculateFlashcardXP(isCorrect: boolean): XPAction {
  if (isCorrect) {
    return awardXP(XP_CONFIG.flashcardRewards.correct, 'Correct flashcard answer');
  } else {
    return deductXP(Math.abs(XP_CONFIG.flashcardRewards.incorrect), 'Incorrect flashcard answer');
  }
}

/**
 * Calculate XP for quiz completion
 */
export function calculateQuizXP(score: number, totalQuestions: number): XPAction[] {
  const actions: XPAction[] = [];
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const percentage = score;
  
  // Award XP for each correct answer
  for (let i = 0; i < correctAnswers; i++) {
    actions.push(awardXP(XP_CONFIG.quizRewards.correctAnswer, 'Correct quiz answer'));
  }
  
  // Award completion bonus if score is high enough
  if (percentage >= XP_CONFIG.quizRewards.minimumScoreForBonus) {
    actions.push(awardXP(XP_CONFIG.quizRewards.completionBonus, 'Quiz completion bonus'));
  }
  
  return actions;
}

/**
 * Calculate streak bonus XP
 */
export function calculateStreakBonus(streak: number): XPAction | null {
  if (streak === 0) return null;
  
  if (streak % 30 === 0) {
    return awardXP(XP_CONFIG.streakRewards.monthlyBonus, 'Monthly streak bonus');
  } else if (streak % 7 === 0) {
    return awardXP(XP_CONFIG.streakRewards.weeklyBonus, 'Weekly streak bonus');
  } else if (streak > 0) {
    return awardXP(XP_CONFIG.streakRewards.dailyBonus, 'Daily streak bonus');
  }
  
  return null;
}

/**
 * Update user progress with new XP
 */
export function updateUserProgress(
  currentProgress: UserProgress,
  actions: XPAction[]
): UserProgress {
  let newXP = currentProgress.xp;
  
  // Apply all XP actions
  for (const action of actions) {
    newXP += action.amount;
  }
  
  // Ensure XP never goes below 0
  newXP = Math.max(0, newXP);
  
  const newStage = getLevel(newXP);
  const xpToNextStage = getNextMilestone(newXP);
  
  return {
    ...currentProgress,
    xp: newXP,
    currentStage: newStage,
    xpToNextStage
  };
}

/**
 * Check if user has crossed a milestone (evolved)
 */
export function hasEvolved(oldStage: FrogStage, newStage: FrogStage): boolean {
  const stageOrder: FrogStage[] = ['Tadpole', 'Froglet', 'Young Frog', 'Wise Frog'];
  const oldIndex = stageOrder.indexOf(oldStage);
  const newIndex = stageOrder.indexOf(newStage);
  
  return newIndex > oldIndex;
}

/**
 * Update streak based on activity
 */
export function updateStreak(currentStreak: number, lastActiveDate: string): number {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = lastActiveDate.split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastActive === today) {
    // Already active today, keep current streak
    return currentStreak;
  } else if (lastActive === yesterdayStr) {
    // Active yesterday, increment streak
    return currentStreak + 1;
  } else {
    // Missed a day, reset streak
    return 1; // Start new streak with today's activity
  }
}

/**
 * Get stage information
 */
export function getStageInfo(stage: FrogStage) {
  return XP_CONFIG.stages[stage];
}

/**
 * Get all stage information for progress display
 */
export function getAllStages(): Array<{ stage: FrogStage; info: typeof XP_CONFIG.stages[FrogStage] }> {
  return Object.entries(XP_CONFIG.stages).map(([stage, info]) => ({
    stage: stage as FrogStage,
    info
  }));
}
