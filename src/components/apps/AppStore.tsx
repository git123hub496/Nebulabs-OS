
"use client"

import React from 'react';
import { useOS, AppId } from '@/context/os-context';
import { ShoppingBag, Star, Download, CheckCircle2, FileText, Calculator, Terminal, Cloud, MessageSquare, Globe, Map as MapIcon, Activity, Calendar as CalendarIcon, Gamepad2, Bomb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STORE_APPS: { id: AppId; name: string; description: string; category: string; rating: number; icon: any }[] = [
  { id: 'browser', name: 'Nebula Browser', description: 'Fast and secure web browsing.', category: 'Utilities', rating: 4.9, icon: Globe },
  { id: 'google-drive', name: 'Google Drive', description: 'Cloud storage and file sync.', category: 'Productivity', rating: 4.8, icon: Cloud },
  { id: 'notes', name: 'Nebula Notes', description: 'Lightweight text editor.', category: 'Productivity', rating: 4.6, icon: FileText },
  { id: 'calc', name: 'Calculator', description: 'Standard system calculator.', category: 'Utilities', rating: 4.4, icon: Calculator },
  { id: 'terminal', name: 'Terminal', icon: Terminal, description: 'Direct access to system shell.', category: 'Utilities', rating: 4.9 },
  { id: 'assistant', name: 'Nebula AI', description: 'Smart assistant for your OS.', category: 'AI', rating: 5.0, icon: MessageSquare },
  { id: 'maps', name: 'Nebula Maps', description: 'World navigation and intelligence.', category: 'Navigation', rating: 4.7, icon: MapIcon },
  { id: 'monitor', name: 'System Monitor', description: 'Real-time telemetry and stats.', category: 'System', rating: 4.8, icon: Activity },
  { id: 'calendar', name: 'Calendar', description: 'Unified OS scheduling.', category: 'Productivity', rating: 4.6, icon: CalendarIcon },
  { id: 'snake', name: 'Nebula Snake', description: 'Classic arcade survival.', category: 'Entertainment', rating: 4.9, icon: Gamepad2 },
  { id: 'minesweeper', name: 'Minesweeper', description: 'Strategic mine disposal.', category: 'Entertainment', rating: 4.5, icon: Bomb },
];

export const AppStore: React.FC = () => {
  const { installedApps, installApp } = useOS();

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      <div className="p-8 bg-gradient-to-br from-accent/20 to-primary/40 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <ShoppingBag className="text-accent" size={32} />
          <h1 className="text-3xl font-bold tracking-tight">Nebula App Store</h1>
        </div>
        <p className="text-white/60 max-w-md">Discover and install applications to personalize your Nebulabs WebOS experience.</p>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">Featured Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORE_APPS.map(app => (
            <div key={app.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/40 transition-colors">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                  <app.icon size={28} className="text-accent" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white/60">
                  {app.category}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-bold">{app.name}</h3>
                <p className="text-sm text-white/50 line-clamp-2">{app.description}</p>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={cn(i < Math.floor(app.rating) ? "text-accent fill-accent" : "text-white/20")} />
                ))}
                <span className="text-xs text-white/40 ml-2">{app.rating}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                {installedApps.includes(app.id) ? (
                  <div className="flex items-center gap-2 text-accent text-sm font-medium">
                    <CheckCircle2 size={16} />
                    <span>Installed</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-accent text-primary hover:bg-accent/80 font-bold"
                    onClick={() => installApp(app.id)}
                  >
                    <Download size={16} className="mr-2" />
                    Install
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
