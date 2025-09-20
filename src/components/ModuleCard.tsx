import { CheckCircle, Lock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from './ProgressBar';

interface ModuleCardProps {
  title: string;
  description: string;
  points: number;
  maxPoints: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
  onStart: () => void;
}

export const ModuleCard = ({
  title,
  description,
  points,
  maxPoints,
  isUnlocked,
  isCompleted,
  icon,
  onStart
}: ModuleCardProps) => {
  return (
    <Card className={`
      hover-lift cursor-pointer transition-all duration-300
      ${isUnlocked ? 'bg-gradient-card border-primary/20' : 'bg-muted border-muted-foreground/20 opacity-60'}
      ${isCompleted ? 'border-success bg-success/5' : ''}
    `}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={`
            p-2 rounded-lg 
            ${isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-muted'}
            ${isCompleted ? 'bg-success text-success-foreground' : ''}
          `}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
             !isUnlocked ? <Lock className="w-5 h-5" /> : 
             icon}
          </div>
          <span className={isUnlocked ? 'text-foreground' : 'text-muted-foreground'}>
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className={`text-sm ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
          {description}
        </p>
        
        <ProgressBar
          current={points}
          max={maxPoints}
          variant={isCompleted ? 'success' : 'default'}
          size="sm"
        />
        
        <Button
          onClick={onStart}
          disabled={!isUnlocked}
          className={`w-full ${
            isCompleted 
              ? 'bg-success hover:bg-success/90 text-success-foreground' 
              : isUnlocked 
                ? 'btn-primary' 
                : ''
          }`}
          variant={isUnlocked ? 'default' : 'secondary'}
        >
          {!isUnlocked ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Module
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Module
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};