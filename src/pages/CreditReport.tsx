import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/hooks/useUser';
import { ArrowLeft, FileText, CheckCircle, Clock, Target, DollarSign, Award, Loader2 } from 'lucide-react';

const CreditReport = () => {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your credit report...</p>
        </div>
      </div>
    );
  }

  // Show error state only if there's a real error (not handled gracefully)
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading your credit report: {error}</p>
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
    moduleProgress: user.moduleProgress
  } : {
    totalPoints: 0,
    completedModules: 0,
    currentLevel: 1,
    creditScore: 0,
    moduleProgress: {
      1: 0, // Budget Boss
      2: 0, // Debt Destroyer
      3: 0, // Emergency Fund Fortress
      4: 0, // Investment Explorer
      5: 0, // Credit Champion
      6: 0  // Wealth Builder Pro
    }
  };

  const microcreditAmount = Math.min(Math.pow(userProgress.totalPoints / 10, 1.8) * 10, 7000);
  const pointsToMicrocredit = Math.max(100 - userProgress.totalPoints, 0);
  const pointsToGraduation = Math.max(400 - userProgress.totalPoints, 0);

  const modules = [
    {
      id: 1,
      title: "Budget Boss",
      description: "Master budgeting fundamentals, expense tracking, and spending simulations",
      points: userProgress.moduleProgress[1] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[1] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[1] || 0) > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 2,
      title: "Debt Destroyer", 
      description: "Learn about different debt types, payoff strategies, and credit management",
      points: userProgress.moduleProgress[2] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[2] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[2] || 0) > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 3,
      title: "Emergency Fund Fortress",
      description: "Build your financial safety net with smart savings strategies",
      points: userProgress.moduleProgress[3] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[3] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[3] || 0) > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 4,
      title: "Investment Explorer",
      description: "Discover investing basics, portfolio building, and risk management",
      points: userProgress.moduleProgress[4] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[4] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[4] || 0) > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 5,
      title: "Credit Champion",
      description: "Understand credit scores, responsible credit use, and strategic loan planning",
      points: userProgress.moduleProgress[5] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[5] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[5] || 0) > 0 ? 'in-progress' : 'not-started'
    },
    {
      id: 6,
      title: "Wealth Builder Pro",
      description: "Advanced investment strategies, tax planning, and estate basics",
      points: userProgress.moduleProgress[6] || 0,
      maxPoints: 100,
      status: (userProgress.moduleProgress[6] || 0) >= 100 ? 'completed' : (userProgress.moduleProgress[6] || 0) > 0 ? 'in-progress' : 'not-started'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <Target className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

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
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Financial Progress Statement</h1>
              <p className="text-primary-foreground/80 mt-1">
                Your learning journey towards financial independence and credit access
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Invoice Header */}
        <div className="mb-8 p-6 bg-white border border-border rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">GrowFi Financial Education</h2>
              <p className="text-muted-foreground">Progress Statement</p>
              <p className="text-sm text-muted-foreground mt-1">
                Generated on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-semibold text-foreground">GF-{userProgress.currentLevel.toString().padStart(3, '0')}-{userProgress.totalPoints}</p>
              <p className="text-sm text-muted-foreground mt-2">Current Level</p>
              <p className="text-xl font-bold text-primary">Level {userProgress.currentLevel}</p>
            </div>
          </div>

          {/* Bold Summary Section */}
          <div className="bg-gradient-growth rounded-lg p-6 text-primary-foreground mb-6">
            <div className="text-center">
              {pointsToMicrocredit === 0 ? (
                <div>
                  <h3 className="text-2xl font-bold mb-2">🎉 Congratulations!</h3>
                  <p className="text-lg mb-4">You're eligible for microcredit access!</p>
                  <p className="text-sm opacity-90">
                    {pointsToGraduation === 0 
                      ? "🎓 You've graduated! Full access to all financial services unlocked."
                      : `${pointsToGraduation} points to graduation`
                    }
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold mb-2">Keep Growing!</h3>
                  <p className="text-lg mb-4">
                    You are <span className="font-bold">{pointsToMicrocredit} points away</span> from microcredit eligibility
                  </p>
                  <p className="text-sm opacity-90">
                    {pointsToGraduation > 0 && `${pointsToGraduation} points to graduation`}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <ProgressBar
                current={userProgress.totalPoints}
                max={600}
                label="Overall Financial Literacy Progress"
                variant="success"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Learning Modules - Detailed Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Points Earned</TableHead>
                  <TableHead className="text-right">Max Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">
                      {module.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {module.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(module.status)}
                        <span className="text-sm">{getStatusText(module.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {module.points}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {module.maxPoints}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 border-border font-semibold">
                  <TableCell colSpan={3} className="font-bold">
                    Total Progress
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {userProgress.totalPoints}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    600
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Microcredit Estimate Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cta" />
                Microcredit Eligibility Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cta mb-2">
                  ${Math.round(microcreditAmount).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your {userProgress.totalPoints} learning points
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Credit Score</span>
                  <span className="font-medium">{userProgress.creditScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Learning Level</span>
                  <span className="font-medium">Level {userProgress.currentLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{Math.round((userProgress.totalPoints / 600) * 100)}%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Eligibility calculated based on financial literacy progress, credit behavior simulation, and learning completion rates.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Next Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {userProgress.totalPoints < 100 && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Microcredit Access</p>
                      <p className="text-xs text-muted-foreground">Unlock loan eligibility</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {100 - userProgress.totalPoints} points
                      </p>
                    </div>
                  </div>
                )}
                
                {userProgress.totalPoints < 400 && (
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Graduation</p>
                      <p className="text-xs text-muted-foreground">Complete financial literacy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">
                        {400 - userProgress.totalPoints} points
                      </p>
                    </div>
                  </div>
                )}

                {userProgress.totalPoints >= 400 && (
                  <div className="flex items-center justify-between p-3 bg-achievement/10 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">🎓 Graduate Status</p>
                      <p className="text-xs text-muted-foreground">Full access unlocked</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-achievement">
                        Achieved!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={() => navigate('/modules')}
                  className="w-full btn-primary"
                >
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Footer */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>Financial Progress Statement</span>
              </div>
              
              <div className="text-xs text-muted-foreground max-w-2xl mx-auto space-y-2">
                <p>
                  <strong>Important Notice:</strong> This statement represents your financial learning progress within the GrowFi educational platform. 
                  GrowFi points are earned through completing financial literacy modules and demonstrate your commitment to financial education.
                </p>
                <p>
                  <strong>Credit Access:</strong> Microcredit eligibility is based on learning progress, simulated financial behaviors, and completion rates. 
                  Actual credit decisions are subject to additional verification and lending criteria.
                </p>
                <p>
                  <strong>Graduation Benefits:</strong> Upon reaching 400+ points, you unlock access to advanced financial tools, 
                  higher credit limits, and exclusive financial services designed for financially literate individuals.
                </p>
                <p>
                  <strong>Disclaimer:</strong> This is an educational simulation. Actual financial products and services may have different terms and requirements. 
                  Always consult with qualified financial professionals for personalized advice.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Generated by GrowFi Financial Education Platform • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreditReport;
