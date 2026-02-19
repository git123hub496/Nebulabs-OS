"use client"

import React from 'react';
import { useOS, AppId } from '@/context/os-context';
import { ShoppingBag, Star, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STORE_APPS: { id: AppId; name: string; description: string; category: string; rating: number }[] = [
  { id: 'google-drive', name: 'Google Drive', description: 'Cloud storage and file sync.', category: 'Productivity', rating: 4.8 },
  { id: 'google-slides', name: 'Google Slides', description: 'Create and edit presentations.', category: 'Productivity', rating: 4.5 },
  { id: 'google-docs', name: 'Google Docs', description: 'Word processing online.', category: 'Productivity', rating: 4.9 },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Online spreadsheets.', category: 'Productivity', rating: 4.7 },
  { id: 'assistant', name: 'Nebula AI', description: 'Smart assistant for your OS.', category: 'Utilities', rating: 5.0 },
];

export const AppStore: React.FC = () => {
  const { installedApps, installApp } = useOS();

  return (
    <div className="flex flex-col h-full bg-background">
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
                  <ShoppingBag size={28} className="text-accent" />
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

import { cn } from '@/lib/utils';