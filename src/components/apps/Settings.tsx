
'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useOS, TaskbarPosition, TaskbarSize, DesktopIconSize, AccentColor, CursorColor, CursorShape, AppId, APP_INFO } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, BellOff, HelpCircle, Upload, 
  ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette, Maximize2, Plus, ArrowUpRight,
  Wifi, ShieldCheck, Activity, Trash2, Info, Newspaper, Clock, XCircle, RefreshCw, ChevronRight, ShieldAlert, ShieldX, Lock, KeyRound, Camera, Building2, Briefcase, GraduationCap, Heart, MonitorCheck, Sliders, Smartphone, Smile, Home, Search, AppWindow, ExternalLink,
  Trash, EyeOff, LogOut, Code2, Download
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

type SettingsTab = 'personalization' | 'display' | 'apps' | 'accessibility' | 'notifications' | 'accounts' | 'security' | 'updates' | 'about';

interface SettingsProps {
  tab?: SettingsTab;
}

const ACCENT_COLORS: { id: AccentColor; class: string; label: string }[] = [
  { id: 'purple', class: 'bg-[#9333ea]', label: 'Purple' },
  { id: 'blue', class: 'bg-[#3b82f6]', label: 'Blue' },
  { id: 'rose', class: 'bg-[#e11d48]', label: 'Rose' },
  { id: 'orange', class: 'bg-[#f97316]', label: 'Orange' },
  { id: 'green', class: 'bg-[#16a34a]', label: 'Green' },
  { id: 'grey', class: 'bg-[#64748b]', label: 'Slate Grey' },
  { id: 'default', class: 'bg-black/20 border-white/10', label: 'Nebula' },
];

