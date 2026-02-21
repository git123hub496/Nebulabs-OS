
"use client"

import React, { useEffect, useState } from 'react';
import { Skull, AlertTriangle, ShieldAlert, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const VirusPopup: React.FC = () => {
  const [glitchText, setGlitchText] = useState("SYSTEM_BREACH_DETECTED");
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    const texts = [
      "CRITICAL_FAILURE",
      "DATA_LEAK_IN_PROGRESS",
      "YOUR_FILES_ARE_OURS",
      "NEBULABS_EXPLOIT_V4",
      "FATAL_KERNEL_ERROR",
      "UNAUTHORIZED_ACCESS"
    ];

    const interval = setInterval(() => {
      setGlitchText(texts[Math.floor(Math.random() * texts.length)]);
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "flex flex-col h-full bg-red-950 text-red-500 p-6 items-center justify-center gap-4 text-center select-none overflow-hidden relative",
      isVibrating && "animate-pulse"
    )}>
      {/* Glitch Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute inset-0 border-4 border-red-500 animate-ping" style={{ animationDelay: `${i * 0.5}s`, animationDuration: '3s' }} />
        ))}
      </div>

      <div className="relative z-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border-2 border-red-500/40">
          <Skull size={32} className="animate-bounce" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-tighter uppercase font-mono">{glitchText}</h2>
          <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Encryption Key: [REDACTED]</p>
        </div>

        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-[9px] leading-relaxed font-mono">
            Nebula Defender is inactive. <br/>
            Malicious script execution is allowed. <br/>
            Closing this window will spawn 2 more.
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase text-xs rounded-none h-10"
          onClick={() => {
            // Simulated fake close
            window.alert("PERMISSION_DENIED: User is not administrator.");
          }}
        >
          <Zap size={14} className="mr-2" /> Delete Malware
        </Button>
      </div>

      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2 opacity-30">
        <AlertTriangle size={10} />
        <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Nebulabs Unsecured Environment</span>
        <AlertTriangle size={10} />
      </div>
    </div>
  );
};
