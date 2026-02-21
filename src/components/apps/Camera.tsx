
"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, RotateCcw, Image as ImageIcon, ShieldCheck, AlertCircle, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const Camera: React.FC = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { importFile } = useOS();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Clean up stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        const fileName = `nebula_shot_${Date.now()}.png`;
        
        // Flash animation
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);

        // Import to virtual file system
        importFile(fileName, dataUrl, Math.round(dataUrl.length * 0.75), null);
        
        toast({
          title: "Capture Successful",
          description: `Saved as ${fileName} in Nebula Drive.`,
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] overflow-hidden relative">
      {/* App Toolbar */}
      <div className="h-12 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <CameraIcon size={16} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">Nebula Vision v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-green-500" />
          <span className="text-[10px] font-bold text-white/40 uppercase">Hardware Link Active</span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-4">
        {/* Flash Effect Overlay */}
        <div className={cn(
          "absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150",
          isFlashing ? "opacity-100" : "opacity-0"
        )} />

        <div className="relative w-full h-full max-w-2xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            playsInline
          />
          
          {/* Overlay Focus UI */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-white/20 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-accent rounded-full" />
            </div>
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/40" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/40" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/40" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/40" />
          </div>

          {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 text-center">
              <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-destructive/40">
                  <AlertCircle size={32} className="text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-white">Hardware Locked</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Nebula OS cannot access your physical imaging hardware. Please verify system permissions in your browser bar.
                </p>
                <Button variant="outline" className="border-white/10 text-white/60 hover:text-white" onClick={() => window.location.reload()}>
                  Re-initialize Kernel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-black/60 border-t border-white/5 flex items-center justify-center gap-12 px-8 shrink-0 z-20">
        <button 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all active:scale-95"
          onClick={() => window.location.reload()}
          title="Reset Camera"
        >
          <RotateCcw size={18} />
        </button>

        <button 
          className="group relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl transition-all active:scale-90 disabled:opacity-50 disabled:scale-100"
          onClick={capturePhoto}
          disabled={!hasCameraPermission}
        >
          <div className="absolute inset-1 rounded-full border-2 border-black/10 group-hover:border-black/20 transition-all" />
          <div className="w-12 h-12 rounded-full border-4 border-black/5" />
        </button>

        <button 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all active:scale-95"
          title="Gallery (Open Nebula Drive)"
        >
          <ImageIcon size={18} />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
