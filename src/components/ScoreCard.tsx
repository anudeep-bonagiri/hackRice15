import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Award, DollarSign } from 'lucide-react';

interface ScoreCardProps {
  type: 'progress' | 'credit' | 'microcredit' | 'achievements';
  value: number | string;
  label: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const ScoreCard = ({ type, value, label, subtitle, trend }: ScoreCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'progress':
        return <Target className="w-5 h-5" />;
      case 'credit':
        return <TrendingUp className="w-5 h-5" />;
      case 'microcredit':
        return <DollarSign className="w-5 h-5" />;
      case 'achievements':
        return <Award className="w-5 h-5" />;
    }
  };

  const getColorScheme = () => {
    switch (type) {
      case 'progress':
        return 'text-primary bg-primary/10';
      case 'credit':
        return 'text-success bg-success/10';
      case 'microcredit':
        return 'text-cta bg-cta/10';
      case 'achievements':
        return 'text-achievement bg-achievement/10';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover-lift bg-gradient-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={`p-2 rounded-lg ${getColorScheme()}`}>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        {subtitle && (
          <p className={`text-xs ${getTrendColor()} mt-1`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};