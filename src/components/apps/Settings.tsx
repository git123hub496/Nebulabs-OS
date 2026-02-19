"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { Monitor, Palette, User, Shield, Bell, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const WALLPAPERS = [
  "https://picsum.photos/seed/nebula1/1920/1080",
  "https://picsum.photos/seed/nebula2/1920/1080",
  "https://picsum.photos/seed/nebula3/1920/1080",
  "https://picsum.photos/seed/space1/1920/1080",
];

export const Settings: React.FC = () => {
  const { wallpaper, updateWallpaper } = useOS();

  return (
    <div className="flex h-full bg-[#1e2731]">
      <div className="w-64 border-r border-white/5 bg-black/10 flex flex-col p-4 gap-2">
        <h2 className="px-4 py-2 text-xs font-bold text-accent uppercase tracking-widest mb-2">System</h2>
        <Button variant="ghost" className="justify-start gap-3 bg-white/5 text-accent"><Palette size={18} /> Personalization</Button>
        <Button variant="ghost" className="justify-start gap-3 text-white/60"><Monitor size={18} /> Display</Button>
        <Button variant="ghost" className="justify-start gap-3 text-white/60"><Bell size={18} /> Notifications</Button>
        <div className="my-4 border-t border-white/5" />
        <Button variant="ghost" className="justify-start gap-3 text-white/60"><User size={18} /> Accounts</Button>
        <Button variant="ghost" className="justify-start gap-3 text-white/60"><Shield size={18} /> Security</Button>
        <Button variant="ghost" className="justify-start gap-3 text-white/60"><HelpCircle size={18} /> About</Button>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Personalization</h1>
          
          <section className="mb-10">
            <h3 className="text-sm font-semibold mb-4 text-white/80">Desktop Wallpaper</h3>
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((url, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                    wallpaper === url ? "border-accent scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  onClick={() => updateWallpaper(url)}
                >
                  <img src={url} alt="Wallpaper" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold mb-4 text-white/80">System Preferences</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-sm">Dark Mode</Label>
                <p className="text-xs text-white/40">Always active in Nebula WebOS</p>
              </div>
              <Switch checked={true} disabled />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-sm">Transparency Effects</Label>
                <p className="text-xs text-white/40">Enable glassmorphism UI elements</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="space-y-0.5">
                <Label className="text-sm">Accent Color</Label>
                <p className="text-xs text-white/40">Soft Teal (Nebula Default)</p>
              </div>
              <div className="w-6 h-6 rounded-full bg-accent border border-white/20" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';