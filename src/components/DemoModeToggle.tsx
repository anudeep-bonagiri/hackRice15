import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export const DemoModeToggle = ({ isDemoMode, onToggle }: DemoModeToggleProps) => {
  return (
    <Card className="mb-6 bg-gradient-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          {isDemoMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          Demo Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="demo-mode"
            checked={isDemoMode}
            onCheckedChange={onToggle}
          />
          <Label htmlFor="demo-mode" className="text-sm">
            {isDemoMode 
              ? "Viewing demo data with sample progress" 
              : "Viewing your actual progress (starts at 0 for new users)"
            }
          </Label>
        </div>
        {!isDemoMode && (
          <p className="text-xs text-muted-foreground mt-2">
            New users start with 0 points, 0 credit score, and 0 achievements. 
            Complete modules to build your financial knowledge and unlock microcredit opportunities!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
