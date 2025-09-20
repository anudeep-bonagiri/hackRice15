import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap, Crown, Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (user: any) => boolean;
  points: number;
  unlocked: boolean;
  category: 'points' | 'modules' | 'streak' | 'credit' | 'special';
}

interface AchievementSystemProps {
  user: any;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const AchievementSystem = ({ user, onAchievementUnlocked }: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const allAchievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Complete your first question',
      icon: <Star className="w-5 h-5" />,
      condition: (user) => (user?.totalPoints || 0) >= 50,
      points: 10,
      unlocked: false,
      category: 'points'
    },
    {
      id: 'budget-boss',
      title: 'Budget Boss',
      description: 'Complete the Budget Boss module',
      icon: <Target className="w-5 h-5" />,
      condition: (user) => (user?.moduleProgress?.[1] || 0) >= 100,
      points: 25,
      unlocked: false,
      category: 'modules'
    },
    {
      id: 'debt-destroyer',
      title: 'Debt Destroyer',
      description: 'Complete the Debt Destroyer module',
      icon: <Zap className="w-5 h-5" />,
      condition: (user) => (user?.moduleProgress?.[2] || 0) >= 100,
      points: 25,
      unlocked: false,
      category: 'modules'
    },
    {
      id: 'hundred-points',
      title: 'Century Club',
      description: 'Earn 100 total points',
      icon: <Trophy className="w-5 h-5" />,
      condition: (user) => (user?.totalPoints || 0) >= 100,
      points: 15,
      unlocked: false,
      category: 'points'
    },
    {
      id: 'credit-builder',
      title: 'Credit Builder',
      description: 'Reach a credit score of 500',
      icon: <Award className="w-5 h-5" />,
      condition: (user) => (user?.creditScore || 0) >= 500,
      points: 20,
      unlocked: false,
      category: 'credit'
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 3-day learning streak',
      icon: <Zap className="w-5 h-5" />,
      condition: (user) => (user?.streak || 0) >= 3,
      points: 15,
      unlocked: false,
      category: 'streak'
    },
    {
      id: 'module-master',
      title: 'Module Master',
      description: 'Complete 3 modules',
      icon: <Crown className="w-5 h-5" />,
      condition: (user) => (user?.completedModules || 0) >= 3,
      points: 30,
      unlocked: false,
      category: 'modules'
    },
    {
      id: 'financial-guru',
      title: 'Financial Guru',
      description: 'Earn 500 total points',
      icon: <Crown className="w-5 h-5" />,
      condition: (user) => (user?.totalPoints || 0) >= 500,
      points: 50,
      unlocked: false,
      category: 'points'
    }
  ];

  useEffect(() => {
    if (!user) return;

    const updatedAchievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: achievement.condition(user)
    }));

    // Check for newly unlocked achievements
    const newlyUnlockedAchievements = updatedAchievements.filter(
      (achievement, index) => 
        achievement.unlocked && 
        !achievements[index]?.unlocked
    );

    if (newlyUnlockedAchievements.length > 0) {
      setNewlyUnlocked(newlyUnlockedAchievements);
      newlyUnlockedAchievements.forEach(achievement => {
        onAchievementUnlocked?.(achievement);
      });
    }

    setAchievements(updatedAchievements);
  }, [user]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'points': return 'bg-primary/20 text-primary border-primary/30';
      case 'modules': return 'bg-success/20 text-success border-success/30';
      case 'streak': return 'bg-cta/20 text-cta border-cta/30';
      case 'credit': return 'bg-achievement/20 text-achievement border-achievement/30';
      case 'special': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 border-purple-300/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Achievement Summary */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-achievement" />
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}</div>
              <div className="text-sm text-muted-foreground">Bonus Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cta">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-achievement">{user?.achievements || 0}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-achievement" />
            Unlocked Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="achievement-glow bg-achievement/10 border-achievement/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-achievement/20">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-achievement">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge className={getCategoryColor(achievement.category)}>
                      +{achievement.points}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.slice(0, 4).map((achievement) => (
              <Card key={achievement.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted/20">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-muted-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      +{achievement.points}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
