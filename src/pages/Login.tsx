import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mascot } from '@/components/Mascot';
import { ArrowLeft, LogIn, UserPlus, Shield, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simple login handlers
  const handleLogin = () => {
    // For demo purposes, navigate directly to dashboard
    navigate('/dashboard');
  };

  const handleSignup = () => {
    // For demo purposes, navigate directly to dashboard
    navigate('/dashboard');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Email/password login logic would go here
    // For demo purposes, navigate directly to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-3">
              <Mascot level={1} points={0} size="md" />
              <h1 className="text-2xl font-bold">GrowFi</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mascot level={1} points={0} size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? 'Welcome Back!' : 'Join GrowFi'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Continue your financial literacy journey' 
              : 'Start your path to financial mastery'
            }
          </p>
        </div>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quick Login Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={isLogin ? handleLogin : handleSignup}
                className="w-full btn-primary text-lg py-3"
                size="lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                {isLogin ? 'Quick Sign In' : 'Quick Sign Up'}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full btn-cta" size="lg">
                {isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="p-0 ml-1 text-primary hover:text-primary-dark"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </div>

            {/* Demo Login for Testing */}
            <div className="border-t pt-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Demo Login (Skip Authentication)
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                For testing purposes only
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Preview */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold text-foreground mb-4">What you'll get:</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
            <div>✓ Personalized financial learning journey</div>
            <div>✓ Gamified progress tracking</div>
            <div>✓ Real credit score improvement</div>
            <div>✓ Up to $7,000 microcredit eligibility</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;