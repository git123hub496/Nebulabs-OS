
"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Layers, ShieldAlert, Cpu, Terminal, RefreshCw, Power, Zap, Activity, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export const NebulaV: React.FC = () => {
  const { biosSettings, restart } = useOS();
  const [status, setStatus] = useState<'idle' | 'initializing' | 'running'>('idle');
  const [bootProgress, setBootProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

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
                {">"} {log}
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
      <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={12} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">Nebula-V Nested Instance #01</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[9px] font-mono text-green-500 uppercase font-bold animate-pulse">Running</span>
          <button className="text-[9px] font-bold text-white/20 hover:text-red-500 uppercase tracking-widest" onClick={() => setStatus('idle')}>Shutdown</button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#0d0d0d] p-8 overflow-hidden">
        {/* Mock Nested Desktop */}
        <div className="w-full h-full border border-white/10 rounded-2xl relative flex flex-col shadow-inner overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="flex-1 flex flex-col p-8 space-y-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white/80">Guest Environment</h2>
                <p className="text-xs text-white/20 font-bold uppercase">Isolated Virtual Core</p>
              </div>
              <Activity size={32} className="text-accent/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent">
                  <Terminal size={12} /> Sandbox Shell
                </div>
                <div className="font-mono text-[11px] text-green-500/80 h-24 overflow-hidden">
                  nebula@guest:~$ help<br/>
                  Commands: ls, network, info, status<br/>
                  nebula@guest:~$ status<br/>
                  Virtual Thread: ACTIVE<br/>
                  nebula@guest:~$ _
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent">
                  <Cpu size={12} /> Telemetry
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>GUEST_LOAD</span>
                    <span>12%</span>
                  </div>
                  <Progress value={12} className="h-1 bg-white/5" />
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>IO_THROUGHPUT</span>
                    <span>850 MB/s</span>
                  </div>
                  <Progress value={65} className="h-1 bg-white/5" />
                </div>
              </div>
            </div>
          </div>

          <div className="h-10 bg-black/40 border-t border-white/5 flex items-center px-4 justify-between mt-auto">
             <div className="flex gap-2">
               <div className="w-4 h-4 rounded bg-accent/20" />
               <div className="w-4 h-4 rounded bg-white/10" />
               <div className="w-4 h-4 rounded bg-white/10" />
             </div>
             <span className="text-[9px] font-mono text-white/20">INSTANCE_UID: NEB-V-X99</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-[20px] border-accent/5 pointer-events-none" />
    </div>
  );
};
