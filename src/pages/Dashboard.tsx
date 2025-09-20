import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { ProgressBar } from '@/components/ProgressBar';
import { ScoreCard } from '@/components/ScoreCard';
import { XPProgressBar } from '@/components/XPProgressBar';
import { BookOpen, Trophy, TrendingUp, Coins } from 'lucide-react';
import { UserProgress, FrogStage } from '@/lib/points';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 150,
    streak: 5,
    lastActiveDate: new Date().toISOString(),
    currentStage: 'Froglet',
    xpToNextStage: 100
  });
  const [previousXP, setPreviousXP] = useState(0);
  
  // Additional dashboard data
  const [dashboardData] = useState({
    completedModules: 1,
    creditScore: 720,
    achievements: 3
  });

  const microcreditAmount = Math.min(Math.pow(userProgress.xp / 10, 1.8) * 10, 7000);

  const handleEvolution = (newStage: FrogStage) => {
    console.log(`Frog evolved to: ${newStage}`);
    // Here you could trigger additional animations or notifications
  };

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
              xp={userProgress.xp}
              previousXP={previousXP}
              size="lg"
              onEvolution={handleEvolution}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Recent Achievements */}
        {userProgress.achievements > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="achievement-glow bg-achievement/10 border-achievement/30">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-achievement mx-auto mb-2" />
                  <h3 className="font-semibold text-achievement">First Module Complete!</h3>
                  <p className="text-sm text-muted-foreground">Budget Boss mastery achieved</p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;