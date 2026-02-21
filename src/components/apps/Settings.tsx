
'use client';

import React, { useState, useRef } from 'react';
import { useOS, TaskbarPosition, TaskbarSize, DesktopIconSize, AccentColor, CursorColor, SystemNotification } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, HelpCircle, Upload, 
  Image as ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette, Maximize2, Plus, ArrowUpRight,
  Wifi, ShieldCheck, Activity, Trash2, Info, Newspaper, Clock, XCircle, RefreshCw, ChevronRight, ShieldAlert, ShieldX, Lock, KeyRound, Camera
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
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type SettingsTab = 'personalization' | 'display' | 'accessibility' | 'notifications' | 'accounts' | 'security' | 'updates' | 'about';

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

export const Settings: React.FC = () => {
  const { 
    wallpaper, updateWallpaper, theme, setTheme, taskbarPosition, setTaskbarPosition, 
    taskbarSize, setTaskbarSize, iconSize, setIconSize,
    accentColor, setAccentColor, customAccentHex, 
    cursorColor, setCursorColor, isInverted, setInverted,
    glassEnabled, setGlassEnabled, brightness, setBrightness,
    currentDisplayId, setCurrentDisplayId, displayLayout, updateDisplayLayout, resetDisplayLayout,
    currentUser, logout, notifications, clearNotifications, addNotification, openApp,
    isSecurityEnabled, setSecurityEnabled, updateUserPassword, updateUserAvatar
  } = useOS();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personalization');
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const compressAndResize = (dataUrl: string, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const optimized = await compressAndResize(result, 1920, 1080, 0.7);
        updateWallpaper(optimized);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const optimized = await compressAndResize(result, 256, 256, 0.8);
        updateUserAvatar(optimized);
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

  const handleUpdatePass = () => {
    updateUserPassword(newPassword);
    setNewPassword("");
    setIsChangingPass(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personalization':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Zap size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Theme & Style</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold text-foreground">Interface Theme</Label>
                      <p className="text-[11px] text-muted-foreground">Switch between light and dark modes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dark</span>
                    <Switch 
                      checked={theme === 'light'} 
                      onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')}
                    />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Light</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accent Color</Label>
                  <div className="grid grid-cols-7 gap-4">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setAccentColor(color.id)}
                        className={cn(
                          "group relative aspect-square rounded-2xl flex items-center justify-center border-2 transition-all",
                          color.class,
                          accentColor === color.id ? "border-foreground scale-110 shadow-xl shadow-black/30" : "border-transparent opacity-80 hover:opacity-100"
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
                <MousePointer2 size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Cursor Preferences</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'black' as CursorColor, label: 'Midnight Black', class: 'bg-black border-white/20' },
                  { id: 'white' as CursorColor, label: 'Arctic White', class: 'bg-white border-black/10' },
                  { id: 'accent' as CursorColor, label: 'System Accent', class: 'bg-accent border-white/20' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setCursorColor(option.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      cursorColor === option.id ? "bg-accent/10 border-accent scale-105 shadow-lg" : "bg-foreground/5 border-border/50 hover:bg-foreground/10"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg shadow-inner", option.class)} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", cursorColor === option.id ? "text-accent" : "text-muted-foreground")}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Layout size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Desktop Layout</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <Label className="text-sm font-bold text-foreground">Taskbar Position</Label>
                  <Select value={taskbarPosition} onValueChange={(v) => setTaskbarPosition(v as TaskbarPosition)}>
                    <SelectTrigger className="w-[120px] bg-foreground/5 border-border/50 text-xs text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50">
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-foreground">Taskbar Scale</Label>
                    <span className="text-xs font-mono text-accent">{taskbarSize}px</span>
                  </div>
                  <Slider 
                    value={[taskbarSize]} 
                    min={32} 
                    max={80} 
                    step={1} 
                    onValueChange={(v) => setTaskbarSize(v[0])}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-4 p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-foreground">Desktop Icon Scale</Label>
                    <span className="text-xs font-mono text-accent">{iconSize}%</span>
                  </div>
                  <Slider 
                    value={[iconSize]} 
                    min={50} 
                    max={150} 
                    step={5} 
                    onValueChange={(v) => setIconSize(v[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </section>

            <section className="pb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">Wallpapers</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => wallpaperInputRef.current?.click()} className="rounded-xl gap-2 border-accent/20 text-foreground">
                  <Upload size={14} /> Custom
                </Button>
                <input type="file" ref={wallpaperInputRef} onChange={handleWallpaperUpload} accept="image/*" className="hidden" />
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
                  <h2 className="text-lg font-bold text-foreground">Multi-Display Control</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetDisplayLayout} className="rounded-xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/10">
                    <XCircle size={14} /> Reset All
                  </Button>
                  <Button size="sm" onClick={addDisplay} className="bg-accent text-primary-foreground font-bold rounded-xl gap-2">
                    <Plus size={16} /> Connect Display
                  </Button>
                </div>
              </div>

              <div className="bg-foreground/5 border border-border/50 rounded-3xl p-8 text-center space-y-6">
                <div className="flex justify-center gap-4">
                  {['1', '2', '3'].map(id => (
                    <div 
                      key={id} 
                      onClick={() => setCurrentDisplayId(id)}
                      className={cn(
                        "w-24 h-16 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all",
                        currentDisplayId === id ? "bg-accent/20 border-accent text-accent scale-110 shadow-lg" : "bg-foreground/5 border-border/50 text-muted-foreground hover:border-foreground/40"
                      )}
                    >
                      <Monitor size={20} />
                      <span className="text-[10px] font-black">{id}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Select a monitor ID to identify this browser tab. Disconnect displays by setting their position to <strong>"None"</strong> or use the reset button.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Physical Arrangement</h3>
              <div className="grid gap-4">
                {['1', '2', '3'].map(id => (
                  <div key={id} className="p-5 bg-foreground/5 rounded-2xl border border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">{id}</div>
                      <span className="text-sm font-medium text-foreground">Display {id} Layout</span>
                    </div>
                    <div className="flex gap-2">
                      {['left', 'right', 'top', 'bottom'].map(dir => (
                        <Select key={dir} value={displayLayout[id]?.[dir as any] || 'none'} onValueChange={(v) => updateDisplayLayout(id, dir as any, v)}>
                          <SelectTrigger className="w-24 bg-foreground/5 border-border/50 text-[10px] uppercase font-bold text-foreground">
                            <SelectValue placeholder={dir} />
                          </SelectTrigger>
                          <SelectContent className="glass border-border/50">
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
                <h2 className="text-lg font-bold text-foreground">Visual Assistance</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Invert System Colors</Label>
                    <p className="text-[11px] text-muted-foreground">High-contrast mode for improved readability</p>
                  </div>
                  <Switch checked={isInverted} onCheckedChange={setInverted} />
                </div>
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Glass & Transparency</Label>
                    <p className="text-[11px] text-muted-foreground">Enable sophisticated backdrop blur effects</p>
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
                  <h2 className="text-lg font-bold text-foreground">Notification Center</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs text-destructive hover:bg-destructive/10">
                  Clear All
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] rounded-2xl border border-border/50 bg-foreground/5 p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 bg-foreground/5 border border-border/50 rounded-xl hover:border-accent/20 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getNotifIcon(notif.type)}
                            <span className="text-xs font-bold text-foreground/80">{notif.title}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed pl-6">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                    <Bell size={48} className="mb-4 text-foreground" />
                    <p className="text-sm font-medium text-foreground">No recent notifications</p>
                    <p className="text-[10px] uppercase tracking-widest mt-1 text-foreground">Everything is quiet</p>
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
                  className="h-7 bg-accent text-primary-foreground font-bold text-[10px]"
                  onClick={() => addNotification("Test Alert", "This is a manually triggered system verification alert.", 'system')}
                >
                  Trigger
                </Button>
              </div>
            </section>
          </div>
        );

      case 'updates':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <RefreshCw size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Nebula Update</h2>
              </div>
              
              <div className="p-8 bg-foreground/5 rounded-3xl border border-border/50 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center animate-pulse">
                  <RefreshCw size={40} className="text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">System Build 4.5.2</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">Your system is currently running the latest stable build of Nebulabs WebOS Core.</p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <Button 
                    className="bg-accent text-primary-foreground font-bold rounded-xl h-12"
                    onClick={() => openApp('update', 'System Update')}
                  >
                    Check for Updates
                  </Button>
                  <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    View Update History
                  </Button>
                </div>
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
                <h2 className="text-lg font-bold text-foreground">Identity & Authentication</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 p-6 bg-foreground/5 rounded-3xl border border-border/50">
                  <div className="relative group/avatar">
                    <Avatar className="w-24 h-24 border-4 border-accent shadow-2xl">
                      <AvatarImage src={currentUser?.avatarUrl} />
                      <AvatarFallback 
                        className="text-3xl font-black text-white"
                        style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
                      >
                        {currentUser?.username[0].toUpperCase() || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    <button 
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera size={24} className="text-white" />
                    </button>
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    {currentUser?.password && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full border-4 border-background flex items-center justify-center">
                        <Lock size={12} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <h3 className="text-2xl font-bold text-foreground">{currentUser?.username || 'Guest User'}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent text-primary-foreground font-bold uppercase text-[9px]">Administrator</Badge>
                      <span className="text-xs text-muted-foreground">Local System Account</span>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-accent text-[10px] p-0 h-auto uppercase font-bold tracking-widest"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      Update Photo
                    </Button>
                  </div>
                  <Button variant="outline" className="border-border/50 text-destructive hover:bg-destructive/10" onClick={logout}>Sign Out</Button>
                </div>

                <div className="bg-foreground/5 rounded-2xl border border-border/50 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <KeyRound size={18} className="text-accent" />
                      <div>
                        <p className="text-sm font-bold text-foreground">Account Protection</p>
                        <p className="text-[10px] text-muted-foreground">{currentUser?.password ? "Your identity is secured by a password." : "Your identity is currently unprotected."}</p>
                      </div>
                    </div>
                    {!isChangingPass && (
                      <Button variant="outline" size="sm" className="rounded-xl border-border/50 text-foreground" onClick={() => setIsChangingPass(true)}>
                        {currentUser?.password ? "Change Password" : "Add Password"}
                      </Button>
                    )}
                  </div>

                  {isChangingPass && (
                    <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-accent pl-1">New Access Password</Label>
                        <Input 
                          type="password"
                          placeholder="Enter secure password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-foreground/5 border-border/50 h-11 focus-visible:ring-accent text-foreground"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-accent text-primary-foreground font-bold flex-1" onClick={handleUpdatePass}>Update Protection</Button>
                        <Button variant="ghost" className="text-muted-foreground" onClick={() => { setIsChangingPass(false); setNewPassword(""); }}>Cancel</Button>
                      </div>
                    </div>
                  )}
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
                <h2 className="text-lg font-bold text-foreground">System Protection</h2>
              </div>
              <div className="grid gap-4">
                <div className={cn(
                  "p-5 rounded-2xl border transition-all flex items-center justify-between",
                  isSecurityEnabled ? "bg-foreground/5 border-green-500/20" : "bg-destructive/5 border-destructive/20"
                )}>
                  <div className="flex items-center gap-4">
                    {isSecurityEnabled ? (
                      <ShieldCheck size={24} className="text-green-500" />
                    ) : (
                      <ShieldX size={24} className="text-destructive animate-pulse" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-foreground">Nebula Defender</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isSecurityEnabled ? "Real-time workspace isolation is active." : "System is currently vulnerable to external threats."}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={isSecurityEnabled} 
                    onCheckedChange={setSecurityEnabled}
                  />
                </div>

                {!isSecurityEnabled && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <ShieldAlert className="text-destructive shrink-0 mt-0.5" size={16} />
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-destructive uppercase tracking-widest">High Risk Alert</p>
                      <p className="text-[10px] text-destructive/80 leading-relaxed">
                        Disabling Nebula Defender exposes your kernel to simulated malware scripts. Unknown windows may appear without your permission.
                      </p>
                    </div>
                  </div>
                )}
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
                <h2 className="text-3xl font-black tracking-tight text-foreground">{currentUser?.username || 'User'}'s NebulaBook 180 Pro</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.3em]">Version 1.0.4 Stable-Channel</p>
              </div>
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="bg-foreground/5 text-muted-foreground border-border/50">Kernel: React 19.x</Badge>
                <Badge variant="secondary" className="bg-foreground/5 text-muted-foreground border-border/50">UI: Tailwind v4</Badge>
              </div>
              <div className="max-w-md mx-auto p-6 bg-foreground/5 border border-border/50 rounded-3xl text-left space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Device Name</span>
                  <span className="text-foreground font-bold">NEBULA-LP-{currentUser?.id.slice(0, 4).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Product ID</span>
                  <span className="text-foreground font-bold">180-PRO-2024-X</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Manufacturer</span>
                  <span className="text-accent font-black tracking-tight italic">NEBULABS CORP</span>
                </div>
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
      <div className="w-64 border-r border-border bg-foreground/5 flex flex-col p-4 gap-1 shrink-0 overflow-y-auto">
        <h2 className="px-4 py-4 text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 opacity-60">System Configuration</h2>
        
        <button 
          onClick={() => setActiveTab('personalization')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'personalization' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Palette size={16} /> Personalization
        </button>
        
        <button 
          onClick={() => setActiveTab('display')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'display' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Monitor size={16} /> Display & Screens
        </button>
        
        <button 
          onClick={() => setActiveTab('accessibility')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'accessibility' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Eye size={16} /> Accessibility
        </button>
        
        <button 
          onClick={() => setActiveTab('notifications')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'notifications' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Bell size={16} /> Notifications
        </button>
        
        <button 
          onClick={() => setActiveTab('updates')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'updates' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <RefreshCw size={16} /> Updates
        </button>
        
        <Separator className="my-4 opacity-5 mx-2" />
        
        <button 
          onClick={() => setActiveTab('accounts')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'accounts' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <User size={16} /> User Accounts
        </button>
        
        <button 
          onClick={() => setActiveTab('security')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'security' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Shield size={16} /> System Security
        </button>
        
        <button 
          onClick={() => setActiveTab('about')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'about' ? "bg-accent/10 text-accent font-bold shadow-sm shadow-accent/5" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <HelpCircle size={16} /> About WebOS
        </button>
      </div>

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
