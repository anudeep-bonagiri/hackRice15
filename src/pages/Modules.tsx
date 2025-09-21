import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/ModuleCard';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { ArrowLeft, Calculator, Shield, PiggyBank, TrendingUp, CreditCard, Crown, Loader2 } from 'lucide-react';

const Modules = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your modules...</p>
        </div>
      </div>
    );
  }

  // Show error state only if there's a real error (not handled gracefully)
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading your modules: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Use user data or fallback to zero values for new users
  const userProgress = user ? {
    totalPoints: user.totalPoints,
    moduleProgress: user.moduleProgress
  } : {
    totalPoints: 0,
    moduleProgress: {
      1: 0, // Budget Boss
      2: 0, // Debt Destroyer
      3: 0, // Emergency Fund Fortress
      4: 0, // Investment Explorer
      5: 0, // Credit Champion
      6: 0  // Wealth Builder Pro
    }
  };

  const modules = [
    {
      id: 1,
      title: "Budget Boss",
      description: "Master budgeting fundamentals, expense tracking, and spending simulations to take control of your finances.",
      icon: <Calculator className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: true
    },
    {
      id: 2,
      title: "Debt Destroyer",
      description: "Learn about different debt types, payoff strategies, and credit management to eliminate debt effectively.",
      icon: <Shield className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: userProgress.moduleProgress[1] >= 100
    },
    {
      id: 3,
      title: "Emergency Fund Fortress",
      description: "Build your financial safety net with smart savings strategies and emergency scenario planning.",
      icon: <PiggyBank className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: userProgress.moduleProgress[2] >= 100
    },
    {
      id: 4,
      title: "Investment Explorer",
      description: "Discover investing basics, portfolio building, and risk management for long-term wealth growth.",
      icon: <TrendingUp className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: userProgress.moduleProgress[3] >= 100
    },
    {
      id: 5,
      title: "Credit Champion",
      description: "Understand credit scores, responsible credit use, and strategic loan planning for financial success.",
      icon: <CreditCard className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: userProgress.moduleProgress[4] >= 100
    },
    {
      id: 6,
      title: "Wealth Builder Pro",
      description: "Advanced investment strategies, tax planning, and estate basics for comprehensive wealth building.",
      icon: <Crown className="w-5 h-5" />,
      maxPoints: 100,
      isUnlocked: userProgress.moduleProgress[5] >= 100
    }
  ];

  const handleStartModule = (moduleId: number) => {
    navigate(`/module/${moduleId}`);
  };

  const completedCount = Object.values(userProgress.moduleProgress).filter(points => points >= 100).length;
  const totalPoints = Object.values(userProgress.moduleProgress).reduce((sum, points) => sum + points, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Financial Literacy Modules</h1>
            <p className="text-primary-foreground/80 mt-2">
              Complete all 6 modules to graduate and unlock full microcredit access
            </p>
            <div className="mt-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {completedCount}/6 Modules Complete • {totalPoints}/600 Points
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <section className="mb-8">
          <div className="bg-gradient-card rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Your Learning Path</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cta">
                  ${Math.min(Math.round(Math.pow(totalPoints / 10, 1.8) * 10), 7000)}
                </div>
                <div className="text-sm text-muted-foreground">Microcredit Eligible</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-achievement">
                  {totalPoints >= 400 ? "🎓" : "📚"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalPoints >= 400 ? "Graduate!" : "In Progress"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your Next Module</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                points={userProgress.moduleProgress[module.id as keyof typeof userProgress.moduleProgress] || 0}
                maxPoints={module.maxPoints}
                isUnlocked={module.isUnlocked}
                isCompleted={(userProgress.moduleProgress[module.id as keyof typeof userProgress.moduleProgress] || 0) >= 100}
                icon={module.icon}
                onStart={() => handleStartModule(module.id)}
              />
            ))}
          </div>
        </section>

        {/* Graduation Status */}
        {totalPoints >= 400 && (
          <section className="mt-8">
            <div className="bg-gradient-success rounded-lg p-6 text-center text-success-foreground">
              <h2 className="text-2xl font-bold mb-2">🎓 Congratulations!</h2>
              <p className="mb-4">You're ready to graduate! You've earned {totalPoints} points and mastered financial literacy.</p>
              <Button 
                size="lg"
                className="bg-white text-success hover:bg-white/90"
              >
                Claim Your Certificate
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Modules;