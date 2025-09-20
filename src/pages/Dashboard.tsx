import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressBar';
import { ScoreCard } from '@/components/ScoreCard';
import { AchievementSystem } from '@/components/AchievementSystem';
import { useUser } from '@/hooks/useUser';
import { BookOpen, Trophy, TrendingUp, Coins, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, error, exitDemoMode, isDemoMode } = useUser();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Show error state only if there's a real error (not handled gracefully)
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading your progress: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Use user data or fallback to zero values for new users
  const userProgress = user ? {
    totalPoints: user.totalPoints,
    completedModules: user.completedModules,
    currentLevel: user.currentLevel,
    creditScore: user.creditScore,
    achievements: user.achievements,
    streak: user.streak
  } : {
    totalPoints: 0,
    completedModules: 0,
    currentLevel: 1,
    creditScore: 0,
    achievements: 0,
    streak: 0
  };

  const microcreditAmount = Math.min(Math.pow(userProgress.totalPoints / 10, 1.8) * 10, 7000);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back to GrowFi!</h1>
              <p className="text-primary-foreground/80 mt-1">Keep growing your financial knowledge</p>
            </div>
            <Mascot 
              level={userProgress.currentLevel} 
              points={userProgress.totalPoints}
              size="lg"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mb-6 rounded-lg bg-gradient-to-r from-cta/10 to-primary/10 border border-cta/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cta/20 rounded-full flex items-center justify-center">
                  <span className="text-cta text-sm">🎮</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Demo Mode Active</h3>
                  <p className="text-sm text-muted-foreground">You're exploring GrowFi with sample data</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exitDemoMode();
                  navigate('/login');
                }}
                className="border-cta/30 text-cta hover:bg-cta/10"
              >
                Exit Demo
              </Button>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Growth Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScoreCard
              type="progress"
              value={`${userProgress.totalPoints}/600`}
              label="Total Points"
              subtitle={userProgress.totalPoints >= 400 ? "Graduation Ready!" : `${400 - userProgress.totalPoints} points to graduate`}
              trend={userProgress.totalPoints >= 400 ? 'up' : 'neutral'}
            />
            <ScoreCard
              type="credit"
              value={userProgress.creditScore}
              label="Credit Score"
              subtitle="+15 this month"
              trend="up"
            />
            <ScoreCard
              type="microcredit"
              value={`$${Math.round(microcreditAmount)}`}
              label="Microcredit Eligible"
              subtitle="Based on your knowledge"
              trend="up"
            />
            <ScoreCard
              type="achievements"
              value={userProgress.achievements}
              label="Achievements"
              subtitle={`${userProgress.streak} day streak`}
              trend="up"
            />
          </div>
        </section>

        {/* Main Progress Card */}
        <section className="mb-8">
          <Card className="bg-gradient-growth text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                Your Financial Mastery Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                current={userProgress.totalPoints}
                max={600}
                label="Overall Progress"
                variant="success"
                size="lg"
              />
              <div className="flex justify-between items-center text-sm">
                <span>Modules Completed: {userProgress.completedModules}/6</span>
                <span>
                  {userProgress.totalPoints >= 400 
                    ? "🎓 Ready to Graduate!" 
                    : "🚀 Keep Learning!"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Continue Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-lift bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Pick up where you left off in your financial education.
                </p>
                <Button 
                  onClick={() => navigate('/modules')}
                  className="w-full btn-primary"
                >
                  View Modules
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Check Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Monitor your credit score and get improvement tips.
                </p>
                <Button 
                  className="w-full bg-success hover:bg-success/90 text-success-foreground"
                >
                  View Credit Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-cta" />
                  Microcredit Portal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access loans based on your financial knowledge.
                </p>
                <Button 
                  className="w-full btn-cta"
                  disabled={userProgress.totalPoints < 100}
                >
                  {userProgress.totalPoints < 100 ? 'Earn 100+ Points' : 'Apply for Credit'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Achievement System */}
        {user && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Achievements</h2>
            <AchievementSystem 
              user={user} 
              onAchievementUnlocked={(achievement) => {
                console.log('Achievement unlocked:', achievement.title);
                // Could add toast notification here
              }} 
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;