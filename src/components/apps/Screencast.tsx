"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Tv, Search, RefreshCw, CheckCircle2, ShieldCheck, Zap, Monitor, Cast, Laptop, Smartphone, AlertCircle, X, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Device {
  id: string;
  name: string;
  type: 'tv' | 'monitor' | 'glasses';
  status: 'available' | 'connected' | 'offline';
  signal: number;
}

const MOCK_DEVICES: Device[] = [
  { id: 'dev-1', name: 'Living Room TV', type: 'tv', status: 'available', signal: 85 },
  { id: 'dev-2', name: 'Studio Pro Monitor', type: 'monitor', status: 'available', signal: 98 },
  { id: 'dev-3', name: 'Nebula Vision X1', type: 'glasses', status: 'available', signal: 72 },
  { id: 'dev-4', name: 'Bedroom Display', type: 'tv', status: 'offline', signal: 0 },
];

export const Screencast: React.FC = () => {
  const { addNotification, playSound, setCurrentDisplayId } = useOS();
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  const startScan = () => {
    setIsScanning(true);
    playSound('click');
    setTimeout(() => {
      setIsScanning(false);
      addNotification("Scan Complete", `${devices.filter(d => d.status !== 'offline').length} devices found.`, "app");
    }, 3000);
  };

  const connectToDevice = (deviceId: string) => {
    setConnectingId(deviceId);
    playSound('click');
    
    setTimeout(() => {
      setConnectingId(null);
      setActiveDeviceId(deviceId);
      const device = devices.find(d => d.id === deviceId);
      
      // Simulate system display change
      const targetDisplay = (devices.indexOf(device!) % 3 + 1).toString();
      setCurrentDisplayId(targetDisplay);
      
      addNotification("Cast Active", `Streaming to ${device?.name}.`, "app");
      playSound('notify');
    }, 2000);
  };

  const disconnect = () => {
    setActiveDeviceId(null);
    setCurrentDisplayId('1');
    addNotification("Cast Ended", "Streaming session terminated.", "system");
    playSound('close');
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'tv': return <Tv size={20} />;
      case 'monitor': return <Monitor size={20} />;
      case 'glasses': return <Zap size={20} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] overflow-hidden">
      {/* App Header */}
      <div className="p-6 bg-gradient-to-br from-accent/20 to-primary/40 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg border border-accent/40">
              <Cast className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">Nebula Cast</h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Display Projection Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/20">
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Network Secure</span>
            </div>
          </div>
        </div>

        {activeDeviceId ? (
          <div className="bg-black/40 rounded-2xl p-4 border border-accent/40 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent animate-pulse">
                  <RefreshCw size={16} className="animate-spin-slow" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Streaming to {devices.find(d => d.id === activeDeviceId)?.name}</p>
                  <p className="text-[10px] text-white/40">Latency: 12ms • 4K HDR</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={disconnect} className="h-8 text-[10px] font-bold uppercase">
                Stop Casting
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="w-full h-12 bg-accent text-primary-foreground font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-accent/20"
          >
            {isScanning ? (
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="animate-spin" />
                Searching for screens...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search size={18} />
                Discover Devices
              </div>
            )}
          </Button>
        )}
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-6 relative">
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0f14]/60 backdrop-blur-sm pointer-events-none">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-2 border-accent/40 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-4 border-2 border-accent/40 rounded-full animate-ping opacity-40 delay-100" />
              <div className="absolute inset-8 border-2 border-accent/40 rounded-full animate-ping opacity-60 delay-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="text-accent animate-pulse" size={48} />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nearby Screens</h3>
            <span className="text-[9px] font-mono text-white/20">Found {devices.length}</span>
          </div>

          <div className="grid gap-3">
            {devices.map(device => (
              <div 
                key={device.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex items-center justify-between group",
                  device.status === 'offline' ? "opacity-40 border-white/5 bg-black/20" : "bg-white/5 border-white/10 hover:border-accent/40",
                  activeDeviceId === device.id && "border-accent bg-accent/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    device.status === 'offline' ? "bg-white/5 text-white/20" : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary-foreground"
                  )}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors">{device.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        device.status === 'available' ? "text-green-500" : device.status === 'offline' ? "text-white/20" : "text-accent"
                      )}>
                        {device.status}
                      </span>
                      {device.status !== 'offline' && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={cn("w-1 h-2 rounded-full", i <= Math.ceil(device.signal / 25) ? "bg-accent" : "bg-white/10")} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {activeDeviceId === device.id ? (
                  <CheckCircle2 size={20} className="text-accent" />
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={device.status === 'offline' || !!activeDeviceId || !!connectingId}
                    onClick={() => connectToDevice(device.id)}
                    className="h-8 text-[10px] font-black uppercase hover:bg-accent hover:text-primary-foreground border border-white/10"
                  >
                    {connectingId === device.id ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      "Project"
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="bg-accent/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">Protocol Intelligence</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                Nebula Cast uses peer-to-peer quantum encryption to ensure your streaming data never leaves your local network. No external servers required.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-accent" />
          <span className="text-[9px] font-bold text-white/20 uppercase">Encrypted Projection</span>
        </div>
        <button className="text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">
          Discovery Options
        </button>
      </div>
    </div>
  );
};