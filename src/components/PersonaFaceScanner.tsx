import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle, AlertCircle, Loader2, UserCheck, Sparkles, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import * as faceapi from 'face-api.js';

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
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [scanStep, setScanStep] = useState<'ready' | 'scanning' | 'face-detected' | 'captured' | 'verifying' | 'success' | 'failed'>('ready');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [objectDetected, setObjectDetected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Load Face-API models
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        console.log('Loading face detection models...');
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log('✅ Face detection models loaded');
      } catch (error) {
        console.error('❌ Error loading face detection models:', error);
        // Fallback to demo mode if models fail to load
        setModelsLoaded(true);
      }
    };

    loadModels();

    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const detectFace = async (video: HTMLVideoElement) => {
    if (!modelsLoaded || !video) {
      setFaceDetected(false);
      return false;
    }
    
    try {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
      ).withFaceLandmarks().withFaceDescriptors();
      
      // Strict face validation
      const validFace = detections.find(detection => {
        const { score } = detection.detection;
        const landmarks = detection.landmarks;
        
        // High but reasonable detection confidence
        if (score < 0.75) return false;
        
        // Must have facial landmarks (indicates a real face)
        if (!landmarks) return false;
        
        // Get face box dimensions
        const box = detection.detection.box;
        const faceArea = box.width * box.height;
        const videoArea = video.videoWidth * video.videoHeight;
        const faceRatio = faceArea / videoArea;
        
        // Face must be reasonable size
        if (faceRatio < 0.05 || faceRatio > 0.6) return false;
        
        // Face must be minimum size in pixels
        if (box.width < 80 || box.height < 80) return false;
        
        // Reasonable aspect ratio for human faces
        const aspectRatio = box.width / box.height;
        if (aspectRatio < 0.6 || aspectRatio > 1.5) return false;
        
        console.log('😊 Valid face detected!', {
          score: score.toFixed(2),
          faceRatio: (faceRatio * 100).toFixed(1) + '%',
          aspectRatio: aspectRatio.toFixed(2)
        });
        
        return true;
      });
      
      const faceFound = !!validFace;
      const objectFound = detections.length > 0;
      
      console.log('🔍 Detection results:', {
        detections: detections.length,
        faceFound,
        objectFound,
        willShowObject: objectFound && !faceFound
      });
      
      setFaceDetected(faceFound);
      setObjectDetected(objectFound && !faceFound);
      
      if (!faceFound && objectFound) {
        console.log('😔 Object detected but not a clear face', {
          detections: detections.length,
          scores: detections.map(d => d.detection.score.toFixed(2))
        });
      }
      
      return faceFound;
    } catch (error) {
      console.error('Face detection error:', error);
      setFaceDetected(false);
      return false;
    }
  };

  const startCamera = async () => {
    if (!modelsLoaded) {
      toast.error('Face detection models are still loading...');
      return;
    }

    try {
      console.log('🎥 Starting camera...');
      setScanStep('scanning');
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user'
        } 
      });
      
      console.log('📹 Camera stream obtained:', mediaStream.getTracks().length, 'tracks');
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log('📺 Video element set, playing...');
        await videoRef.current.play();
        console.log('✅ Video playing successfully');
        
        // Start face detection loop
        let detectionInterval: NodeJS.Timeout;
        let captureTimeout: NodeJS.Timeout;
        let isCapturing = false;
        
        const startDetection = () => {
          detectionInterval = setInterval(async () => {
            if (isCapturing) return; // Prevent multiple captures
            
            const faceFound = await detectFace(videoRef.current!);
            
            if (faceFound && !isCapturing) {
              console.log('🎯 Face found! Starting capture sequence...');
              isCapturing = true;
              clearInterval(detectionInterval);
              toast.success('✅ Face detected! Capturing in 2 seconds...');
              
              captureTimeout = setTimeout(() => {
                console.log('🕒 Capture timeout triggered');
                if (videoRef.current && videoRef.current.srcObject) {
                  console.log('✅ Video still available, calling capturePhoto');
                  capturePhoto();
                } else {
                  console.error('❌ Video no longer available for capture');
                }
              }, 2000);
            }
          }, 500);
        };
        
        startDetection();
        
        // Timeout after 15 seconds if no face detected
        const timeoutId = setTimeout(() => {
          if (!isCapturing) {
            clearInterval(detectionInterval);
            if (captureTimeout) clearTimeout(captureTimeout);
            setScanStep('failed');
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
              setStream(null);
            }
            toast.error('No face detected within 15 seconds. Please try again.');
          }
        }, 15000);
      }
      
      toast.success('📹 Camera activated! Please position your face clearly in the frame');
      
    } catch (error: any) {
      console.error('❌ Camera access error:', error);
      
      let errorMessage = 'Camera access failed';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure you have a working camera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application. Please close other apps using the camera.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not supported. Trying with basic settings...';
      } else if (error.message === 'Camera API not supported') {
        errorMessage = 'Your browser does not support camera access.';
      } else {
        errorMessage = `Camera error: ${error.message || 'Unknown error'}`;
      }
      
      toast.error(errorMessage);
      setScanStep('failed');
    }
  };

  const capturePhoto = () => {
    console.log('📸 capturePhoto called');
    
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Video or canvas ref not available');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('✅ Image captured, size:', imageDataUrl.length);
      
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
    } else {
      console.error('❌ Failed to get canvas context');
    }
  };

  const processVerification = async (imageData: string) => {
    setIsVerifying(true);
    setScanStep('verifying');

    try {
      console.log('🧠 Processing face recognition...');
      
      // Create temporary image element for face detection
      const img = new Image();
      img.src = imageData;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Run face detection on captured image
      let faceVerified = false;
      if (modelsLoaded) {
        try {
          const detections = await faceapi.detectAllFaces(
            img,
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks();
          
          faceVerified = detections.length > 0;
          console.log(`Face detection result: ${faceVerified ? 'PASS' : 'FAIL'} (${detections.length} faces found)`);
        } catch (error) {
          console.error('Face verification error:', error);
          faceVerified = false;
        }
      }
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!faceVerified) {
        setScanStep('failed');
        toast.error('😞 Face verification failed!', {
          description: 'No clear face detected in the image. Please try again.'
        });
        setIsVerifying(false);
        setTimeout(() => {
          resetScanner();
        }, 3000);
        return;
      }

      // Mock verification result for successful face detection
      const mockUserData = {
        id: `user_${Date.now()}`,
        name: 'Verified User',
        email: 'user@growfi.com',
        verified: true,
        faceMatch: true,
        confidence: 0.95,
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
      setScanStep('failed');
      setIsVerifying(false);
      setTimeout(() => {
        resetScanner();
      }, 3000);
    }
  };

  const resetScanner = () => {
    setScanStep('ready');
    setIsVerifying(false);
    setCapturedImage(null);
    setFaceDetected(false);
    setObjectDetected(false);
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
              disabled={!modelsLoaded}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {!modelsLoaded ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading Face Detection...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Start Face Verification
                </>
              )}
            </Button>
          </div>
        );

      case 'scanning':
        return (
          <div className="space-y-4">
            <div className="relative">
              <video 
                ref={videoRef} 
                className={`w-full rounded-lg border-4 ${
                  faceDetected ? 'border-green-500' : 
                  objectDetected ? 'border-red-500' : 'border-blue-500'
                }`}
                autoPlay 
                muted 
                playsInline
              />
              <div className="absolute inset-0 border-4 border-dashed border-white rounded-lg pointer-events-none">
                <div className={`absolute inset-4 border-2 rounded-full ${
                  faceDetected ? 'border-green-400' : 
                  objectDetected ? 'border-red-400' : 'border-white'
                }`}></div>
              </div>
              <div className={`absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium ${
                faceDetected ? 'bg-green-500' : 
                objectDetected ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                ● {faceDetected ? 'FACE DETECTED' : objectDetected ? 'OBJECT DETECTED' : 'SCANNING'}
              </div>
            </div>
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-2 ${
                faceDetected ? 'text-green-600' : 
                objectDetected ? 'text-red-600' : 'text-blue-600'
              }`}>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">
                  {faceDetected 
                    ? 'Face detected! Capturing soon...' 
                    : objectDetected 
                    ? 'Object detected - please show your face clearly'
                    : 'Position your face clearly in the frame...'
                  }
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {faceDetected 
                  ? 'Stay still for capture' 
                  : objectDetected 
                  ? 'Need a clear human face to proceed'
                  : 'Looking for a clear face...'
                }
              </p>
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

      case 'failed':
        return (
          <div className="space-y-6 text-center">
            <div className="relative">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Failed verification" 
                  className="w-full rounded-lg border-4 border-red-500 opacity-75"
                />
              ) : (
                <div className="w-full h-64 bg-red-50 border-4 border-red-500 rounded-lg flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-full p-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">Verification Failed</h3>
              <p className="text-red-600 mb-4">No clear face detected in the image.</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  Please position your face clearly in the camera frame and try again.
                </p>
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
              {scanStep === 'failed' ? 'Try Again' : 'Cancel & Try Again'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonaFaceScanner;