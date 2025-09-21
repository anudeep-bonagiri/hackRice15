import React from 'react';
import PersonaFaceScanner from '@/components/PersonaFaceScanner';
import GrowFiLogo from '@/assets/GrowFi.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';

const FaceVerification = () => {
  const navigate = useNavigate();

  const handleVerificationSuccess = (userData: any) => {
    console.log('✅ Verification successful in parent:', userData);
    
    // Clear demo mode flag - face verification is for real users
    localStorage.removeItem('growfi-demo-mode');
    
    // Get existing user data or create new demo user
    const existingUser = localStorage.getItem('growfi-user');
    let updatedUser;
    
    if (existingUser) {
      // Update existing user with verification status
      const parsed = JSON.parse(existingUser);
      updatedUser = {
        ...parsed,
        name: userData.name || 'Verified User',
        verified: true,
        faceVerification: {
          verified: true,
          timestamp: userData.timestamp,
          confidence: userData.confidence || 0.95
        }
      };
    } else {
      // Create new verified user (not demo user) with face verification
      updatedUser = {
        id: 'face-verified-user',
        username: userData.username || 'verified',
        name: userData.name || 'Verified User',
        email: userData.email || 'user@growfi.com',
        totalPoints: 0,
        completedModules: 0,
        currentLevel: 1,
        creditScore: 650,
        achievements: 0,
        streak: 0,
        moduleProgress: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
        },
        preferences: {
          notifications: true,
          theme: 'light'
        },
        verified: true,
        faceVerification: {
          verified: true,
          timestamp: userData.timestamp || new Date().toISOString(),
          confidence: userData.confidence || 0.95
        },
        createdAt: userData.timestamp || new Date().toISOString()
      };
    }
    
    localStorage.setItem('growfi-user', JSON.stringify(updatedUser));
    console.log('💾 User data saved in parent:', updatedUser);
    
    // Dispatch custom event to trigger user hook refresh
    window.dispatchEvent(new CustomEvent('userDataUpdated'));
    
    // Navigate to dashboard with proper state management
    console.log('🚀 Navigating to dashboard from parent...');
    
    // Use a callback to ensure the custom event listener has time to update user state
    setTimeout(() => {
      console.log('🔄 Triggering user refresh and navigation...');
      // Double-check that the user data is saved properly before navigating
      const savedUserCheck = localStorage.getItem('growfi-user');
      if (savedUserCheck) {
        const parsedUserCheck = JSON.parse(savedUserCheck);
        console.log('✅ User verification confirmed:', parsedUserCheck.verified, parsedUserCheck.faceVerification?.verified);
      }
      navigate('/dashboard', { replace: true });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={GrowFiLogo} 
                alt="GrowFi logo" 
                className="w-12 h-12 object-contain"
              />
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-900">GrowFi</h1>
                <p className="text-xs text-gray-500">Secure Access</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-green-200/30 rounded-full blur-xl"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Secure Identity Verification
                  </h2>
                  <p className="text-gray-600">
                    Your gateway to personalized financial growth
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Why Face Verification?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Enhanced Security</p>
                      <p className="text-sm text-gray-600">
                        Biometric verification ensures only you can access your financial data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Instant Access</p>
                      <p className="text-sm text-gray-600">
                        Quick verification process gets you to your dashboard in seconds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Compliance Ready</p>
                      <p className="text-sm text-gray-600">
                        Meet KYC requirements for microcredit eligibility
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    What Happens Next?
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      1
                    </div>
                    <span>Camera activation for face scanning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs">
                      2
                    </div>
                    <span>AI-powered identity verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">
                      3
                    </div>
                    <span>Access to your personalized dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Face Scanner */}
          <div className="flex justify-center">
            <PersonaFaceScanner onSuccess={handleVerificationSuccess} />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trusted by Financial Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">256-bit</div>
                <div className="text-sm text-gray-600">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">GDPR</div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">SOC 2</div>
                <div className="text-sm text-gray-600">Certified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              © 2024 GrowFi. Secure verification powered by advanced AI technology.
            </p>
            <div className="flex justify-center gap-6 mt-2">
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaceVerification;