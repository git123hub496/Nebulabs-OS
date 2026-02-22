
"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Layers, ShieldAlert, Cpu, Terminal, RefreshCw, Power, Zap, Activity, Info, Globe, Monitor, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface OSImage {
  id: string;
  name: string;
  description: string;
  url: string;
  color: string;
}

const OS_IMAGES: OSImage[] = [
  { 
    id: 'macos', 
    name: 'macOS Web Edition', 
    description: 'A high-fidelity simulation of the macOS desktop environment.',
    url: 'https://macos.vercel.app/',
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  { 
    id: 'thomson', 
    name: 'Thomson Desktop', 
    description: 'A professional dark-themed virtual workspace suite.',
    url: 'https://lttthedev.github.io/desktop.html',
    color: 'from-zinc-500/20 to-black/20'
  }
];

export const NebulaV: React.FC = () => {
  const { biosSettings, restart } = useOS();
  const [status, setStatus] = useState<'idle' | 'initializing' | 'running'>('idle');
  const [bootProgress, setBootProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedOs, setSelectedOs] = useState<OSImage | null>(null);
  const [iframeLoading, setIframeLoading] = useState(false);

  const isHardwareSupported = biosSettings.virtualization;

  const startVm = () => {
    if (!isHardwareSupported) return;
    setStatus('initializing');
    setBootProgress(0);
    setLogs(["Hypervisor link established.", "Mapping guest memory (4GB reserved)..."]);
  };

  useEffect(() => {
    if (status === 'initializing') {
      const interval = setInterval(() => {
        setBootProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('running');
            return 100;
          }
          return p + 2;
        });
      }, 50);

      const logInterval = setInterval(() => {
        const bootLogs = [
          "Loading nested kernel...",
          "Checking microcode revision...",
          "Allocating virtual IO ports...",
          "Initializing guest display driver...",
          "Nebula-V Kernel v1.0.2 ready."
        ];
        setLogs(prev => [bootLogs[Math.floor(Math.random() * bootLogs.length)], ...prev].slice(0, 5));
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [status]);

  const handleSelectOs = (os: OSImage) => {
    setIframeLoading(true);
    setSelectedOs(os);
  };

  if (!isHardwareSupported) {
    return (
      <div className="flex flex-col h-full bg-[#0a0f14] items-center justify-center p-12 text-center space-y-8">
        <div className="w-24 h-24 rounded-[2rem] bg-destructive/10 border border-destructive/20 flex items-center justify-center animate-pulse">
          <ShieldAlert className="text-destructive" size={48} />
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hardware Restricted</h2>
          <p className="text-sm text-white/40 leading-relaxed font-medium">
            Nebula-V requires native virtualization support. The "Virtualization Technology" flag is currently DISABLED in your system BIOS.
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent tracking-widest">
            <Info size={12} />
            Instructions
          </div>
          <p className="text-[11px] text-white/60">1. Restart Nebula WebOS<br/>2. Press 'B' during boot sequence<br/>3. Enable 'Virtualization Technology' in Advanced menu<br/>4. Save and Exit</p>
        </div>
        <Button variant="outline" className="border-white/10 text-white/60 hover:text-white" onClick={() => restart()}>
          <RefreshCw size={16} className="mr-2" /> Restart to BIOS
        </Button>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="flex flex-col h-full bg-[#161d25] p-12 items-center justify-center space-y-8">
        <div className="w-32 h-32 rounded-[2.5rem] bg-accent/20 border border-accent/20 flex items-center justify-center shadow-2xl">
          <Layers className="text-accent" size={64} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white">Nebula-V Hypervisor</h1>
          <p className="text-sm text-white/40 uppercase tracking-[0.3em] font-bold">Virtual Workspace Engine</p>
        </div>
        <Button 
          onClick={startVm}
          className="h-14 px-12 bg-accent text-primary-foreground font-black text-lg rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-accent/20 gap-3"
        >
          <Power size={20} /> Initialize Instance
        </Button>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg pt-8 border-t border-white/5">
          <div className="text-center space-y-1">
            <Cpu size={16} className="text-white/20 mx-auto" />
            <p className="text-[10px] font-bold text-white/40 uppercase">Virtual Core</p>
          </div>
          <div className="text-center space-y-1">
            <Zap size={16} className="text-white/20 mx-auto" />
            <p className="text-[10px] font-bold text-white/40 uppercase">Isolator Active</p>
          </div>
          <div className="text-center space-y-1">
            <Activity size={16} className="text-white/20 mx-auto" />
            <p className="text-[10px] font-bold text-white/40 uppercase">Ready</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'initializing') {
    return (
      <div className="flex flex-col h-full bg-[#0a0f14] items-center justify-center p-12 space-y-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-accent">
            <span>Staging Virtual Kernel</span>
            <span>{bootProgress}%</span>
          </div>
          <Progress value={bootProgress} className="h-1 bg-white/5" />
          <div className="bg-black/40 rounded-xl p-4 h-32 font-mono text-[10px] text-green-500/60 overflow-hidden border border-white/5 space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={cn(i === 0 ? "text-green-400 font-bold" : "")}>
                {'>'} {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden relative group">
      {/* Nested OS Top Bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Layers size={14} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">
            Nebula-V Virtual Instance {selectedOs ? `• ${selectedOs.name}` : ''}
          </span>
        </div>
        <div className="flex gap-4">
          {selectedOs && (
            <button 
              className="text-[9px] font-bold text-accent hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
              onClick={() => setSelectedOs(null)}
            >
              <RefreshCw size={10} /> Switch Instance
            </button>
          )}
          <span className="text-[9px] font-mono text-green-500 uppercase font-bold animate-pulse">Running</span>
          <button className="text-[9px] font-bold text-white/20 hover:text-red-500 uppercase tracking-widest" onClick={() => setStatus('idle')}>Shutdown</button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 relative bg-[#0d0d0d] overflow-hidden">
        {!selectedOs ? (
          <div className="h-full flex flex-col items-center justify-center p-8 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Select Virtual Image</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Mount a guest operating system to the isolated core</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
              {OS_IMAGES.map(os => (
                <button 
                  key={os.id}
                  onClick={() => handleSelectOs(os)}
                  className={cn(
                    "relative group p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-4 overflow-hidden bg-gradient-to-br",
                    os.color,
                    "border-white/10 hover:border-accent/40 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-accent/40 transition-colors">
                    <Monitor className="text-white/60 group-hover:text-accent transition-colors" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{os.name}</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 uppercase font-medium tracking-wide">{os.description}</p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest">Load Image</span>
                    <ChevronRight size={14} className="text-accent" />
                  </div>
                  {/* Decorative background logo */}
                  <Layers className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 group-hover:text-accent/5 transition-colors" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[9px] text-white/20 font-mono uppercase tracking-[0.2em]">
              <ShieldCheck size={12} />
              Hyper-Isolated Environment Ready
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative bg-white">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0d0d0d] text-white/40 gap-4">
                <RefreshCw size={32} className="animate-spin text-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Mounting Virtual File System...</span>
              </div>
            )}
            <iframe 
              src={selectedOs.url}
              className="w-full h-full border-none bg-black"
              onLoad={() => setIframeLoading(false)}
              title={selectedOs.name}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
            
            {/* Security Overlay for "Blocked" detection helper */}
            <div className="absolute top-4 right-4 pointer-events-none group/info">
              <div className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/40 hover:text-white transition-colors cursor-help pointer-events-auto">
                <Info size={14} />
              </div>
              <div className="absolute right-0 top-10 w-48 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] text-white/60 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none">
                This image is running in an isolated hardware tunnel. If the screen is blank, the host may restrict nested iframes.
                <a href={selectedOs.url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-accent font-bold hover:underline">
                  Launch Host Externally <ExternalLink size={10} className="inline ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 border-[20px] border-accent/5 pointer-events-none" />
    </div>
  );
};
