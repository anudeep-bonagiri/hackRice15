import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle, AlertCircle, Loader2, UserCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Persona?: any;
  }
}

interface PersonaFaceScannerProps {
  onSuccess: (userData: any) => void;
}

const PersonaFaceScanner: React.FC<PersonaFaceScannerProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<'ready' | 'scanning' | 'captured' | 'verifying' | 'success'>('ready');

  useEffect(() => {
    // Load Persona SDK from CDN
    if (!window.Persona) {
      const script = document.createElement('script');
      script.src = 'https://cdn.withpersona.com/dist/persona-web-sdk.js';
      script.onload = () => {
        console.log('✅ Persona SDK loaded');
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setScanStep('scanning');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      toast.success('📹 Camera activated! Position your face in the frame');
      
      // Auto-capture after 3 seconds
      setTimeout(() => {
        capturePhoto();
      }, 3000);
      
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error('Camera access denied. Please allow camera permissions.');
      setIsScanning(false);
      setScanStep('ready');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      setScanStep('captured');
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      toast.success('✅ Photo captured! Processing verification...');
      
      // Start verification process
      setTimeout(() => {
        processVerification(imageDataUrl);
      }, 1000);
    }
  };

  const processVerification = async (imageData: string) => {
    setIsVerifying(true);
    setScanStep('verifying');

    try {
      // Demo: Simulate face recognition processing
      console.log('🧠 Processing face recognition...');
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock verification result (in real app, this would call Persona API)
      const mockUserData = {
        id: `user_${Date.now()}`,
        name: 'Verified User',
        email: 'user@growfi.com',
        verified: true,
        faceMatch: true,
        confidence: 0.98,
        timestamp: new Date().toISOString(),
        imageData: imageData
      };

      // Success!
      setScanStep('success');
      toast.success('🎉 Face verification successful!', {
        description: 'Welcome to GrowFi! Redirecting to your dashboard...'
      });

      // Store user data in localStorage for demo
      localStorage.setItem('growfi-user-verified', JSON.stringify(mockUserData));
      localStorage.setItem('growfi-demo-mode', 'true');

      // Call success callback
      onSuccess(mockUserData);

      // Navigate to dashboard after success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
      setScanStep('ready');
      setIsVerifying(false);
      setCapturedImage(null);
    }
  };

  const resetScanner = () => {
    setScanStep('ready');
    setIsScanning(false);
    setIsVerifying(false);
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const renderScanningInterface = () => {
    switch (scanStep) {
      case 'ready':
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Face Verification</h3>
              <p className="text-gray-600 mb-4">
                Verify your identity using your camera to access GrowFi
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">What to expect:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-blue-700">
                      <li>Position your face in the camera frame</li>
                      <li>Photo will be captured automatically</li>
                      <li>AI will verify your identity</li>
                      <li>Access granted to your financial dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Face Verification
            </Button>
          </div>
        );

      case 'scanning':
        return (
          <div className="space-y-4">
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full rounded-lg border-4 border-blue-500"
                autoPlay 
                muted 
                playsInline
              />
              <div className="absolute inset-0 border-4 border-dashed border-white rounded-lg pointer-events-none">
                <div className="absolute inset-4 border-2 border-white rounded-full"></div>
              </div>
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ● LIVE
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Position your face in the frame...</span>
              </div>
              <p className="text-sm text-gray-500">Auto-capture in 3 seconds</p>
            </div>
          </div>
        );

      case 'captured':
        return (
          <div className="space-y-4 text-center">
            <div className="relative">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Captured face" 
                  className="w-full rounded-lg border-4 border-green-500"
                />
              )}
              <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-800">Photo Captured!</h3>
              <p className="text-green-600">Processing verification...</p>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="space-y-6 text-center">
            <div className="relative">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Verifying face" 
                  className="w-full rounded-lg border-4 border-yellow-500 opacity-75"
                />
              )}
              <div className="absolute inset-0 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-full p-4">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-2">Verifying Identity...</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Analyzing facial features</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                  <span>Checking liveness detection</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-500"></div>
                  <span>Validating identity</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6 text-center">
            <div className="relative">
              {capturedImage && (
                <img 
                  src={capturedImage} 
                  alt="Verified face" 
                  className="w-full rounded-lg border-4 border-green-500"
                />
              )}
              <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-full p-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                Verification Successful!
                <Sparkles className="w-6 h-6" />
              </h3>
              <p className="text-green-600 mb-4">Welcome to GrowFi! Redirecting to your dashboard...</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  🎉 Your financial literacy journey begins now!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          GrowFi Identity Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderScanningInterface()}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {scanStep !== 'ready' && scanStep !== 'success' && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={resetScanner}
              className="w-full"
              size="sm"
            >
              Cancel & Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonaFaceScanner;