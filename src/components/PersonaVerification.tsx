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
    // Load Persona SDK if not already loaded
    if (!window.Persona && !document.querySelector('script[src*="persona"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.withpersona.com/dist/persona-v4.7.0.js';
      script.async = true;
      script.onload = () => {
        setIsPersonaLoaded(true);
        console.log('✅ Persona SDK loaded successfully');
      };
      script.onerror = () => {
        console.error('❌ Failed to load Persona SDK');
        toast.error('Failed to load verification system');
      };
      document.head.appendChild(script);
    } else if (window.Persona) {
      setIsPersonaLoaded(true);
    }
  }, []);

  const handleVerifyIdentity = async () => {
    if (!isPersonaLoaded) {
      toast.error('Verification system is still loading...');
      return;
    }

    if (!window.Persona) {
      toast.error('Verification system not available');
      return;
    }

    try {
      setIsLoading(true);
      
      const client = new window.Persona.Client({
        templateId: import.meta.env.VITE_PERSONA_TEMPLATE_ID || 'tmpl_12345',
        environmentId: import.meta.env.VITE_PERSONA_ENVIRONMENT_ID || 'sandbox',
        referenceId: username, // Link to our user
        fields: {
          nameFirst: username,
        },
        onReady: () => {
          console.log('🚀 Persona client ready');
          setIsLoading(false);
        },
        onComplete: async ({ inquiryId, status, fields }) => {
          console.log('✅ Persona verification complete:', { inquiryId, status });
          
          try {
            // Call our existing API to update verification status
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/verification/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                type: 'identity',
                status: status === 'completed',
                personaInquiryId: inquiryId,
                verificationData: {
                  status,
                  fields: fields || {},
                  completedAt: new Date().toISOString()
                }
              }),
            });

            if (response.ok) {
              const result = await response.json();
              toast.success('Identity verification completed!', {
                description: 'Your microcredit score has been updated.'
              });
              onVerificationComplete(inquiryId);
            } else {
              throw new Error('Failed to update verification status');
            }
          } catch (error) {
            console.error('❌ Error updating verification:', error);
            toast.error('Verification completed but failed to update profile');
          }
        },
        onCancel: ({ inquiryId, sessionToken }) => {
          console.log('❌ Persona verification cancelled:', inquiryId);
          toast.info('Identity verification was cancelled');
          setIsLoading(false);
        },
        onError: ({ errorCode, errorMessage }) => {
          console.error('❌ Persona verification error:', errorCode, errorMessage);
          toast.error('Verification failed', {
            description: errorMessage || 'Please try again later'
          });
          setIsLoading(false);
        }
      });

      // Open the verification flow
      client.open();
      
    } catch (error) {
      console.error('❌ Error initializing Persona:', error);
      toast.error('Failed to start verification');
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
              Verify Identity Now
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-600 text-center">
          Takes 2-3 minutes • Government ID required
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonaVerification;