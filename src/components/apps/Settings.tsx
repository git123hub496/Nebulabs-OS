
'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useOS, TaskbarPosition, TaskbarSize, DesktopIconSize, AccentColor, CursorColor, AppId, APP_INFO } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, BellOff, HelpCircle, Upload, 
  ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette, Maximize2, Plus, ArrowUpRight,
  Wifi, ShieldCheck, Activity, Trash2, Info, Newspaper, Clock, XCircle, RefreshCw, ChevronRight, ShieldAlert, ShieldX, Lock, KeyRound, Camera, Building2, Briefcase, GraduationCap, Heart, MonitorCheck, Sliders, Smartphone, Smile, Home, Search, AppWindow, ExternalLink,
  Trash, EyeOff
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SettingsTab = 'personalization' | 'display' | 'apps' | 'accessibility' | 'notifications' | 'accounts' | 'security' | 'updates' | 'about';

const ACCENT_COLORS: { id: AccentColor; class: string; label: string }[] = [
  { id: 'purple', class: 'bg-[#9333ea]', label: 'Purple' },
  { id: 'blue', class: 'bg-[#3b82f6]', label: 'Blue' },
  { id: 'rose', class: 'bg-[#e11d48]', label: 'Rose' },
  { id: 'orange', class: 'bg-[#f97316]', label: 'Orange' },
  { id: 'green', class: 'bg-[#16a34a]', label: 'Green' },
  { id: 'grey', class: 'bg-[#64748b]', label: 'Slate Grey' },
  { id: 'default', class: 'bg-black/20 border-white/10', label: 'Nebula' },
];

const CURSOR_COLORS: { id: CursorColor; color: string; label: string }[] = [
  { id: 'black', color: '#000000', label: 'Deep Black' },
  { id: 'white', color: '#ffffff', label: 'Classic White' },
  { id: 'accent', color: 'var(--accent)', label: 'System Accent' },
];