export const Settings: React.FC<SettingsProps> = ({ tab }) => {
  const { 
    wallpaper, updateWallpaper, theme, setTheme, taskbarPosition, setTaskbarPosition, 
    taskbarSize, setTaskbarSize, taskbarTransparency, setTaskbarTransparency, appTransparency, setAppTransparency, isTaskbarAutoHide, setTaskbarAutoHide, iconSize, setIconSize,
    accentColor, setAccentColor, customAccentHex, 
    cursorColor, setCursorColor, cursorShape, setCursorShape, customCursorUrl, setCustomCursorUrl, mouserScale, setMouserScale, isInverted, setInverted,
    isGrayscale, setGrayscale,
    glassEnabled, setGlassEnabled, brightness, setBrightness,
    currentDisplayId, setCurrentDisplayId, displayLayout, updateDisplayLayout, resetDisplayLayout,
    currentUser, logout, notifications, clearNotifications, addNotification, openApp,
    isSecurityEnabled, setSecurityEnabled, updateUserPassword, updateUserAvatar, updateUserWorkStatus,
    installedApps, uninstallApp, biosSettings, factoryReset, isNDEEnabled, setIsNDEEnabled,
    exportAccount
  } = useOS();

  const [activeTab, setActiveTab] = useState<SettingsTab>(tab || 'personalization');
  const [searchQuery, setSearchQuery] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const tabs = useMemo(() => {
    const allTabs: { id: SettingsTab; label: string; icon: any; keywords: string[] }[] = [
      { id: 'personalization', label: 'Personalization', icon: Palette, keywords: ['theme', 'wallpaper', 'taskbar', 'accent', 'color', 'dark mode', 'light mode', 'transparency'] },
      { id: 'display', label: 'Display', icon: Monitor, keywords: ['brightness', 'monitor', 'screen', 'resolution', 'multi-display'] },
      { id: 'apps', label: 'Apps', icon: AppWindow, keywords: ['installed', 'applications', 'software', 'management', 'uninstall'] },
      { id: 'accessibility', label: 'Accessibility', icon: Eye, keywords: ['contrast', 'grayscale', 'glass', 'transparency', 'cursor', 'pointer', 'mouse', 'scale', 'custom'] },
      { id: 'notifications', label: 'Notifications', icon: Bell, keywords: ['alerts', 'messages', 'activity', 'dnd'] },
      { id: 'accounts', label: 'Accounts', icon: User, keywords: ['profile', 'identity', 'password', 'avatar', 'user', 'sign out', 'export', 'backup'] },
      { id: 'security', label: 'Security', icon: Shield, keywords: ['encryption', 'lockdown', 'defender', 'kernel', 'developer', 'nde'] },
      { id: 'updates', label: 'Updates', icon: RefreshCw, keywords: ['patch', 'kernel', 'version', 'check for updates'] },
      { id: 'about', label: 'About', icon: HelpCircle, keywords: ['system', 'device', 'credits', 'nebulabs', 'version', 'reset', 'factory'] },
    ];
    if (!searchQuery) return allTabs;
    return allTabs.filter(tab => tab.label.toLowerCase().includes(searchQuery.toLowerCase()) || tab.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);

  const isRestricted = currentUser?.isSchoolAccount || currentUser?.isKidAccount;

  const renderContent = () => {
    switch (activeTab) {
      case 'personalization':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6"><Zap size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Theme & Style</h2></div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-accent/10 text-accent">{theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}</div><div className="space-y-0.5"><Label className="text-sm font-bold text-foreground">Interface Theme</Label><p className="text-[11px] text-muted-foreground">Switch between light and dark modes</p></div></div>
                  <div className="flex items-center gap-3"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dark</span><Switch checked={theme === 'light'} onCheckedChange={(checked) => setTheme(checked ? 'light' : 'dark')} /><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Light</span></div>
                </div>
                <div className="space-y-4"><Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accent Color</Label><div className="grid grid-cols-7 gap-4">{ACCENT_COLORS.map((color) => (<button key={color.id} onClick={() => setAccentColor(color.id)} className={cn("group relative aspect-square rounded-2xl flex items-center justify-center border-2 transition-all", color.class, accentColor === color.id ? "border-foreground scale-110 shadow-xl" : "border-transparent opacity-80 hover:opacity-100")}>{accentColor === color.id && <Check size={20} className="text-white drop-shadow-md" />}</button>))}</div></div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6"><Layers size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Interface Transparency</h2></div>
              <div className="space-y-8 bg-foreground/5 p-6 rounded-3xl border border-border/50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><Label className="text-sm font-bold">Taskbar Transparency</Label><span className="text-xs font-mono text-accent">{taskbarTransparency}%</span></div>
                  <Slider value={[taskbarTransparency]} max={100} min={0} step={1} onValueChange={(vals) => setTaskbarTransparency(vals[0])} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><Label className="text-sm font-bold">App Window Transparency</Label><span className="text-xs font-mono text-accent">{appTransparency}%</span></div>
                  <Slider value={[appTransparency]} max={100} min={0} step={1} onValueChange={(vals) => setAppTransparency(vals[0])} />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><ImageIcon size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Desktop Wallpaper</h2></div><Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest gap-2 border-white/10 text-white/60 hover:text-accent hover:border-accent/40" onClick={() => wallpaperInputRef.current?.click()}><Upload size={12} />Upload Background</Button><input type="file" ref={wallpaperInputRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => updateWallpaper(event.target?.result as string); reader.readAsDataURL(file); } }} /></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{PlaceHolderImages.filter(img => img.id.startsWith('wallpaper-')).map((img) => (<button key={img.id} onClick={() => updateWallpaper(img.imageUrl)} className={cn("relative aspect-video rounded-xl overflow-hidden border-2 transition-all group", wallpaper === img.imageUrl ? "border-accent scale-105 shadow-xl shadow-accent/20 z-10" : "border-transparent opacity-70 hover:opacity-100")}><img src={img.imageUrl} alt={img.description} className="w-full h-full object-cover" />{wallpaper === img.imageUrl && (<div className="absolute inset-0 bg-accent/20 flex items-center justify-center backdrop-blur-[2px]"><div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg"><Check size={20} className="text-white" /></div></div>)}</button>))}</div>
            </section>
          </div>
        );
      case 'display':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6"><Sun size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Brightness & Layout</h2></div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><Label className="text-sm font-bold">Screen Brightness</Label><span className="text-xs font-mono text-accent">{brightness}%</span></div>
                  <Slider value={[brightness]} max={100} min={10} step={1} onValueChange={(vals) => setBrightness(vals[0])} />
                </div>
                {!isRestricted && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Taskbar Position</Label>
                      <Select value={taskbarPosition} onValueChange={(v) => setTaskbarPosition(v as any)}>
                        <SelectTrigger className="h-11 rounded-xl bg-foreground/5 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent className="glass border-white/10"><SelectItem value="bottom">Bottom</SelectItem><SelectItem value="top">Top</SelectItem><SelectItem value="left">Left</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Icon Scaling</Label>
                      <Select value={String(iconSize)} onValueChange={(v) => setIconSize(Number(v))}>
                        <SelectTrigger className="h-11 rounded-xl bg-foreground/5 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent className="glass border-white/10"><SelectItem value="80">Compact (80%)</SelectItem><SelectItem value="100">Standard (100%)</SelectItem><SelectItem value="120">Large (120%)</SelectItem><SelectItem value="150">Ultra (150%)</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'apps':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6"><AppWindow size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Installed Applications</h2></div>
              <div className="grid gap-3">
                {installedApps.map(appId => (
                  <div key={appId} className="flex items-center justify-between p-4 bg-foreground/5 rounded-2xl border border-border/50 group hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">{React.createElement(APP_INFO[appId].icon, { size: 20 })}</div>
                      <div className="space-y-0.5"><p className="text-sm font-bold text-foreground">{APP_INFO[appId].label}</p><p className="text-[10px] text-muted-foreground uppercase font-medium">Nebula Stable Build</p></div>
                    </div>
                    {!['settings', 'store', 'files'].includes(appId) && !isRestricted && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => uninstallApp(appId)}><Trash size={16} /></Button>
                    )}
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
              <div className="flex items-center gap-2 mb-6"><Eye size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Vision & Interaction</h2></div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-accent/10 text-accent"><MousePointer2 size={20} /></div><div className="space-y-0.5"><Label className="text-sm font-bold">Pointer Color</Label><p className="text-[11px] text-muted-foreground">Customize the hardware cursor style</p></div></div>
                  <Select value={cursorColor} onValueChange={(v) => setCursorColor(v as any)}>
                    <SelectTrigger className="w-32 rounded-xl bg-foreground/5 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent className="glass border-white/10"><SelectItem value="black">Black</SelectItem><SelectItem value="white">White</SelectItem><SelectItem value="accent">System Accent</SelectItem></SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-accent/10 text-accent"><MousePointer2 size={20} className="rotate-[-45deg]" /></div><div className="space-y-0.5"><Label className="text-sm font-bold">Pointer Architecture</Label><p className="text-[11px] text-muted-foreground">Select hardware cursor geometry</p></div></div>
                  <Select value={cursorShape} onValueChange={(v) => setCursorShape(v as any)}>
                    <SelectTrigger className="w-40 rounded-xl bg-foreground/5 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="nebula">Classic Nebula</SelectItem>
                      <SelectItem value="windows">Windows 11</SelectItem>
                      <SelectItem value="macos">macOS Pro</SelectItem>
                      <SelectItem value="custom">Custom Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cursorShape === 'custom' && (
                  <div className="p-5 bg-accent/5 rounded-2xl border border-accent/20 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-sm font-bold">Custom Pointer Image</Label>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold gap-2" onClick={() => cursorInputRef.current?.click()}>
                        <Upload size={12} /> Upload Image
                      </Button>
                      <input type="file" ref={cursorInputRef} className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => setCustomCursorUrl(event.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                    {customCursorUrl ? (
                      <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                          <img src={customCursorUrl} alt="custom cursor" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-white/60 truncate">Pointer active</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setCustomCursorUrl("")}>
                          <Trash size={14} />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/40 italic">No image uploaded. (Suggested size: 32x32px)</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-accent/10 text-accent"><Pipette size={20} /></div><div className="space-y-0.5"><Label className="text-sm font-bold">Grayscale Mode</Label><p className="text-[11px] text-muted-foreground">Remove all interface colors</p></div></div>
                  <Switch checked={isGrayscale} onCheckedChange={setGrayscale} />
                </div>
                <div className="flex items-center justify-between p-5 bg-foreground/5 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-4"><div className="p-2.5 rounded-xl bg-accent/10 text-accent"><EyeOff size={20} /></div><div className="space-y-0.5"><Label className="text-sm font-bold">Inverted Colors</Label><p className="text-[11px] text-muted-foreground">Reverse system color values</p></div></div>
                  <Switch checked={isInverted} onCheckedChange={setInverted} />
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cursor Scaling</Label>
                  <Slider value={[mouserScale * 100]} max={300} min={50} step={10} onValueChange={(vals) => setMouserScale(vals[0] / 100)} />
                </div>
              </div>
            </section>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6"><Bell size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Alert History</h2></div>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-between h-12 rounded-xl" onClick={clearNotifications}>
                  <span>Clear All System Alerts</span>
                  <Trash size={14} className="text-destructive" />
                </Button>
                <div className="grid gap-2">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-4 bg-foreground/5 rounded-xl border border-border/50 space-y-1">
                      <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-accent">{n.type}</span><span className="text-[10px] opacity-40">{n.timestamp}</span></div>
                      <p className="text-sm font-bold">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-muted-foreground opacity-40 uppercase tracking-widest font-black">No Recent Alerts</div>
                  )}
                </div>
              </div>
            </section>
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6"><User size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Identity & Security</h2></div>
              <div className="bg-foreground/5 border border-border/50 rounded-3xl p-8 flex flex-col items-center text-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-accent shadow-2xl">
                    <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black text-white" style={{ backgroundColor: currentUser?.avatarColor }}>{currentUser?.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => avatarInputRef.current?.click()}><Camera size={24} className="text-white" /></button>
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => updateUserAvatar(event.target?.result as string); reader.readAsDataURL(file); } }} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight">{currentUser?.username}</h3>
                  <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em]">{currentUser?.uniqueCode || 'SYSTEM_ADMIN'}</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <div className="flex gap-2">
                    {!isRestricted && (
                      <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs font-bold uppercase tracking-widest border-border/50" onClick={() => {
                        const pass = prompt("Enter new credentials:");
                        if (pass) updateUserPassword(pass);
                      }}><Lock size={14} className="mr-2" /> Passcode</Button>
                    )}
                    <Button variant="outline" className="flex-1 rounded-xl h-11 text-xs font-bold uppercase tracking-widest text-destructive border-destructive/20 hover:bg-destructive/10" onClick={logout}><LogOut size={14} className="mr-2" /> Sign Out</Button>
                  </div>
                  
                  {!currentUser?.isGuest && (
                    <Button 
                      className="w-full rounded-xl h-11 bg-accent text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-accent/20 gap-2"
                      onClick={() => currentUser && exportAccount(currentUser.id)}
                    >
                      <Download size={16} />
                      Backup Identity (.nwuser)
                    </Button>
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
              <div className="flex items-center gap-2 mb-6"><Shield size={18} className="text-accent" /><h2 className="text-lg font-bold text-foreground">Kernel Security</h2></div>
              <div className="space-y-6">
                <div className="p-6 bg-accent/5 border border-accent/20 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent"><ShieldCheck size={20} /></div>
                      <div className="space-y-0.5"><p className="text-sm font-bold">Nebula Defender</p><p className="text-[10px] text-muted-foreground">Real-time heuristic threat analysis</p></div>
                    </div>
                    <Switch checked={isSecurityEnabled} onCheckedChange={setSecurityEnabled} disabled={isRestricted} />
                  </div>
                  <Separator className="bg-accent/10" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1"><p className="text-[10px] font-bold text-muted-foreground uppercase">Encryption</p><p className="text-sm font-black text-accent">AES-256-GCM</p></div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1"><p className="text-[10px] font-bold text-muted-foreground uppercase">Partition Status</p><p className="text-sm font-black text-green-500">Verified Secure</p></div>
                  </div>
                </div>

                {!isRestricted && (
                  <div className="p-6 bg-foreground/5 border border-border/50 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60"><Code2 size={20} /></div>
                        <div className="space-y-0.5"><p className="text-sm font-bold text-foreground">Developer Mode (NDE)</p><p className="text-[10px] text-muted-foreground">Enable Nebulabs Dev Environment suite</p></div>
                      </div>
                      <Switch checked={isNDEEnabled} onCheckedChange={setIsNDEEnabled} />
                    </div>
                    {isNDEEnabled && (
                      <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 animate-in slide-in-from-top-2">
                        <p className="text-[10px] text-accent font-bold uppercase leading-relaxed">NDE Active: Access via Alt+D or Start Menu. Kernel telemetry hooks enabled.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'updates':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="text-center py-12 space-y-6">
              <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center mx-auto shadow-2xl animate-spin-slow"><RefreshCw size={32} className="text-accent" /></div>
              <div className="space-y-2"><h2 className="text-2xl font-black tracking-tight text-foreground">System is Up to Date</h2><p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Nebula Core build_4.5.2_stable</p></div>
              {!isRestricted && (
                <Button className="bg-accent text-primary-foreground font-black px-10 h-12 rounded-xl uppercase tracking-widest shadow-xl shadow-accent/20" onClick={() => openApp('update', 'System Update')}>Check for Patches</Button>
              )}
            </section>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="text-center py-12 space-y-6">
              <div className="w-24 h-24 rounded-[2.5rem] bg-accent/20 flex items-center justify-center mx-auto shadow-2xl animate-pulse"><span className="text-4xl font-black text-accent">N</span></div>
              <div className="space-y-2"><h2 className="text-3xl font-black tracking-tight text-foreground">{biosSettings.deviceType} {biosSettings.deviceName}</h2><p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.3em]">Version 1.0.4 Stable-Channel</p></div>
              {!isRestricted && (
                <div className="max-w-md mx-auto p-6 bg-destructive/5 border border-destructive/20 rounded-3xl text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-1"><Trash2 size={14} className="text-destructive" /><p className="text-[10px] font-black uppercase text-destructive tracking-[0.2em]">System Recovery</p></div>
                  <p className="text-sm font-bold text-foreground">Factory Reset</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Erases all accounts, files, and settings. This action cannot be undone.</p>
                  <Button variant="destructive" className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[10px]" onClick={factoryReset}>Reset Nebula WebOS</Button>
                </div>
              )}
            </section>
          </div>
        );
      default:
        return <div className="py-20 text-center text-muted-foreground opacity-40 uppercase tracking-widest font-black">Unknown Configuration</div>;
    }
  };

  return (
    <div className="flex h-full bg-background text-foreground overflow-hidden">
      <div className="w-72 border-r border-border bg-foreground/5 flex flex-col p-4 gap-1 shrink-0 overflow-hidden">
        <h2 className="px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60 text-accent">System Configuration</h2>
        <div className="px-4 mb-6 relative"><Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground/40" /><Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search settings..." className="h-9 pl-9 bg-foreground/5 border-border/50 text-xs rounded-xl focus-visible:ring-accent" /></div>
        <ScrollArea className="flex-1 -mx-2 px-2"><div className="space-y-1 pb-4">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm group", activeTab === tab.id ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground")}><tab.icon size={16} className={cn("transition-colors", activeTab === tab.id ? "text-accent" : "group-hover:text-accent/60")} />{tab.label}</button>))}</div></ScrollArea>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col"><ScrollArea className="flex-1 p-10"><div className="max-w-3xl auto">{renderContent()}</div></ScrollArea></div>
    </div>
  );
};
