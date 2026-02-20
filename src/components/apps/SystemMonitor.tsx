"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Activity, Cpu, HardDrive, Network, Zap } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SystemMonitor: React.FC = () => {
  const { systemStats } = useOS();
  const [history, setHistory] = useState<{ cpu: number; ram: number; net: number; time: string }[]>([]);

  useEffect(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistory(prev => {
      const updated = [...prev, { ...systemStats, time }];
      if (updated.length > 20) return updated.slice(1);
      return updated;
    });
  }, [systemStats]);

  return (
    <div className="flex flex-col h-full bg-[#0f1419] p-6 gap-6 overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Activity className="text-accent" size={24} />
          <div>
            <h2 className="text-xl font-bold">System Telemetry</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Real-time Performance Metrics</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] text-white/20 uppercase font-bold">Uptime</p>
            <p className="text-xs font-mono text-accent">2h 45m 12s</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/20 uppercase font-bold">Kernel</p>
            <p className="text-xs font-mono text-accent">Nebula-Core v4.2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/5 shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Cpu size={14} className="text-accent" /> CPU Load
            </CardTitle>
            <span className="text-xl font-black text-accent">{systemStats.cpu}%</span>
          </CardHeader>
          <CardContent className="h-32 p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="cpu" stroke="var(--accent)" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/5 shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Zap size={14} className="text-accent" /> Memory Usage
            </CardTitle>
            <span className="text-xl font-black text-accent">{systemStats.ram}%</span>
          </CardHeader>
          <CardContent className="h-32 p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="ram" stroke="var(--accent)" fillOpacity={1} fill="url(#colorRam)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/5 shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-2">
              <Network size={14} className="text-accent" /> Network Traffic
            </CardTitle>
            <span className="text-xl font-black text-accent">{systemStats.net} Mb/s</span>
          </CardHeader>
          <CardContent className="h-32 p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="net" stroke="var(--accent)" fillOpacity={1} fill="url(#colorNet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 min-h-[300px]">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <HardDrive size={14} className="text-accent" /> Unified Logic Core Performance
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }}
            />
            <Line type="monotone" dataKey="cpu" stroke="var(--accent)" strokeWidth={3} dot={false} animationDuration={300} />
            <Line type="monotone" dataKey="ram" stroke="rgba(255,255,255,0.2)" strokeWidth={2} dot={false} animationDuration={300} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">CPU Compute</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/20 rounded-full" />
            <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Virtual RAM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
