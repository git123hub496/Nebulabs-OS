
'use client';

import React, { useState, useRef } from 'react';
import { useOS, TaskbarPosition, TaskbarSize, DesktopIconSize, AccentColor, CursorColor, SystemNotification } from '@/context/os-context';
import { 
  Monitor, Palette, User, Shield, Bell, HelpCircle, Upload, 
  Image as ImageIcon, Sun, Moon, Layout, Check, MousePointer2, 
  Eye, Zap, Layers, Pipette, Maximize2, Plus, ArrowUpRight,
  Wifi, ShieldCheck, Activity, Trash2, Info, Newspaper, Clock, XCircle, RefreshCw, ChevronRight, ShieldAlert, ShieldX, Lock, KeyRound, Camera, Building2, Briefcase, GraduationCap
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
    isSecurityEnabled, setSecurityEnabled, updateUserPassword, updateUserAvatar, updateUserWorkStatus
  } = useOS();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personalization');
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const isSchool = currentUser?.isSchoolAccount;

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

                {!isSchool && (
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
              </div>
            </section>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <User size={18} className={isSchool ? "text-blue-400" : "text-accent"} />
                <h2 className="text-lg font-bold text-foreground">Identity & Authentication</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 p-6 bg-foreground/5 rounded-3xl border border-border/50">
                  <div className="relative group/avatar">
                    <Avatar className={cn("w-24 h-24 border-4 shadow-2xl", isSchool ? "border-blue-500" : "border-accent")}>
                      <AvatarImage src={currentUser?.avatarUrl} />
                      <AvatarFallback 
                        className="text-3xl font-black text-white"
                        style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
                      >
                        {currentUser?.username[0].toUpperCase() || 'G'}
                      </AvatarFallback>
                    </Avatar>
                    {!isSchool && (
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
                      <Badge className={cn("font-bold uppercase text-[9px]", isSchool ? "bg-blue-500" : "bg-accent")}>
                        {isSchool ? "Student Account" : "Administrator"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{isSchool ? "NHU-7 Unified District" : "Local System Account"}</span>
                    </div>
                    {isSchool && (
                      <p className="text-[10px] text-blue-400/60 font-mono mt-2">Unique Code: {currentUser?.uniqueCode}</p>
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
                          <p className="text-[10px] text-muted-foreground">{isSchool ? "Managed by NHU-7 District Policy." : "Secure your system access."}</p>
                        </div>
                      </div>
                      {!isSchool && !isChangingPass && (
                        <Button variant="outline" size="sm" onClick={() => setIsChangingPass(true)}>
                          Update Password
                        </Button>
                      )}
                    </div>

                    {isChangingPass && !isSchool && (
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
                    
                    {isSchool && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-widest flex items-center gap-2">
                          <ShieldAlert size={12} /> Password Control Restricted
                        </p>
                      </div>
                    )}
                  </div>

                  {!isSchool && (
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

      case 'about':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="text-center py-12 space-y-6">
              <div className={cn("w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse", isSchool ? "bg-blue-500/20" : "bg-accent/20")}>
                {isSchool ? <GraduationCap size={40} className="text-blue-400" /> : <span className="text-4xl font-black text-accent">N</span>}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground">{currentUser?.username || 'User'}'s NebulaBook 180 Pro</h2>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-[0.3em]">
                  {isSchool ? "Education Edition • District NHU-7" : "Version 1.0.4 Stable-Channel"}
                </p>
              </div>
              <div className="max-w-md mx-auto p-6 bg-foreground/5 border border-border/50 rounded-3xl text-left space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Device Name</span>
                  <span className="text-foreground font-bold">NEBULA-{isSchool ? 'EDU' : 'PRO'}-{currentUser?.id.slice(0, 4).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">District Code</span>
                  <span className="text-foreground font-bold">{isSchool ? "NHU-7-SECURE" : "UNRESTRICTED"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase font-bold tracking-widest">Unique System ID</span>
                  <span className="text-accent font-black">{currentUser?.uniqueCode}</span>
                </div>
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
      <div className="w-64 border-r border-border bg-foreground/5 flex flex-col p-4 gap-1 shrink-0 overflow-y-auto">
        <h2 className={cn("px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60", isSchool ? "text-blue-400" : "text-accent")}>
          {isSchool ? "District Terminal" : "System Configuration"}
        </h2>
        
        <button 
          onClick={() => setActiveTab('personalization')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'personalization' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Palette size={16} /> Personalization
        </button>
        
        <button 
          onClick={() => setActiveTab('display')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'display' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Monitor size={16} /> Display
        </button>
        
        <button 
          onClick={() => setActiveTab('accessibility')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'accessibility' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Eye size={16} /> Accessibility
        </button>
        
        <button 
          onClick={() => setActiveTab('notifications')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'notifications' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <Bell size={16} /> Notifications
        </button>
        
        <Separator className="my-4 opacity-5 mx-2" />
        
        <button 
          onClick={() => setActiveTab('accounts')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'accounts' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <User size={16} /> {isSchool ? "Student Profile" : "User Accounts"}
        </button>
        
        {!isSchool && (
          <button 
            onClick={() => setActiveTab('security')}
            className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'security' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
          >
            <Shield size={16} /> Security
          </button>
        )}
        
        <button 
          onClick={() => setActiveTab('about')}
          className={cn("w-full flex items-center gap-3 px-4 h-11 rounded-xl transition-all text-sm", activeTab === 'about' ? "bg-accent/10 text-accent font-bold" : "text-muted-foreground hover:bg-foreground/5")}
        >
          <HelpCircle size={16} /> About
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
