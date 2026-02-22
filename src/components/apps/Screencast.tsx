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

  const connectToDevice = async (deviceId: string) => {
    // REAL HARDWARE CASTING LOGIC
    // Using the Presentation API to request a session on a real external screen
    try {
      if ('PresentationRequest' in window) {
        // We request a presentation of the root OS or a specialized receiver page
        const request = new (window as any).PresentationRequest(['/']);
        
        setConnectingId(deviceId);
        playSound('click');

        const session = await request.start();
        
        setConnectingId(null);
        setActiveDeviceId(deviceId);
        addNotification("Real Cast Active", "Workspace projected to external hardware.", "app");
        playSound('notify');

        session.onterminate = () => {
          disconnect();
        };
      } else {
        // Fallback for browsers without Presentation API support (Simulated)
        setConnectingId(deviceId);
        setTimeout(() => {
          setConnectingId(null);
          setActiveDeviceId(deviceId);
          addNotification("Cast Active (Simulated)", `Projecting to ${deviceId}.`, "app");
        }, 2000);
      }
    } catch (err) {
      console.error("Casting failed:", err);
      setConnectingId(null);
      addNotification("Casting Failed", "Could not establish hardware link.", "security");
    }
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
      <div className="p-6 bg-gradient-to-br from-accent/20 to-primary/40 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg border border-accent/40">
              <Cast className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">Nebula Cast</h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Real Hardware Projection</p>
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
                  <p className="text-xs font-bold text-white">Cast Active</p>
                  <p className="text-[10px] text-white/40">Hardware Link established</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={disconnect} className="h-8 text-[10px] font-bold uppercase">
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="w-full h-12 bg-accent text-primary-foreground font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-accent/20"
          >
            {isScanning ? "Searching for screens..." : "Discover Devices"}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-6 relative">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">External Displays</h3>
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
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{device.name}</h4>
                    <span className="text-[9px] font-black uppercase text-accent">{device.status}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={device.status === 'offline' || !!activeDeviceId || !!connectingId}
                  onClick={() => connectToDevice(device.id)}
                  className="h-8 text-[10px] font-black uppercase border border-white/10"
                >
                  {connectingId === device.id ? "Linking..." : "Project"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
