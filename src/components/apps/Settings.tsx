
'use client';

import React, { useState, useRef } from 'react';
import { useOS, TaskbarPosition, TaskbarSize, DesktopIconSize, AccentColor, CursorColor, SystemNotification } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, HelpCircle, Upload, 
  Image as ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette, Maximize2, Plus, ArrowUpRight,
  Wifi, ShieldCheck, Activity, Trash2, Info, Newspaper, Clock
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type SettingsTab = 'personalization' | 'display' | 'accessibility' | 'notifications' | 'accounts' | 'security' | 'about';

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
  "https://picsum.photos/seed/abstract1/1920/1080",
  "https://picsum.photos/seed/abstract2/1920/1080",
  "https://picsum.photos/seed/abstract3/1920/1080",
  "https://picsum.photos/seed/abstract4/1920/1080",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1920",
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
    taskbarSize, setTaskbarSize, iconSize, setIconSize,
    accentColor, setAccentColor, customAccentHex, setCustomAccentHex,
    cursorColor, setCursorColor, isInverted, setInverted,
    glassEnabled, setGlassEnabled, brightness, setBrightness,
    currentDisplayId, setCurrentDisplayId, displayLayout, updateDisplayLayout,
    currentUser, notifications, clearNotifications, addNotification
  } = useOS();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personalization');
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

  const addDisplay = () => {
    window.open(window.location.href, '_blank', 'width=1280,height=720');
  };

  const getNotifIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'security': return <ShieldCheck className="text-green-500" size={16} />;
      case 'news': return <Newspaper className="text-blue-400" size={16} />;
      case 'app': return <Zap className="text-yellow-400" size={16} />;
      default: return <Info className="text-accent" size={16} />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personalization':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Zap size={18} className="text-accent" />
                <h2 className="text-lg font-bold">Theme & Style</h2>
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
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-40">Accent Color</Label>
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
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Layout size={18} className="text-accent" />
                <h2 className="text-lg font-bold">Desktop Layout</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                  <Label className="text-sm font-bold">Taskbar Position</Label>
                  <Select value={taskbarPosition} onValueChange={(v) => setTaskbarPosition(v as TaskbarPosition)}>
                    <SelectTrigger className="w-[120px] bg-black/20 border-white/10 text-xs">
                      <SelectValue />
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

            <section className="pb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-accent" />
                  <h2 className="text-lg font-bold">Wallpapers</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl gap-2 border-accent/20">
                  <Upload size={14} /> Custom
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {WALLPAPERS.map((url, i) => (
                  <div 
                    key={i} 
                    onClick={() => updateWallpaper(url)}
                    className={cn(
                      "relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                      wallpaper === url ? "border-accent scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Wallpaper" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Monitor size={18} className="text-accent" />
                  <h2 className="text-lg font-bold">Multi-Display Control</h2>
                </div>
                <Button onClick={addDisplay} className="bg-accent text-primary font-bold rounded-xl gap-2">
                  <Plus size={16} /> Connect Display
                </Button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6">
                <div className="flex justify-center gap-4">
                  {['1', '2', '3'].map(id => (
                    <div 
                      key={id} 
                      onClick={() => setCurrentDisplayId(id)}
                      className={cn(
                        "w-24 h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all",
                        currentDisplayId === id ? "bg-accent/20 border-accent text-accent scale-110 shadow-lg" : "bg-black/40 border-white/10 text-white/20 hover:border-white/40"
                      )}
                    >
                      <Monitor size={20} />
                      <span className="text-[10px] font-black">{id}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                  Select a monitor to identify this browser tab. Arrange displays to enable seamless <strong>Edge-Hopping</strong> window movement.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Physical Arrangement</h3>
              <div className="grid gap-4">
                {['1', '2', '3'].map(id => (
                  <div key={id} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">{id}</div>
                      <span className="text-sm font-medium">Display {id} Layout</span>
                    </div>
                    <div className="flex gap-2">
                      {['left', 'right', 'top', 'bottom'].map(dir => (
                        <Select key={dir} value={displayLayout[id]?.[dir as any] || 'none'} onValueChange={(v) => updateDisplayLayout(id, dir as any, v)}>
                          <SelectTrigger className="w-24 bg-black/20 border-white/10 text-[10px] uppercase font-bold">
                            <SelectValue placeholder={dir} />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10">
                            <SelectItem value="none">None</SelectItem>
                            {['1', '2', '3'].filter(toId => toId !== id).map(toId => (
                              <SelectItem key={toId} value={toId}>{dir} is {toId}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Eye size={18} className="text-accent" />
                <h2 className="text-lg font-bold">Visual Assistance</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Invert System Colors</Label>
                    <p className="text-[11px] opacity-40">High-contrast mode for improved readability</p>
                  </div>
                  <Switch checked={isInverted} onCheckedChange={setInverted} />
                </div>
                <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Glass & Transparency</Label>
                    <p className="text-[11px] opacity-40">Enable sophisticated backdrop blur effects</p>
                  </div>
                  <Switch checked={glassEnabled} onCheckedChange={setGlassEnabled} />
                </div>
              </div>
            </section>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-accent" />
                  <h2 className="text-lg font-bold">Notification Center</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs text-destructive hover:bg-destructive/10">
                  Clear All
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] rounded-2xl border border-white/5 bg-black/20 p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-accent/20 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getNotifIcon(notif.type)}
                            <span className="text-xs font-bold text-white/80">{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-white/20 font-mono">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed pl-6">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                    <Bell size={48} className="mb-4" />
                    <p className="text-sm font-medium">No recent notifications</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1">Everything is quiet</p>
                  </div>
                )}
              </ScrollArea>
              
              <div className="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-accent" />
                  <p className="text-[11px] font-medium text-accent/80">Simulate incoming test notification</p>
                </div>
                <Button 
                  size="sm" 
                  className="h-7 bg-accent text-primary font-bold text-[10px]"
                  onClick={() => addNotification("Test Alert", "This is a manually triggered system verification alert.", 'system')}
                >
                  Trigger
                </Button>
              </div>
            </section>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User size={18} className="text-accent" />
                <h2 className="text-lg font-bold">Current User</h2>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl"
                  style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
                >
                  {currentUser?.username[0].toUpperCase() || 'G'}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{currentUser?.username || 'Guest User'}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-accent text-primary font-bold uppercase text-[9px]">Administrator</Badge>
                    <span className="text-xs text-white/40">Local System Account</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Shield size={18} className="text-accent" />
                <h2 className="text-lg font-bold">System Protection</h2>
              </div>
              <div className="grid gap-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-green-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShieldCheck size={20} className="text-green-500" />
                    <div>
                      <p className="text-sm font-bold">Nebula Defender Active</p>
                      <p className="text-[10px] text-white/40">Real-time workspace isolation is enabled</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500/20">Secure</Badge>
                </div>
              </div>
            </section>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="text-center py-12 space-y-6">
              <div className="w-24 h-24 bg-accent/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <span className="text-4xl font-black text-accent tracking-tighter">N</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Nebulabs WebOS</h2>
                <p className="text-xs text-white/40 font-mono uppercase tracking-[0.3em]">Version 1.0.4 Stable-Channel</p>
              </div>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="bg-white/5 text-white/40 border-white/10">Kernel: React 19.x</Badge>
                <Badge variant="secondary" className="bg-white/5 text-white/40 border-white/10">UI: Tailwind v4</Badge>
              </div>
              <div className="max-w-xs mx-auto pt-8">
                <p className="text-[10px] text-white/20 leading-relaxed italic">
                  "Building the future of virtual workspace environments, one component at a time."
                </p>
              </div>
            </section>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border bg-black/5 flex flex-col p-4 gap-1 shrink-0 overflow-y-auto">
        <h2 className="px-4 py-4 text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 opacity-60">System Configuration</h2>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('personalization')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'personalization' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <Palette size={16} /> Personalization
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('display')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'display' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <Monitor size={16} /> Display & Screens
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('accessibility')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'accessibility' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <Eye size={16} /> Accessibility
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('notifications')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'notifications' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <Bell size={16} /> Notifications
        </Button>
        
        <Separator className="my-4 opacity-5 mx-2" />
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('accounts')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'accounts' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <User size={16} /> User Accounts
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('security')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'security' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <Shield size={16} /> System Security
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab('about')}
          className={cn("justify-start gap-3 h-11 rounded-xl transition-all", activeTab === 'about' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-white/40 hover:bg-white/5")}
        >
          <HelpCircle size={16} /> About WebOS
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-10">
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
