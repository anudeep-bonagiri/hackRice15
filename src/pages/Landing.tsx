import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mascot } from '@/components/Mascot';
import { BookOpen, Trophy, TrendingUp, Target, ArrowRight, Star, Users, Award } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "6 Core Modules",
      description: "Master budgeting, debt management, investing, and wealth building through interactive lessons."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gamified Learning",
      description: "Earn points, unlock achievements, and watch your mascot evolve from tadpole to financial guru."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Real Credit Impact",
      description: "Your learning directly affects your credit score and unlocks microcredit opportunities."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Journey",
      description: "AI-powered assistance adapts to your learning style and financial goals."
    }
  ];

  const stats = [
    { number: "600", label: "Total Points Available", icon: <Star className="w-5 h-5" /> },
    { number: "6", label: "Financial Modules", icon: <BookOpen className="w-5 h-5" /> },
    { number: "$7K", label: "Max Microcredit", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "24/7", label: "AI Support", icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-primary-foreground py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Mascot level={1} points={0} size="lg" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-gradient-primary">GrowFi</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Transform your financial future through gamified learning. Earn points, grow your knowledge, 
            and unlock real microcredit opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="btn-cta text-lg px-8 py-4"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-primary-foreground/70">
            🎓 Graduate with 400+ points • 💰 Unlock up to $7,000 microcredit
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2 text-primary">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose GrowFi?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make financial education engaging, practical, and rewarding through innovative gamification.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-growth text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-primary-foreground/90">
              Your path to financial mastery in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Learn & Earn</h3>
              <p className="text-primary-foreground/80">
                Complete interactive modules and earn points for correct answers and engagement.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Grow & Progress</h3>
              <p className="text-primary-foreground/80">
                Watch your mascot evolve and unlock new modules as your knowledge grows.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Graduate & Thrive</h3>
              <p className="text-primary-foreground/80">
                Graduate with 400+ points and unlock microcredit opportunities up to $7,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Mascot level={2} points={300} size="lg" />
          </div>
          
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have improved their financial literacy and unlocked new opportunities.
          </p>
          
          <Button 
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-lg px-8 py-4"
          >
            <Award className="w-5 h-5 mr-2" />
            Start Learning Today
          </Button>
          
          <div className="mt-8 text-sm text-muted-foreground">
            🚀 Free to start • 📱 Mobile friendly • 🎯 Personalized learning
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;