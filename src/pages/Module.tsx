import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/ProgressBar';
import { Mascot } from '@/components/Mascot';
import { XPProgressBar } from '@/components/XPProgressBar';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Lightbulb } from 'lucide-react';
import { 
  calculateQuizXP, 
  updateUserProgress, 
  updateStreak, 
  FrogStage,
  UserProgress 
} from '@/lib/points';

const Module = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showMascotAnimation, setShowMascotAnimation] = useState(false);
  
  // XP and progression state
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 0,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    currentStage: 'Tadpole',
    xpToNextStage: 50
  });
  const [previousXP, setPreviousXP] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

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
    }
  };

  const module = id ? moduleData[parseInt(id) as keyof typeof moduleData] : null;
  const question = module?.questions[currentQuestion];
  const progress = module ? ((currentQuestion + (answered ? 1 : 0)) / module.questions.length) * 100 : 0;

  // Initialize total questions when module loads
  useEffect(() => {
    if (module) {
      setTotalQuestions(module.questions.length);
    }
  }, [module]);

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
    
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setPoints(points + 50);
      setShowMascotAnimation(true);
      setTimeout(() => setShowMascotAnimation(false), 1000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (module?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Module complete - calculate XP and update progress
      const score = (correctAnswers / totalQuestions) * 100;
      const xpActions = calculateQuizXP(score, totalQuestions);
      
      // Update streak
      const newStreak = updateStreak(userProgress.streak, userProgress.lastActiveDate);
      
      // Update user progress
      const updatedProgress = updateUserProgress(userProgress, xpActions);
      updatedProgress.streak = newStreak;
      updatedProgress.lastActiveDate = new Date().toISOString();
      
      setPreviousXP(userProgress.xp);
      setUserProgress(updatedProgress);
      
      // Navigate back to modules
      navigate('/modules');
    }
  };

  const handleEvolution = (newStage: FrogStage) => {
    console.log(`Frog evolved to: ${newStage}`);
    // Here you could trigger additional animations or notifications
  };

  const isCorrect = selectedAnswer === question.correct;
  const isIncorrect = answered && selectedAnswer !== question.correct;

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
                <div className="text-lg font-bold">{userProgress.xp} XP</div>
                <div className="text-xs text-primary-foreground/80">Current XP</div>
              </div>
              <Mascot 
                xp={userProgress.xp}
                previousXP={previousXP}
                isAnimating={showMascotAnimation}
                onEvolution={handleEvolution}
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
        {/* XP Progress Bar */}
        <div className="mb-8">
          <XPProgressBar
            currentXP={userProgress.xp}
            previousXP={previousXP}
            streak={userProgress.streak}
            size="lg"
            onEvolution={handleEvolution}
            className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
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
                  <span className="text-sm text-muted-foreground">Current XP</span>
                  <span className="font-medium">{userProgress.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Stage</span>
                  <span className="font-medium">{userProgress.currentStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">XP to Next Stage</span>
                  <span className="font-medium">{userProgress.xpToNextStage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions Left</span>
                  <span className="font-medium">{(module?.questions.length || 0) - currentQuestion - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completion</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="font-medium">{userProgress.streak} days</span>
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