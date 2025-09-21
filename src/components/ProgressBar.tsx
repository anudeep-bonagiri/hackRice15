interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'achievement' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = ({ 
  current, 
  max, 
  label, 
  showPercentage = true, 
  variant = 'default',
  size = 'md' 
}: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    achievement: 'bg-achievement',
    cyan: 'bg-cyan-500'
  };
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {current}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`progress-fill ${variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};