
"use client"

import React, { useRef } from 'react';
import { useOS, TaskbarPosition } from '@/context/os-context';
import { Monitor, Palette, User, Shield, Bell, HelpCircle, Upload, Image as ImageIcon, Sun, Moon, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WALLPAPERS = [
  "https://picsum.photos/seed/nebula1/1920/1080",
  "https://picsum.photos/seed/nebula2/1920/1080",
  "https://picsum.photos/seed/nebula3/1920/1080",
  "https://picsum.photos/seed/space1/1920/1080",
];

export const Settings: React.FC = () => {
  const { wallpaper, updateWallpaper, theme, setTheme, taskbarPosition, setTaskbarPosition } = useOS();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateWallpaper(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-full bg-background text-foreground">
      <div className="w-64 border-r border-border bg-black/5 flex flex-col p-4 gap-2">
        <h2 className="px-4 py-2 text-xs font-bold text-accent uppercase tracking-widest mb-2">System</h2>
        <Button variant="ghost" className="justify-start gap-3 bg-accent/10 text-accent"><Palette size={18} /> Personalization</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Monitor size={18} /> Display</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Bell size={18} /> Notifications</Button>
        <div className="my-4 border-t border-border" />
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><User size={18} /> Accounts</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Shield size={18} /> Security</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><HelpCircle size={18} /> About</Button>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Personalization</h1>
          
          <section className="mb-10">
            <h3 className="text-sm font-semibold mb-4 opacity-80">Theme Mode</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg", theme === 'light' ? "bg-accent text-white" : "bg-black/20 text-accent")}>
                  {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Appearance</Label>
                  <p className="text-xs opacity-50">Choose between light or dark interface</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium opacity-50 uppercase tracking-tighter">Dark</span>
                <Switch 
                  checked={theme === 'light'} 
                  onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                />
                <span className="text-xs font-medium opacity-50 uppercase tracking-tighter">Light</span>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-sm font-semibold mb-4 opacity-80">Desktop Layout</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-black/20 text-accent">
                  <Layout size={20} />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Taskbar Position</Label>
                  <p className="text-xs opacity-50">Move the bar to your preferred edge</p>
                </div>
              </div>
              <Select value={taskbarPosition} onValueChange={(v) => setTaskbarPosition(v as TaskbarPosition)}>
                <SelectTrigger className="w-[120px] bg-black/20 border-white/10 text-xs">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2731] border-white/10 text-white">
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold opacity-80">Desktop Wallpaper</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-border hover:bg-accent hover:text-white transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Upload Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {WALLPAPERS.map((url, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all group",
                    wallpaper === url ? "border-accent scale-[1.02] shadow-lg shadow-accent/10" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  onClick={() => updateWallpaper(url)}
                >
                  <img src={url} alt="Wallpaper" className="w-full h-full object-cover" />
                  {wallpaper === url && (
                    <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                      <ImageIcon className="text-accent" size={24} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-semibold mb-4 opacity-80">System Preferences</h3>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label className="text-sm">Transparency Effects</Label>
                <p className="text-xs opacity-40">Enable glassmorphism UI elements</p>
              </div>
              <Switch checked={true} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
