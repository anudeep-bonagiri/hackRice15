import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireVerification = false 
}) => {
  const { user, loading, isDemoMode } = useUser();

  // Show loading spinner while checking user status
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user exists, redirect to login (not face verification)
  if (!user) {
    console.log('🚫 No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('🔍 ProtectedRoute check:', {
    userId: user.id,
    verified: user.verified,
    faceVerified: user.faceVerification?.verified,
    isDemoMode,
    requireVerification
  });

  // If verification is required, check verification status
  if (requireVerification) {
    // Demo users are considered verified
    if (isDemoMode) {
      console.log('✅ Demo mode - bypassing verification requirement');
      return <>{children}</>;
    }
    
    // Regular users need either general verification OR face verification
    const isVerified = user.verified || user.faceVerification?.verified;
    
    if (!isVerified) {
      console.log('🚫 User not verified, redirecting to face verification:', {
        verified: user.verified,
        faceVerified: user.faceVerification?.verified
      });
      return <Navigate to="/face-verify" replace />;
    }
  }

  // User is authenticated (and verified if required), render the protected component
  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;