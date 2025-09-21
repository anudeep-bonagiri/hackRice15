import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GrowFiLogo from '@/assets/GrowFi.png';
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

  const qaItems = [
    {
      question: "If I want to buy a house, how can I progress from this to owning a house?",
      answer:
        "Continue through this course to build your credit, understand budgeting, and save for a down payment. In real life, start by checking your credit score, researching mortgage options, and comparing banks for the best rates. Once ready, get pre-approved, find a trusted real estate agent, and make sure to budget for closing costs and ongoing expenses.",
    },
    {
      question: "How do I start investing for the first time?",
      answer:
        "Learn the basics in GrowFi, then open a brokerage account with a reputable provider. Start with index funds or ETFs, invest regularly, and avoid trying to time the market. Always research fees and consider speaking with a financial advisor for personalized advice.",
    },
    {
      question: "What steps should I take to pay off debt efficiently?",
      answer:
        "Use GrowFi to understand debt payoff strategies like the snowball or avalanche method. List your debts, prioritize high-interest ones, and automate payments if possible. Consider consolidating if it lowers your interest rate, and avoid taking on new debt while paying off existing balances.",
    },
        {
      question: "How can I build credit if I’ve never had a loan or credit card before?",
      answer:
        "Start by completing GrowFi’s modules to learn the basics of credit. In real life, you can apply for a secured credit card, use it responsibly, and pay it off on time. Over time, your responsible usage will help establish your credit history and raise your credit score.",
    },
    {
      question: "What steps should I follow to get a small loan for my business?",
      answer:
        "Complete GrowFi lessons to understand borrowing and repayment. Build points to unlock microcredit eligibility, then apply through the Microcredit Portal. In practice, prepare a simple budget for your business, show how you’ll repay, and start with a small loan to demonstrate reliability.",
    },
    {
      question: "How can I save money to eventually move into my own apartment?",
      answer:
        "Use GrowFi to practice budgeting and track expenses. Aim to save a small portion of your income regularly. In real life, open a savings account, set an automatic transfer each payday, and build a history of consistent savings. Over time, this helps with both deposits and demonstrating financial responsibility to landlords or banks.",
    },
        {
      question: "After I finish GrowFi, how do I know which bank to pick?",
      answer:
        "Once you complete GrowFi and build your credit, look for banks or credit unions that offer low fees, fair interest rates, and beginner-friendly accounts. Compare options online, check for hidden charges, and see if they report to credit bureaus to help you continue growing your credit. Local credit unions can be a great choice for lower-income individuals starting out.",
    },
    {
  question: "What’s the best way to prepare for financial emergencies?",
  answer:
    "Use GrowFi to learn budgeting and set aside a small amount each month. In real life, start with an emergency fund of $500–$1,000 in a savings account. Over time, aim for 3–6 months of expenses. Having this cushion can keep you from falling into debt when unexpected costs come up.",
  },
  {
  question: "How can I use credit cards without getting into trouble?",
  answer:
    "GrowFi helps you understand responsible credit use. In practice, always pay your balance in full if possible, keep your usage under 30% of your limit, and avoid late payments. Used wisely, credit cards can build your score and give you rewards without leading to debt.",
  },
  {
  question: "When should I start saving for retirement?",
  answer:
    "It’s never too early to start. After completing GrowFi’s modules on budgeting and saving, consider opening an IRA or contributing to a workplace retirement plan. Even small amounts invested early can grow significantly thanks to compound interest.",
},
{
  question: "How do I know if a loan offer is fair?",
  answer:
    "GrowFi can teach you how to compare interest rates and fees. In real life, look at the APR, not just the monthly payment. Be cautious of hidden fees, very high rates, or lenders that don’t explain terms clearly. If in doubt, compare at least 2–3 offers before signing.",
},
  
  ];

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
              value={`${userProgress.totalPoints}/675`}
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
                max={675}
                label="Overall Progress"
                variant="cyan"
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
                  onClick={() => navigate('/credit-report')}
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

        {/* Q/A Section - Real Life Financial Questions */}
        <section className="mt-16 mb-8 mx-auto max-w-3xl px-4 py-10 bg-white rounded-3xl shadow-soft border border-ink/10">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark/70">Transition Q/A</p>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">Going from entry level to real life</h2>
          </div>
          <div className="grid gap-6">
            {qaItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-ink/10 bg-surface-soft p-6 shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-lg font-semibold text-ink">{item.question}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-brand-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;