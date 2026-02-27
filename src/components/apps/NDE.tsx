
"use client"

import React, { useState, useEffect } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { 
  Code2, 
  Cpu, 
  Activity, 
  Zap, 
  Shield, 
  Database, 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Sliders, 
  Monitor, 
  Box, 
  ChevronRight,
  Braces,
  Settings,
  Layout,
  Skull
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type NDETab = 'tweaks' | 'processes' | 'diagnostics' | 'registry';

export const NDE: React.FC = () => {
  const { 
    globalScale, setGlobalScale, 
    taskbarSize, setTaskbarSize, 
    iconSize, setIconSize,
    openWindows, closeWindow, 
    systemStats, setSystemStats,
    theme, accentColor,
    factoryReset,
    openApp
  } = useOS();

  const [activeTab, setActiveTab] = useState<NDETab>('tweaks');
  const [logs, setLogs] = useState<string[]>(["NDE Kernel v1.0.4 initialized.", "Hardware-accelerated dev mode active."]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "Memory partition clean",
        "GC collected 14 orphan objects",
        "Z-Index re-indexed",
        "Scaling matrix re-calibrated",
        "Telemetry ping: OK"
      ];
      if (Math.random() > 0.8) {
        setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 20));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full bg-[#0a0f14] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 bg-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg border border-accent/40">
              <Code2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic">NDE</h1>
              <p className="text-[9px] font-bold text-accent uppercase tracking-widest">Nebula Dev Env</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-1">
          {[
            { id: 'tweaks', label: 'Kernel Tweaks', icon: Sliders },
            { id: 'processes', label: 'Process Manager', icon: Activity },
            { id: 'diagnostics', label: 'Diagnostics', icon: Zap },
            { id: 'registry', label: 'Registry Edit', icon: Database },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NDETab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-xs font-bold uppercase tracking-widest",
                activeTab === tab.id ? "bg-accent text-primary-foreground shadow-lg shadow-accent/20" : "text-white/40 hover:bg-white/5"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl border-white/10 gap-2 text-[10px] font-black uppercase"
            onClick={() => openApp('terminal', 'Terminal')}
          >
            <Terminal size={14} /> Open Shell
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-white/5 bg-black/20 flex items-center px-8 justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              {activeTab === 'tweaks' && "Kernel Variable Injection"}
              {activeTab === 'processes' && "Active Process Table"}
              {activeTab === 'diagnostics' && "System Telemetry Overrides"}
              {activeTab === 'registry' && "NVRAM Registry Access"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/20">
              <span className="text-[9px] font-black text-green-500 uppercase">Secure Dev Bridge</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'tweaks' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor size={16} className="text-accent" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Display Matrices</h3>
                  </div>
                  
                  <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                        <span>Global Scale Factor</span>
                        <span className="text-accent">{(globalScale * 100).toFixed(0)}%</span>
                      </div>
                      <Slider value={[globalScale * 100]} min={50} max={200} step={5} onValueChange={(v) => setGlobalScale(v[0] / 100)} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                        <span>Taskbar Vertical Span</span>
                        <span className="text-accent">{taskbarSize}px</span>
                      </div>
                      <Slider value={[taskbarSize]} min={0} max={200} step={1} onValueChange={(v) => setTaskbarSize(v[0])} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                        <span>Icon Scaling</span>
                        <span className="text-accent">{iconSize}%</span>
                      </div>
                      <Slider value={[iconSize]} min={50} max={300} step={10} onValueChange={(v) => setIconSize(v[0])} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => { setGlobalScale(1.0); setTaskbarSize(48); setIconSize(100); }} variant="outline" className="h-12 border-accent/20 text-accent font-black uppercase text-[10px] rounded-xl hover:bg-accent/10">
                    <RefreshCw size={14} className="mr-2" /> Reset Matrices
                  </Button>
                  <Button onClick={() => openApp('settings', 'Settings')} variant="outline" className="h-12 border-white/10 text-white/40 font-black uppercase text-[10px] rounded-xl hover:bg-white/10">
                    <Settings size={14} className="mr-2" /> System Preferences
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'processes' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left text-[10px] font-bold uppercase tracking-widest">
                    <thead className="bg-black/40 border-b border-white/5 text-white/20">
                      <tr>
                        <th className="px-6 py-4">PID / App</th>
                        <th className="px-6 py-4 text-center">Z-Index</th>
                        <th className="px-6 py-4 text-center">Screen</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {openWindows.map(win => (
                        <tr key={win.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                {React.createElement(APP_INFO[win.appId].icon, { size: 14 })}
                              </div>
                              <div>
                                <div className="text-white">{win.title}</div>
                                <div className="text-[8px] opacity-40 font-mono">{win.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-accent font-mono">{win.zIndex}</td>
                          <td className="px-6 py-4 text-center">{win.displayId}</td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => closeWindow(win.id)} className="p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {openWindows.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-white/20 italic">No active processes detected.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'diagnostics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-accent" />
                      <span className="text-[10px] font-black uppercase text-white/40">CPU Load</span>
                    </div>
                    <div className="text-2xl font-black text-white">{systemStats.cpu}%</div>
                    <Slider value={[systemStats.cpu]} max={100} onValueChange={(v) => setSystemStats({ cpu: v[0] })} />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Box size={14} className="text-accent" />
                      <span className="text-[10px] font-black uppercase text-white/40">RAM Allocation</span>
                    </div>
                    <div className="text-2xl font-black text-white">{systemStats.ram}%</div>
                    <Slider value={[systemStats.ram]} max={100} onValueChange={(v) => setSystemStats({ ram: v[0] })} />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-accent" />
                      <span className="text-[10px] font-black uppercase text-white/40">NET Bridge</span>
                    </div>
                    <div className="text-2xl font-black text-white">{systemStats.net} Mb/s</div>
                    <Slider value={[systemStats.net]} max={1000} onValueChange={(v) => setSystemStats({ net: v[0] })} />
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-[10px] text-green-500/60 h-48 overflow-hidden space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={cn(i === 0 ? "text-green-400 font-bold" : "")}>
                      [{new Date().toLocaleTimeString()}] {' > '} {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'registry' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-[2rem] text-center space-y-6">
                  <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto border border-destructive/40">
                    <Skull className="text-destructive" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tighter">Emergency Kernel Wipe</h3>
                    <p className="text-xs text-white/40 font-medium leading-relaxed max-w-sm mx-auto">
                      Performing a factory reset erases all identity partitions, virtual file systems, and hardware signatures. This cannot be undone.
                    </p>
                  </div>
                  <Button onClick={factoryReset} variant="destructive" className="h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-destructive/20">
                    Initialize Deep Powerwash
                  </Button>
                </div>

                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                      <Layout size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase">Start Menu Registry</h4>
                      <p className="text-[10px] text-white/40">Clear manually cached layouts</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white/40 font-bold text-[10px] uppercase h-9 rounded-lg" onClick={() => localStorage.removeItem('nebula_start_layout')}>
                    Purge Layout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
