import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GrowFiLogo from '@/assets/GrowFi.png';
import { ArrowLeft, Play, Eye, Zap } from 'lucide-react';

const DemoLogin = () => {
  const navigate = useNavigate();
  const [isEnteringDemo, setIsEnteringDemo] = useState(false);

  const handleEnterDemo = () => {
    setIsEnteringDemo(true);
    
    // Set demo mode in localStorage
    localStorage.setItem('growfi-demo-mode', 'true');
    
    // Create demo user with verification
    const demoUser = {
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
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('growfi-user', JSON.stringify(demoUser));
    
    // Trigger user data refresh
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Demo Mode</h1>
                <p className="text-primary-foreground/80">Experience GrowFi with sample data</p>
              </div>
            </div>
            <img 
              src={GrowFiLogo} 
              alt="GrowFi logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Information */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  What is Demo Mode?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Demo mode lets you explore GrowFi with pre-populated sample data, 
                  so you can see how the app works with an experienced user's progress.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">150 total points earned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm">1 module completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cta rounded-full"></div>
                    <span className="text-sm">720 credit score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-achievement rounded-full"></div>
                    <span className="text-sm">3 achievements unlocked</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cta" />
                  Demo Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Explore All Modules</h4>
                    <p className="text-sm text-muted-foreground">See how modules unlock and progress tracking works</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-success">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">View Achievements</h4>
                    <p className="text-sm text-muted-foreground">See the achievement system in action</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cta/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cta">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Experience UI/UX</h4>
                    <p className="text-sm text-muted-foreground">Navigate through the complete user interface</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Entry */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-cta/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Enter Demo Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Explore?</h3>
                  <p className="text-muted-foreground text-sm">
                    Click below to enter demo mode and experience GrowFi with sample data.
                    You can always return to the regular app later.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={handleEnterDemo}
                    disabled={isEnteringDemo}
                    className="w-full btn-cta"
                    size="lg"
                  >
                    {isEnteringDemo ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Entering Demo...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Enter Demo Mode
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Regular Login
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">Demo Mode Notice:</h4>
                  <p className="text-xs text-muted-foreground">
                    Demo mode uses sample data and doesn't affect your actual progress. 
                    To start your real financial literacy journey, use the regular login.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoLogin;
