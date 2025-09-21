import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import GrowFiLogo from '@/assets/GrowFi.png';
import CelebrationVideo from '@/assets/Video_Generation_For_Celebration.mp4';
import SadVideo from '@/assets/Sad_Crying_Character_Video_Generation.mp4';
import SwimmingVideo from '@/assets/Video_Generation_Of_Swimming_Image.mp4';
import { useUser } from '@/hooks/useUser';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Lightbulb, Trophy, Star } from 'lucide-react';

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Sample module data - expanding to include multiple modules
  const moduleData = {
    1: {
      title: "Budget Boss",
      description: "Master the art of budgeting and expense tracking",
      questions: [
        {
          question: "What is the 50/30/20 budget rule?",
          options: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% needs, 20% wants",
            "50% wants, 30% savings, 20% needs",
            "50% debt, 30% needs, 20% wants"
          ],
          correct: 0,
          explanation: "The 50/30/20 rule allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment."
        },
        {
          question: "Which expense tracking method is most effective for beginners?",
          options: [
            "Mental tracking only",
            "Writing everything down or using an app",
            "Only tracking large purchases",
            "Tracking once per month"
          ],
          correct: 1,
          explanation: "Writing down expenses or using a budgeting app helps create awareness and accountability for all spending."
        }
      ]
    },
    2: {
      title: "Debt Destroyer",
      description: "Learn strategies to eliminate debt effectively",
      questions: [
        {
          question: "What is the debt snowball method?",
          options: [
            "Pay minimum on all debts, extra on highest interest",
            "Pay minimum on all debts, extra on smallest balance",
            "Pay equal amounts on all debts",
            "Only pay the largest debt first"
          ],
          correct: 1,
          explanation: "The debt snowball method focuses on paying the smallest debt first to build momentum and motivation."
        },
        {
          question: "What's a good debt-to-income ratio?",
          options: [
            "Below 15%",
            "Below 25%",
            "Below 36%",
            "Below 50%"
          ],
          correct: 2,
          explanation: "A debt-to-income ratio below 36% is generally considered healthy, with housing costs ideally below 28%."
        }
      ]
    },
    3: {
      title: "Emergency Fund Fortress",
      description: "Build and protect your safety net",
      questions: [
        {
          question: "How many months of expenses should an emergency fund cover?",
          options: [
            "1 month",
            "3 to 6 months",
            "9 to 12 months",
            "12 to 24 months"
          ],
          correct: 1,
          explanation: "Financial experts recommend 3 to 6 months of living expenses to handle unexpected events like job loss or medical bills."
        },
        {
          question: "What's the best place to keep an emergency fund?",
          options: [
            "Checking account",
            "High-yield savings account",
            "Stocks",
            "Retirement account"
          ],
          correct: 1,
          explanation: "A high-yield savings account provides accessibility, safety, and some interest growth, making it ideal for emergencies."
        }
      ]
    },
    4: {
      title: "Investment Explorer",
      description: "Learn the basics of investing and portfolio building",
      questions: [
        {
          question: "What does diversification mean in investing?",
          options: [
            "Investing in one type of asset only",
            "Spreading investments across different assets",
            "Investing all money into savings accounts",
            "Avoiding risky investments"
          ],
          correct: 1,
          explanation: "Diversification means spreading investments across asset classes to reduce overall risk."
        },
        {
          question: "Which investment generally carries the lowest risk?",
          options: [
            "Stocks",
            "Bonds",
            "Real estate",
            "Savings accounts"
          ],
          correct: 3,
          explanation: "Savings accounts carry very low risk but also low returns, while stocks and real estate carry higher risks and returns."
        }
      ]
    },
    5: {
      title: "Credit Champion",
      description: "Master credit scores and responsible borrowing",
      questions: [
        {
          question: "Which factor has the biggest impact on your credit score?",
          options: [
            "Payment history",
            "Credit mix",
            "Length of credit history",
            "New credit inquiries"
          ],
          correct: 0,
          explanation: "Payment history makes up about 35% of your credit score, making it the most important factor."
        },
        {
          question: "What’s a good credit score range?",
          options: [
            "300-499",
            "500-649",
            "650-719",
            "720-850"
          ],
          correct: 3,
          explanation: "A score of 720 or higher is generally considered excellent, giving you access to the best rates and loan terms."
        }
      ]
    },
    6: {
      title: "Wealth Builder Pro",
      description: "Take your wealth to the next level with advanced strategies",
      questions: [
        {
          question: "What is tax-loss harvesting?",
          options: [
            "Avoiding taxes by not selling investments",
            "Selling investments at a loss to offset capital gains",
            "Moving money to tax-free accounts",
            "Donating assets to reduce taxable income"
          ],
          correct: 1,
          explanation: "Tax-loss harvesting reduces tax liability by selling losing investments to offset gains from winners."
        },
        {
          question: "Why is estate planning important?",
          options: [
            "It avoids all taxes",
            "It ensures assets are distributed according to your wishes",
            "It increases investment returns",
            "It eliminates debt automatically"
          ],
          correct: 1,
          explanation: "Estate planning ensures your assets are transferred smoothly and according to your wishes, while minimizing taxes and disputes."
        }
      ]
    }
  };
  

  const module = id ? moduleData[parseInt(id) as keyof typeof moduleData] : null;
  const question = module?.questions[currentQuestion];
  const progress = module ? ((currentQuestion + (answered ? 1 : 0)) / module.questions.length) * 100 : 0;

  // Calculate points and progress based on user's current state
  const moduleId = parseInt(id || '1');
  const currentModuleProgress = user?.moduleProgress?.[moduleId] || 0;
  const currentTotalPoints = user?.totalPoints || 0;

  // Initialize points from current progress
  useEffect(() => {
    if (user && moduleId) {
      setPoints(currentModuleProgress);
    }
  }, [user, moduleId, currentModuleProgress]);

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Module Not Found</h1>
          <p className="text-muted-foreground mb-6">This module is not available yet.</p>
          <Button onClick={() => navigate('/modules')} className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    if (answerIndex === question.correct) {
      const newPoints = points + 50;
      setPoints(newPoints);
      setCorrectAnswers(correctAnswers + 1);
      
      // Update user progress immediately
      updateUserProgress(newPoints);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (module?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Module complete - calculate final progress and achievements
      completeModule();
    }
  };

  const updateUserProgress = (newPoints: number) => {
    if (!user || !moduleId) return;

    const updatedModuleProgress = { ...user.moduleProgress };
    updatedModuleProgress[moduleId] = newPoints;

    const newTotalPoints = currentTotalPoints + (newPoints - currentModuleProgress);
    const newCompletedModules = newTotalPoints >= 100 ? (user.completedModules || 0) + 1 : user.completedModules || 0;
    const newCurrentLevel = Math.floor(newTotalPoints / 100) + 1;
    const newCreditScore = Math.min(850, Math.max(300, 300 + (newTotalPoints * 2)));
    const newAchievements = Math.floor(newTotalPoints / 200) + 1;
    const newStreak = user.streak || 0;

    updateProgress({
      totalPoints: newTotalPoints,
      completedModules: newCompletedModules,
      currentLevel: newCurrentLevel,
      creditScore: newCreditScore,
      achievements: newAchievements,
      streak: newStreak,
      moduleProgress: updatedModuleProgress
    });
  };

  const completeModule = () => {
    if (!user || !moduleId) return;

    const moduleCompletionBonus = 25; // Bonus points for completing module
    const finalPoints = points + moduleCompletionBonus;
    
    const updatedModuleProgress = { ...user.moduleProgress };
    updatedModuleProgress[moduleId] = 100; // Mark module as 100% complete

    const newTotalPoints = currentTotalPoints + (finalPoints - currentModuleProgress);
    const newCompletedModules = (user.completedModules || 0) + 1;
    const newCurrentLevel = Math.floor(newTotalPoints / 100) + 1;
    const newCreditScore = Math.min(850, Math.max(300, 300 + (newTotalPoints * 2)));
    const newAchievements = Math.floor(newTotalPoints / 200) + 1;
    const newStreak = (user.streak || 0) + 1;

    updateProgress({
      totalPoints: newTotalPoints,
      completedModules: newCompletedModules,
      currentLevel: newCurrentLevel,
      creditScore: newCreditScore,
      achievements: newAchievements,
      streak: newStreak,
      moduleProgress: updatedModuleProgress
    });

    setModuleCompleted(true);
    
    // Show completion animation and navigate after delay
    setTimeout(() => {
      navigate('/modules');
    }, 3000);
  };

  const isCorrect = selectedAnswer === question.correct;
  const isIncorrect = answered && selectedAnswer !== question.correct;
  const videoSrc = answered ? (isCorrect ? CelebrationVideo : SadVideo) : SwimmingVideo;
  const videoLoop = !answered;

  // Ensure autoplay reliably starts on all browsers after selection
  const feedbackVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoSrc && feedbackVideoRef.current) {
      try {
        feedbackVideoRef.current.muted = true;
        feedbackVideoRef.current.currentTime = 0;
        const p = feedbackVideoRef.current.play();
        if (p && typeof p.then === 'function') {
          p.catch(() => {/* ignore autoplay rejection */});
        }
      } catch (_) {
        // no-op
      }
    }
  }, [videoSrc]);

  // Module completion screen
  if (moduleCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Module Complete!</h1>
            <p className="text-muted-foreground">Congratulations on completing {module?.title}!</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-gradient-card rounded-lg">
              <span className="text-muted-foreground">Points Earned</span>
              <span className="font-bold text-primary">+{points + 25}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-card rounded-lg">
              <span className="text-muted-foreground">Correct Answers</span>
              <span className="font-bold text-success">{correctAnswers}/{module?.questions.length}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-card rounded-lg">
              <span className="text-muted-foreground">New Total Points</span>
              <span className="font-bold text-cta">{currentTotalPoints + (points + 25 - currentModuleProgress)}</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Your progress has been saved!</p>
            <p>Returning to modules in a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/modules')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">{module.title}</h1>
                <p className="text-primary-foreground/80 text-sm">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold">{points} pts</div>
                <div className="text-xs text-primary-foreground/80">Current Score</div>
              </div>
              <img 
                src={GrowFiLogo} 
                alt="GrowFi logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <ProgressBar
              current={progress}
              max={100}
              label={`Question ${currentQuestion + 1} of ${module?.questions.length || 0}`}
              variant="success"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Section */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Desktop: outside to the left */}
              <div className="hidden md:block absolute -left-24 top-2 z-10">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-muted bg-background shadow">
                  <video
                    key={`${String(videoSrc)}-${answered ? 'answered' : 'idle'}`}
                    ref={feedbackVideoRef}
                    src={videoSrc}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    loop={videoLoop}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Mobile: above the card */}
              <div className="md:hidden mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-muted bg-background shadow">
                  <video
                    key={`${String(videoSrc)}-${answered ? 'answered' : 'idle'}`}
                    ref={feedbackVideoRef}
                    src={videoSrc}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    loop={videoLoop}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answered}
                        className={`
                          w-full p-4 text-left rounded-lg border-2 transition-all duration-300
                          ${!answered 
                            ? 'border-border hover:border-primary hover:bg-primary/5' 
                            : index === question.correct
                              ? 'border-success bg-success/10 text-success'
                              : selectedAnswer === index
                                ? 'border-destructive bg-destructive/10 text-destructive'
                                : 'border-muted bg-muted/50 text-muted-foreground'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {answered && (
                            <div>
                              {index === question.correct && <CheckCircle className="w-5 h-5 text-success" />}
                              {selectedAnswer === index && index !== question.correct && <XCircle className="w-5 h-5 text-destructive" />}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}

                    {answered && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground mb-1">Explanation</h4>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {answered && (
                      <div className="flex justify-between items-center pt-4">
                        <div className="text-sm text-muted-foreground">
                          {isCorrect ? (
                            <span className="text-success">✓ Correct! +50 points</span>
                          ) : (
                            <span className="text-destructive">✗ Incorrect, but you learned something new!</span>
                          )}
                        </div>
                        <Button onClick={handleNext} className="btn-primary">
                          {currentQuestion < (module?.questions.length || 0) - 1 ? 'Next Question' : 'Complete Module'}
                        </Button>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Need help with this question? I'm here to guide you through budgeting concepts!
                </p>
                <Button variant="outline" className="w-full">
                  Ask for Help
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Progress Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Points</span>
                  <span className="font-medium">{points}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Points</span>
                  <span className="font-medium">{currentTotalPoints + (points - currentModuleProgress)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Correct Answers</span>
                  <span className="font-medium">{correctAnswers}/{currentQuestion + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Credit Score</span>
                  <span className="font-medium">{Math.min(850, Math.max(300, 300 + ((currentTotalPoints + (points - currentModuleProgress)) * 2)))}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Module;