export const Settings: React.FC = () => {
  const { 
    wallpaper, updateWallpaper, theme, setTheme, taskbarPosition, setTaskbarPosition, 
    taskbarSize, setTaskbarSize, isTaskbarAutoHide, setTaskbarAutoHide, iconSize, setIconSize,
    accentColor, setAccentColor, customAccentHex, 
    cursorColor, setCursorColor, mouserScale, setMouserScale, isInverted, setInverted,
    isGrayscale, setGrayscale,
    glassEnabled, setGlassEnabled, brightness, setBrightness,
    currentDisplayId, setCurrentDisplayId, displayLayout, updateDisplayLayout, resetDisplayLayout,
    currentUser, logout, notifications, clearNotifications, addNotification, openApp,
    isSecurityEnabled, setSecurityEnabled, updateUserPassword, updateUserAvatar, updateUserWorkStatus,
    installedApps, uninstallApp, biosSettings
  } = useOS();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personalization');
  const [searchQuery, setSearchQuery] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const isSchool = currentUser?.isSchoolAccount;
  const isKid = currentUser?.isKidAccount;

  const tabs = useMemo(() => {
    const allTabs: { id: SettingsTab; label: string; icon: any; keywords: string[] }[] = [
      { id: 'personalization', label: 'Personalization', icon: Palette, keywords: ['theme', 'wallpaper', 'taskbar', 'accent', 'color', 'dark mode', 'light mode'] },
      { id: 'display', label: 'Display', icon: Monitor, keywords: ['brightness', 'monitor', 'screen', 'resolution', 'multi-display'] },
      { id: 'apps', label: 'Apps', icon: AppWindow, keywords: ['installed', 'applications', 'software', 'management', 'uninstall'] },
      { id: 'accessibility', label: 'Accessibility', icon: Eye, keywords: ['contrast', 'grayscale', 'glass', 'transparency', 'cursor', 'pointer', 'mouse', 'scale'] },
      { id: 'notifications', label: 'Notifications', icon: Bell, keywords: ['alerts', 'messages', 'activity', 'dnd'] },
      { id: 'accounts', label: 'Accounts', icon: User, keywords: ['profile', 'identity', 'password', 'avatar', 'user', 'sign out'] },
      { id: 'security', label: 'Security', icon: Shield, keywords: ['encryption', 'lockdown', 'defender', 'kernel'] },
      { id: 'updates', label: 'Updates', icon: RefreshCw, keywords: ['patch', 'kernel', 'version', 'check for updates'] },
      { id: 'about', label: 'About', icon: HelpCircle, keywords: ['system', 'device', 'credits', 'nebulabs', 'version'] },
    ];

    if (!searchQuery) return allTabs;

    return allTabs.filter(tab => 
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        updateUserAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateWallpaper(result);
        addNotification("Wallpaper Updated", "Custom background applied to workspace.", "system");
      };
      reader.readAsDataURL(file);
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

                {!isSchool && !isKid && (
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
                            accentColor === color.id ? "border-foreground scale-110 shadow-xl" : "border-transparent opacity-80 hover:opacity-100"
                          )}
                        >
                          {accentColor === color.id && <Check size={20} className="text-white drop-shadow-md" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-accent" />
                  <h2 className="text-lg font-bold text-foreground">Desktop Wallpaper</h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 border-white/10 text-white/60 hover:text-accent hover:border-accent/40"
                  onClick={() => wallpaperInputRef.current?.click()}
                >
                  <Upload size={12} />
                  Upload Background
                </Button>
                <input 
                  type="file" 
                  ref={wallpaperInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleWallpaperUpload} 
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PlaceHolderImages.filter(img => img.id.startsWith('wallpaper-')).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => updateWallpaper(img.imageUrl)}
                    className={cn(
                      "relative aspect-video rounded-xl overflow-hidden border-2 transition-all group",
                      wallpaper === img.imageUrl ? "border-accent scale-105 shadow-xl shadow-accent/20 z-10" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img.imageUrl} alt={img.description} className="w-full h-full object-cover" />
                    {wallpaper === img.imageUrl && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                          <Check size={20} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] font-black text-white uppercase tracking-widest truncate">{img.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Layout size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Taskbar Configuration</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Taskbar Position</Label>
                    <p className="text-[11px] text-muted-foreground">Dock the system bar to any screen edge</p>
                  </div>
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

                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
                      <EyeOff size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold text-foreground">Auto-Hide Taskbar</Label>
                      <p className="text-[11px] text-muted-foreground">Slide taskbar out of view when not in use</p>
                    </div>
                  </div>
                  <Switch 
                    checked={isTaskbarAutoHide} 
                    onCheckedChange={setTaskbarAutoHide}
                  />
                </div>

                <div className="p-5 bg-foreground/5 rounded-2xl border border-border/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-foreground">Taskbar Scale</Label>
                    <span className="text-xs font-mono text-accent">{taskbarSize}px</span>
                  </div>
                  <Slider 
                    value={[taskbarSize]} 
                    max={120} 
                    min={32} 
                    step={1} 
                    onValueChange={(v) => setTaskbarSize(v[0])} 
                  />
                </div>
              </div>
            </section>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Sliders size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Monitor Brightness</h2>
              </div>
              <div className="p-6 bg-foreground/5 rounded-2xl border border-border/50 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-bold">Brightness Level</Label>
                  <span className="text-xs font-mono text-accent">{brightness}%</span>
                </div>
                <Slider 
                  value={[brightness]} 
                  max={100} 
                  min={10} 
                  step={1} 
                  onValueChange={(v) => setBrightness(v[0])} 
                />
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Info size={12} />
                  <span>Lower brightness to preserve battery life on portable Nebula units.</span>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <MonitorCheck size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Multi-Display Arrangement</h2>
              </div>
              <div className="p-6 bg-foreground/5 rounded-2xl border border-border/50 space-y-4 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You are currently viewing <strong>Display {currentDisplayId}</strong>. To arrange physical displays, use the Multi-Link bridge in Quick Settings.
                </p>
                <Button variant="outline" className="text-[10px] uppercase font-bold" onClick={() => openApp('monitor', 'System Monitor')}>
                  View Video Hardware Stats
                </Button>
              </div>
            </section>
          </div>
        );

      case 'apps':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <AppWindow size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Installed Applications</h2>
              </div>
              
              <div className="grid gap-3">
                {installedApps.map(appId => {
                  const info = APP_INFO[appId];
                  if (!info) return null;
                  const Icon = info.icon;
                  const isSystemApp = ['settings', 'store', 'files', 'assistant'].includes(appId);
                  
                  return (
                    <div key={appId} className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-border/50 group hover:border-accent/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                          <Icon size={24} className="text-accent" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{info.label}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                            {isSystemApp ? "Nebula Core Service" : "Nebula Certified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-accent/10 hover:text-accent"
                          onClick={() => openApp(appId, info.label)}
                        >
                          <ExternalLink size={14} className="mr-2" />
                          Launch
                        </Button>

                        {!isSystemApp && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40"
                              >
                                <Trash size={14} className="mr-2" />
                                Uninstall
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass border-white/10 backdrop-blur-3xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Uninstall {info.label}?</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/60">
                                  This will remove the application and all its data from your current workspace. You can re-install it from the App Store later.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-white hover:bg-destructive/80 font-bold"
                                  onClick={() => uninstallApp(appId)}
                                >
                                  Uninstall
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                <h2 className="text-lg font-bold text-foreground">Visual Enhancements</h2>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">High Contrast Mode</Label>
                    <p className="text-[11px] text-muted-foreground">Invert colors for better readability</p>
                  </div>
                  <Switch checked={isInverted} onCheckedChange={setInverted} />
                </div>
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Grayscale Mode</Label>
                    <p className="text-[11px] text-muted-foreground">Apply a global grayscale filter</p>
                  </div>
                  <Switch checked={isGrayscale} onCheckedChange={setGrayscale} />
                </div>
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-foreground">Aero Glass Effects</Label>
                    <p className="text-[11px] text-muted-foreground">Enable transparency and blur on windows</p>
                  </div>
                  <Switch checked={glassEnabled} onCheckedChange={setGlassEnabled} />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <MousePointer2 size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Cursor Personalization</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {CURSOR_COLORS.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => setCursorColor(c.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      cursorColor === c.id ? "border-accent bg-accent/5" : "border-border/50 bg-foreground/5 hover:bg-foreground/10"
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-background border border-border/50 flex items-center justify-center relative">
                       <MousePointer2 size={16} style={{ color: c.id === 'accent' ? 'var(--accent)' : c.color }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{c.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-foreground/5 rounded-2xl border border-border/50 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-bold">Mouser Scale Meter</Label>
                  <span className="text-xs font-mono text-accent">{mouserScale.toFixed(1)}x</span>
                </div>
                <Slider 
                  value={[mouserScale]} 
                  max={3} 
                  min={1} 
                  step={0.1} 
                  onValueChange={(v) => setMouserScale(v[0])} 
                />
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Info size={12} />
                  <span>Increase cursor size for high-DPI virtual monitors.</span>
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
                  <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black text-muted-foreground hover:text-destructive" onClick={clearNotifications}>
                  <XCircle size={14} className="mr-2" /> Clear History
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 bg-foreground/5 rounded-2xl border border-border/50 flex gap-4 items-start group hover:border-accent/30 transition-colors">
                        <div className={cn(
                          "p-2 rounded-xl shrink-0",
                          n.type === 'security' ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"
                        )}>
                          {n.type === 'security' ? <ShieldAlert size={16} /> : <Zap size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-bold truncate pr-2">{n.title}</h4>
                            <span className="text-[9px] font-mono text-muted-foreground">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <BellOff size={48} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-4">System Quiet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </section>
          </div>
        );

      case 'security':
        if (isSchool || isKid) return <div className="py-20 text-center text-muted-foreground opacity-40 uppercase tracking-widest font-black">Managed Environment Restricted</div>;
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Nebula Defender</h2>
              </div>
              <div className="p-6 bg-accent/5 rounded-3xl border border-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent animate-pulse">
                    <Shield size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold">Active Kernel Protection</h3>
                    <p className="text-[11px] text-muted-foreground">Scanning virtual hardware for anomalies...</p>
                  </div>
                </div>
                <Badge className="bg-green-500 font-bold uppercase text-[9px] tracking-widest">Secured</Badge>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Lock size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Global Lockdown</h2>
              </div>
              <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">System-wide Encryption</Label>
                  <p className="text-[11px] text-muted-foreground">Encrypt virtual file headers at rest</p>
                </div>
                <Switch checked={isSecurityEnabled} onCheckedChange={setSecurityEnabled} />
              </div>
            </section>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User size={18} className={isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent"} />
                <h2 className="text-lg font-bold text-foreground">Identity & Authentication</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 p-6 bg-foreground/5 rounded-3xl border border-border/50">
                  <div className="relative group/avatar">
                    <Avatar className={cn("w-24 h-24 border-4 shadow-2xl", isSchool ? "border-blue-500" : isKid ? "border-pink-500" : "border-accent")}>
                      <AvatarImage src={currentUser?.avatarUrl} />
                      <AvatarFallback 
                        className="text-3xl font-black text-white"
                        style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
                      >
                        {currentUser?.username[0].toUpperCase() || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    {!isSchool && !isKid && (
                      <button 
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera size={24} className="text-white" />
                      </button>
                    )}
                    <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                  </div>
                  
                  <div className="space-y-1 flex-1">
                    <h3 className="text-2xl font-bold text-foreground">{currentUser?.username || 'Guest User'}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("font-bold uppercase text-[9px]", isSchool ? "bg-blue-500" : isKid ? "bg-pink-500" : "bg-accent")}>
                        {isSchool ? "Student Account" : isKid ? "Kid Account" : "Administrator"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{isSchool ? "Managed Education" : isKid ? "Home Managed" : "Local System Account"}</span>
                    </div>
                    {(isSchool || isKid) && (
                      <p className={cn("text-[10px] font-mono mt-2", isSchool ? "text-blue-400/60" : "text-pink-400/60")}>System ID: {currentUser?.uniqueCode}</p>
                    )}
                  </div>
                  <Button variant="outline" className="border-border/50 text-destructive" onClick={logout}>Sign Out</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-foreground/5 rounded-2xl border border-border/50 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <KeyRound size={18} className="text-accent" />
                        <div>
                          <p className="text-sm font-bold text-foreground">Account Protection</p>
                          <p className="text-[10px] text-muted-foreground">{isSchool ? "Managed by District Policy." : isKid ? "Managed by Home Shield." : "Secure your system access."}</p>
                        </div>
                      </div>
                      {!isSchool && !isKid && !isChangingPass && (
                        <Button variant="outline" size="sm" onClick={() => setIsChangingPass(true)}>
                          Update Password
                        </Button>
                      )}
                    </div>

                    {isChangingPass && !isSchool && !isKid && (
                      <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                        <Input 
                          type="password"
                          placeholder="New secure password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-foreground/5"
                        />
                        <div className="flex gap-2">
                          <Button className="bg-accent text-white font-bold flex-1" onClick={() => { updateUserPassword(newPassword); setIsChangingPass(false); }}>Update</Button>
                          <Button variant="ghost" onClick={() => setIsChangingPass(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isSchool && !isKid && (
                    <div className={cn(
                      "rounded-2xl border p-6 space-y-6 transition-all",
                      currentUser?.isWorkAccount ? "bg-accent/5 border-accent/20" : "bg-foreground/5 border-border/50"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 size={18} className={currentUser?.isWorkAccount ? "text-accent" : "text-muted-foreground"} />
                          <div>
                            <p className="text-sm font-bold text-foreground">Work Account</p>
                            <p className="text-[10px] text-muted-foreground">Professional tools access.</p>
                          </div>
                        </div>
                        <Switch 
                          checked={currentUser?.isWorkAccount} 
                          onCheckedChange={updateUserWorkStatus}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        );

      case 'updates':
        if (isKid) return <div className="py-20 text-center text-muted-foreground opacity-40 uppercase tracking-widest font-black">Managed Environment Restricted</div>;
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-2 mb-6">
                <RefreshCw size={18} className="text-accent" />
                <h2 className="text-lg font-bold text-foreground">Kernel Updates</h2>
              </div>
              <div className="p-6 bg-foreground/5 rounded-2xl border border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">System is up to date</h3>
                  <p className="text-[11px] text-muted-foreground">Last checked: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openApp('update', 'System Update')}>Launch Update Tool</Button>
              </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="text-center py-12 space-y-6">
              <div className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse", isSchool ? "bg-blue-500/20" : isKid ? "bg-pink-500/20" : "bg-accent/20")}>
                {isSchool ? <GraduationCap size={40} className="text-blue-400" /> : isKid ? <Smile size={40} className="text-pink-400" /> : <span className="text-4xl font-black text-accent">N</span>}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground">{currentUser?.username || 'User'}'s {biosSettings.deviceType} {biosSettings.deviceName}</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.3em]">
                  {isSchool ? "Education Edition • District Managed" : isKid ? "Home Edition • Managed Child Profile" : "Version 1.0.4 Stable-Channel"}
                </p>
              </div>
              <div className="max-w-md mx-auto p-6 bg-foreground/5 border border-border/50 rounded-3xl text-left space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Device Name</span>
                  <span className="text-foreground font-bold">{biosSettings.deviceType}-{biosSettings.deviceName.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Managed State</span>
                  <span className="text-foreground font-bold">{isSchool ? "DISTRICT-SECURE" : isKid ? "PARENTAL-LOCK" : "UNRESTRICTED"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Unique System ID</span>
                  <span className={cn("font-black", isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent")}>{currentUser?.uniqueCode}</span>
                </div>
              </div>

              <div className="max-w-md mx-auto p-6 bg-accent/5 border border-accent/20 rounded-3xl text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart size={14} className="text-accent fill-accent" />
                  <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">Kernel Credits</p>
                </div>
                <p className="text-sm font-bold text-foreground">Made by Adrian R</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Nebulabs Engineering Division</p>
              </div>
            </section>
          </div>
        );

      default:
        return <div className="py-20 text-center text-muted-foreground opacity-40 uppercase tracking-widest font-black">Feature Restricted</div>;
    }
  };

  return (
    <div className="flex h-full bg-background text-foreground overflow-hidden">
      <div className="w-72 border-r border-border bg-foreground/5 flex flex-col p-4 gap-1 shrink-0 overflow-hidden">
        <h2 className={cn("px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60", isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent")}>
          {isSchool ? "District Terminal" : isKid ? "Home Dashboard" : "System Configuration"}
        </h2>

        <div className="px-4 mb-6 relative">
          <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="h-9 pl-9 bg-foreground/5 border-border/50 text-xs rounded-xl focus-visible:ring-accent"
          />
        </div>
        
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-1 pb-4">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm group", 
                  activeTab === tab.id 
                    ? "bg-accent/10 text-accent font-bold" 
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <tab.icon size={16} className={cn("transition-colors", activeTab === tab.id ? "text-accent" : "group-hover:text-accent/60")} />
                {tab.label}
              </button>
            ))}
            
            {tabs.length === 0 && (
              <div className="py-8 text-center text-[10px] uppercase font-bold text-muted-foreground/40 tracking-widest">
                No matches found
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4 opacity-5" />
        
        <div className="px-4 py-2 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
            <span>Identity Bridge</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border border-border/50">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                {currentUser?.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold truncate">{currentUser?.username}</span>
              <span className="text-[9px] text-muted-foreground truncate uppercase">{isSchool ? 'District Managed' : 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-10">
          <div className="max-w-3xl auto">
            {renderContent()}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
