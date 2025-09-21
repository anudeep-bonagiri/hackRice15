import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PersonaVerificationProps {
  username: string;
  isVerified: boolean;
  onVerificationComplete: (inquiryId: string) => void;
}

declare global {
  interface Window {
    Persona: any;
  }
}

const PersonaVerification: React.FC<PersonaVerificationProps> = ({
  username,
  isVerified,
  onVerificationComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonaLoaded, setIsPersonaLoaded] = useState(false);

  useEffect(() => {
    // For demo purposes, simulate that Persona SDK is ready
    // In production, this would load the actual Persona SDK
    setTimeout(() => {
      setIsPersonaLoaded(true);
      console.log('✅ Persona SDK ready (demo mode)');
    }, 100);
  }, []);

  const handleVerifyIdentity = async () => {
    if (!isPersonaLoaded) {
      toast.error('Verification system is still loading...');
      return;
    }

    try {
      setIsLoading(true);
      
      // Demo: Simulate Persona verification process (frontend-only)
      console.log('🚀 Starting demo Persona verification for:', username);
      
      // Simulate verification delay
      setTimeout(() => {
        try {
          const mockInquiryId = `inq_demo_${Date.now()}`;
          
          // Frontend-only demo: simulate successful verification
          console.log('✅ Demo verification completed:', mockInquiryId);
          
          // Simulate microcredit score increase
          const mockMicrocreditScore = 75; // Demo score
          
          toast.success('🎉 Demo: Identity verification completed!', {
            description: `Your microcredit eligibility increased! Demo mode active.`
          });
          
          // Complete the verification
          onVerificationComplete(mockInquiryId);
          
        } catch (error) {
          console.error('❌ Error in demo verification:', error);
          toast.error('Demo verification simulation failed');
        } finally {
          setIsLoading(false);
        }
      }, 2000); // 2 second demo delay
      
    } catch (error) {
      console.error('❌ Error starting demo verification:', error);
      toast.error('Failed to start verification demo');
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Identity Verified
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 text-sm">
            Your identity has been successfully verified. This increases your microcredit eligibility score by 10 points.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Shield className="w-5 h-5" />
          Verify Your Identity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-blue-700 space-y-2">
          <p className="font-medium">Benefits of identity verification:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>+10 points to your microcredit score</li>
            <li>Access to higher loan amounts</li>
            <li>Faster loan approval process</li>
            <li>Verified badge on your profile</li>
            <li>Enhanced account security</li>
          </ul>
        </div>
        
        <div className="bg-blue-100 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Secure & Private</p>
              <p>Your personal information is encrypted and protected. We use Persona's bank-level security.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleVerifyIdentity}
          disabled={isLoading || !isPersonaLoaded}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting Verification...
            </>
          ) : !isPersonaLoaded ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading Verification System...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              📹 Demo: Verify Identity (Simulated)
            </>
          )}
        </Button>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 text-center font-medium">
            🎭 DEMO MODE: This simulates identity verification for demonstration purposes only.
          </p>
          <p className="text-xs text-yellow-700 text-center mt-1">
            In production: Takes 2-3 minutes • Government ID required
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaVerification;