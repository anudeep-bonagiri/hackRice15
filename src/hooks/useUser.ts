import { useState, useEffect } from 'react';

interface UserProgress {
  id: string;
  username: string;
  name: string;
  email: string;
  totalPoints: number;
  completedModules: number;
  currentLevel: number;
  creditScore: number;
  achievements: number;
  streak: number;
  moduleProgress: Record<number, number>;
  preferences: {
    notifications: boolean;
    theme: string;
  };
  createdAt: string;
}

interface UseUserReturn {
  user: UserProgress | null;
  loading: boolean;
  error: string | null;
  updateProgress: (progress: Partial<UserProgress>) => void;
  refreshUser: () => void;
  exitDemoMode: () => void;
  isDemoMode: boolean;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize user with default values
  useEffect(() => {
    const initializeUser = () => {
      setLoading(true);
      
      // Check if we're in demo mode
      const demoMode = localStorage.getItem('growfi-demo-mode') === 'true';
      setIsDemoMode(demoMode);
      
      if (demoMode) {
        createDemoUser();
      } else {
        // Get user data from localStorage or create default
        const savedUser = localStorage.getItem('growfi-user');
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch (err) {
            console.error('Error parsing saved user data:', err);
            createDefaultUser();
          }
        } else {
          createDefaultUser();
        }
      }
      
      setLoading(false);
    };

    const createDefaultUser = () => {
      const defaultUser: UserProgress = {
        id: 'local-user',
        username: 'local',
        name: 'New User',
        email: '',
        totalPoints: 0,
        completedModules: 0,
        currentLevel: 1,
        creditScore: 0,
        achievements: 0,
        streak: 0,
        moduleProgress: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
        },
        preferences: {
          notifications: true,
          theme: 'light'
        },
        createdAt: new Date().toISOString()
      };
      
      setUser(defaultUser);
      localStorage.setItem('growfi-user', JSON.stringify(defaultUser));
    };

    const createDemoUser = () => {
      const demoUser: UserProgress = {
        id: 'demo-user',
        username: 'demo',
        name: 'Demo User',
        email: 'demo@growfi.com',
        totalPoints: 150,
        completedModules: 1,
        currentLevel: 2,
        creditScore: 720,
        achievements: 3,
        streak: 5,
        moduleProgress: {
          1: 100, // Budget Boss - completed
          2: 50,  // Debt Destroyer - in progress
          3: 0,   // Emergency Fund Fortress
          4: 0,   // Investment Explorer
          5: 0,   // Credit Champion
          6: 0    // Wealth Builder Pro
        },
        preferences: {
          notifications: true,
          theme: 'light'
        },
        createdAt: new Date().toISOString()
      };
      
      setUser(demoUser);
      localStorage.setItem('growfi-user', JSON.stringify(demoUser));
    };

    initializeUser();
  }, []);

  const updateProgress = (progress: Partial<UserProgress>) => {
    if (!user) return;

    const updatedUser = { ...user, ...progress };
    setUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem('growfi-user', JSON.stringify(updatedUser));
    
    console.log('Progress updated locally:', progress);
  };

  const refreshUser = () => {
    // For local-only mode, just reload from localStorage
    const savedUser = localStorage.getItem('growfi-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error refreshing user data:', err);
      }
    }
  };

  const exitDemoMode = () => {
    // Clear demo mode flag and user data
    localStorage.removeItem('growfi-demo-mode');
    localStorage.removeItem('growfi-user');
    setIsDemoMode(false);
    
    // Create a new default user
    const defaultUser: UserProgress = {
      id: 'local-user',
      username: 'local',
      name: 'New User',
      email: '',
      totalPoints: 0,
      completedModules: 0,
      currentLevel: 1,
      creditScore: 0,
      achievements: 0,
      streak: 0,
      moduleProgress: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
      },
      preferences: {
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date().toISOString()
    };
    
    setUser(defaultUser);
    localStorage.setItem('growfi-user', JSON.stringify(defaultUser));
  };

  return {
    user,
    loading,
    error,
    updateProgress,
    refreshUser,
    exitDemoMode,
    isDemoMode,
  };
};
