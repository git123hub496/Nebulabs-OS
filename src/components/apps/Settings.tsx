
"use client"

import React, { useRef } from 'react';
import { useOS, TaskbarPosition, AccentColor, CursorColor } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, HelpCircle, Upload, 
  Image as ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette 
} from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1599625803125-6efff06c9c37?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1920",
  "https://picsum.photos/seed/nebula1/1920/1080",
];

const ACCENT_COLORS: { id: AccentColor; class: string; label: string }[] = [
  { id: 'purple', class: 'bg-[#9333ea]', label: 'Purple' },
  { id: 'blue', class: 'bg-[#3b82f6]', label: 'Blue' },
  { id: 'rose', class: 'bg-[#e11d48]', label: 'Rose' },
  { id: 'orange', class: 'bg-[#f97316]', label: 'Orange' },
  { id: 'green', class: 'bg-[#16a34a]', label: 'Green' },
  { id: 'grey', class: 'bg-[#64748b]', label: 'Slate Grey' },
  { id: 'default', class: 'bg-black/20 border-white/10', label: 'Nebula' },
];

const CURSOR_THEMES: { id: CursorColor; label: string; class: string }[] = [
  { id: 'black', label: 'Classic Black', class: 'bg-black border-white' },
  { id: 'white', label: 'Modern White', class: 'bg-white border-black' },
  { id: 'accent', label: 'System Accent', class: 'bg-accent border-white/20' },
];

export const Settings: React.FC = () => {
  const { 
    wallpaper, updateWallpaper, theme, setTheme, taskbarPosition, setTaskbarPosition, 
    accentColor, setAccentColor, customAccentHex, setCustomAccentHex,
    cursorColor, setCursorColor, isInverted, setInverted,
    glassEnabled, setGlassEnabled 
  } = useOS();
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
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border bg-black/5 flex flex-col p-4 gap-2 shrink-0">
        <h2 className="px-4 py-2 text-[10px] font-bold text-accent uppercase tracking-widest mb-2">System Settings</h2>
        <Button variant="ghost" className="justify-start gap-3 bg-accent/10 text-accent font-bold"><Palette size={16} /> Personalization</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Monitor size={16} /> Display</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Eye size={16} /> Accessibility</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Bell size={16} /> Notifications</Button>
        <Separator className="my-4 opacity-10" />
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><User size={16} /> Accounts</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><Shield size={16} /> Security</Button>
        <Button variant="ghost" className="justify-start gap-3 opacity-60"><HelpCircle size={16} /> About</Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-12">
          
          {/* Section: Themes & Accent */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-accent" />
              <h2 className="text-lg font-bold">Quick Customization</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Interface Theme</Label>
                    <p className="text-[11px] opacity-40">Switch between light and dark modes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Dark</span>
                  <Switch 
                    checked={theme === 'light'} 
                    onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                  />
                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Light</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-40">System Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Pipette size={14} className="text-accent" />
                    <button 
                      onClick={() => setAccentColor('custom')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-widest transition-colors",
                        accentColor === 'custom' ? "text-accent" : "text-white/30 hover:text-white/60"
                      )}
                    >
                      Use Custom
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-4">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setAccentColor(color.id)}
                      className={cn(
                        "group relative aspect-square rounded-2xl flex items-center justify-center border-2 transition-all",
                        color.class,
                        accentColor === color.id ? "border-white scale-110 shadow-xl shadow-black/30" : "border-transparent opacity-80 hover:opacity-100"
                      )}
                    >
                      {accentColor === color.id && <Check size={20} className="text-white drop-shadow-md" />}
                    </button>
                  ))}
                  
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <button
                      onClick={() => setAccentColor('custom')}
                      className={cn(
                        "aspect-square w-full rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden",
                        accentColor === 'custom' ? "border-white scale-110 shadow-xl" : "border-transparent opacity-80"
                      )}
                      style={{ backgroundColor: customAccentHex }}
                    >
                      {accentColor === 'custom' && <Check size={20} className="text-white drop-shadow-md" />}
                    </button>
                  </div>
                </div>

                {accentColor === 'custom' && (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
                    <Input 
                      type="color" 
                      value={customAccentHex} 
                      onChange={(e) => setCustomAccentHex(e.target.value)}
                      className="w-12 h-10 p-1 bg-transparent border-none cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs font-bold uppercase">Custom Hex Color</Label>
                      <Input 
                        value={customAccentHex} 
                        onChange={(e) => setCustomAccentHex(e.target.value)}
                        className="h-8 bg-black/20 border-white/10 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section: Mouse & Cursor */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <MousePointer2 size={18} className="text-accent" />
              <h2 className="text-lg font-bold">Pointer Customization</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {CURSOR_THEMES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCursorColor(c.id)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                    cursorColor === c.id ? "bg-accent/10 border-accent" : "bg-white/5 border-transparent hover:bg-white/10"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center", c.class)}>
                    <MousePointer2 size={16} className={c.id === 'white' ? 'text-black' : 'text-white'} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-tighter">{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Advanced Visuals */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Layers size={18} className="text-accent" />
              <h2 className="text-lg font-bold">Advanced Visuals</h2>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Liquid Glass Effects</Label>
                  <p className="text-[11px] opacity-40">Enable sophisticated backdrop blurs and glassmorphism</p>
                </div>
                <Switch 
                  checked={glassEnabled} 
                  onCheckedChange={setGlassEnabled}
                />
              </div>

              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Invert System Colors</Label>
                  <p className="text-[11px] opacity-40">A high-contrast accessibility mode that flips all colors</p>
                </div>
                <Switch 
                  checked={isInverted} 
                  onCheckedChange={setInverted}
                />
              </div>

              <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Taskbar Position</Label>
                  <p className="text-[11px] opacity-40">Move the system bar to any screen edge</p>
                </div>
                <Select value={taskbarPosition} onValueChange={(v) => setTaskbarPosition(v as TaskbarPosition)}>
                  <SelectTrigger className="w-[120px] bg-black/20 border-white/10 text-xs">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Section: Wallpaper */}
          <section className="pb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-accent" />
                <h2 className="text-lg font-bold">Desktop Wallpaper</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-accent/20 hover:bg-accent hover:text-white transition-all rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Custom Image
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {WALLPAPERS.map((url, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group",
                    wallpaper === url ? "border-accent scale-[1.02] shadow-2xl shadow-accent/20" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                  onClick={() => updateWallpaper(url)}
                >
                  <img src={url} alt="Wallpaper" className="w-full h-full object-cover" />
                  {wallpaper === url && (
                    <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                      <Check className="text-white drop-shadow-xl" size={32} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
