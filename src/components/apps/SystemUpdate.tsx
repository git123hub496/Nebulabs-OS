
"use client"

import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Loader2, Cpu, ShieldCheck, Zap, Info, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useOS } from '@/context/os-context';

type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'installing' | 'restart-pending' | 'finished';

const UPDATE_LOGS = [
  "Fetching patch metadata from Nebula Central...",
  "Verifying virtual hardware signatures...",
  "Downloading build build_nebula_5.0.2_stable...",
  "Patching security vulnerabilities in BIOS v4.5...",
  "Optimizing virtual kernel compute cycles...",
  "Updating system icon cache...",
  "Calibrating multi-display bridge interface...",
  "Applying UI transparency optimizations...",
  "Finalizing system registry changes...",
  "Update successfully staged for deployment."
];

export const SystemUpdate: React.FC = () => {
  const { restart } = useOS();
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [hasUpdateFound, setHasUpdateFound] = useState<boolean | null>(null);

  useEffect(() => {
    let interval: any;
    if (status === 'checking') {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            // Simulate randomized update availability
            const found = Math.random() > 0.5;
            setHasUpdateFound(found);
            
            if (found) {
              setStatus('downloading');
              return 0;
            } else {
              setStatus('finished');
              return 100;
            }
          }
          return p + 10;
        });
      }, 300);
    } else if (status === 'downloading') {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('installing');
            return 0;
          }
          return p + 2;
        });
      }, 100);
    } else if (status === 'installing') {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('restart-pending');
            return 100;
          }
          return p + 1;
        });
      }, 150);
    }

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'idle' && status !== 'finished' && status !== 'restart-pending') {
      const logInterval = setInterval(() => {
        const randomLog = UPDATE_LOGS[Math.floor(Math.random() * UPDATE_LOGS.length)];
        setLogs(prev => [randomLog, ...prev].slice(0, 8));
      }, 1200);
      return () => clearInterval(logInterval);
    }
  }, [status]);

  const startUpdate = () => {
    setStatus('checking');
    setProgress(0);
    setHasUpdateFound(null);
    setLogs(["Initiating system integrity check..."]);
  };

  return (
    <div className="flex flex-col h-full bg-[#161d25] p-8 gap-8">
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center shadow-2xl">
          <RefreshCw className={cn("text-accent", (status !== 'idle' && status !== 'finished' && status !== 'restart-pending') ? "animate-spin" : "")} size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Nebula Update</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Stable Channel Build 4.5.2</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-bold text-sm">
                {status === 'idle' && "System ready for update check"}
                {status === 'checking' && "Searching for updates..."}
                {status === 'downloading' && "Downloading Nebula Core 5.0..."}
                {status === 'installing' && "Installing system patches..."}
                {status === 'restart-pending' && "Update Staged: Restart Required"}
                {status === 'finished' && (hasUpdateFound === false ? "System is up to date" : "Update Successful")}
              </h2>
              <p className="text-[10px] text-white/40">Last checked: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {status === 'finished' && <CheckCircle2 className="text-green-500" size={24} />}
            {status === 'restart-pending' && <Power className="text-accent animate-pulse" size={24} />}
          </div>

          {(status !== 'idle' && status !== 'finished' && status !== 'restart-pending') && (
            <div className="space-y-3">
              <Progress value={progress} className="h-2 bg-white/5" />
              <div className="flex justify-between text-[9px] font-mono text-accent uppercase font-bold tracking-tighter">
                <span>{status === 'checking' ? 'Connecting to Cluster...' : 'Processing...'}</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <Button onClick={startUpdate} className="w-full bg-accent text-primary font-bold h-12 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-accent/10">
              Check for Updates
            </Button>
          )}

          {status === 'restart-pending' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
                <Info className="text-accent shrink-0" size={18} />
                <p className="text-xs text-accent font-medium">To complete the installation of Nebula Core 5.0, a system restart is required.</p>
              </div>
              <Button onClick={() => restart()} className="w-full bg-accent text-primary font-black h-12 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20 gap-2">
                <Power size={18} /> Restart Now
              </Button>
            </div>
          )}

          {status === 'finished' && hasUpdateFound === false && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <Info className="text-blue-400 shrink-0" size={18} />
              <p className="text-xs text-blue-400 font-medium">Your hardware is running the latest stable build. No updates required.</p>
            </div>
          )}

          {(status === 'finished' || status === 'restart-pending') && hasUpdateFound !== false && (
            <div className="grid grid-cols-3 gap-3 pt-2 animate-in fade-in zoom-in-95">
              <div className="p-3 bg-accent/5 border border-accent/10 rounded-xl text-center">
                <ShieldCheck size={16} className="text-accent mx-auto mb-2" />
                <p className="text-[9px] font-bold text-white/60">Secure</p>
              </div>
              <div className="p-3 bg-accent/5 border border-accent/10 rounded-xl text-center">
                <Cpu size={16} className="text-accent mx-auto mb-2" />
                <p className="text-[9px] font-bold text-white/60">Optimized</p>
              </div>
              <div className="p-3 bg-accent/5 border border-accent/10 rounded-xl text-center">
                <Zap size={16} className="text-accent mx-auto mb-2" />
                <p className="text-[9px] font-bold text-white/60">V5.0 Core</p>
              </div>
            </div>
          )}
        </div>

        {(status !== 'idle' && status !== 'finished' && status !== 'restart-pending') && (
          <div className="flex-1 bg-black/40 rounded-xl p-4 font-mono text-[10px] text-white/30 space-y-1 overflow-hidden border border-white/5 shadow-inner">
            {logs.map((log, i) => (
              <div key={i} className={cn("flex gap-2", i === 0 ? "text-accent font-bold" : "")}>
                <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className="truncate">{log}</span>
              </div>
            ))}
          </div>
        )}

        {(status === 'finished' || status === 'restart-pending') && hasUpdateFound !== false && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-[10px] font-black uppercase text-accent tracking-widest">Build Highlights</h3>
            <ScrollArea className="h-32 rounded-xl bg-white/5 p-4 border border-white/5">
              <ul className="space-y-2 text-[11px] text-white/60">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Added virtual threading support for background notifications.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Enhanced multi-display edge-hopping coordinate precision.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Updated File Explorer with native image rendering engine.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Optimized boot sequence for high-DPI virtual monitors.
                </li>
              </ul>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-[9px] text-white/20">Nebulabs Firmware Update Utility v4.5 • © 2026</p>
      </div>
    </div>
  );
};
