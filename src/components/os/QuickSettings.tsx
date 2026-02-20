
"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Settings, 
  Power, 
  LogOut, 
  Bell, 
  BellOff, 
  Zap, 
  Shield, 
  Bluetooth, 
  Monitor,
  Check,
  ChevronRight,
  Maximize2,
  Plus
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const QuickSettings: React.FC = () => {
  const { 
    isQuickSettingsOpen, setIsQuickSettingsOpen, 
    theme, setTheme, 
    volume, setVolume, 
    brightness, setBrightness,
    currentWifi, isOnline, connectToWifi,
    currentUser, logout, shutDown, openApp,
    taskbarPosition, accentColor, currentDisplayId, setCurrentDisplayId
  } = useOS();

  if (!isQuickSettingsOpen) return null;

  const [isDND, setIsDND] = React.useState(false);
  const [isNightLight, setIsNightLight] = React.useState(false);

  const positionClasses = {
    bottom: 'bottom-14 right-4 animate-in slide-in-from-bottom-2 origin-bottom-right',
    top: 'top-14 right-4 animate-in slide-in-from-top-2 origin-top-right',
    left: 'left-14 bottom-4 animate-in slide-in-from-left-2 origin-bottom-left',
    right: 'right-14 bottom-4 animate-in slide-in-from-right-2 origin-bottom-right',
  };

  const handleToggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const addDisplay = () => {
    // Determine next display ID based on current ID
    const nextId = String(parseInt(currentDisplayId) + 1);
    window.open(window.location.href, '_blank', 'width=1280,height=720');
    // Note: The new window will need to be manually identified as Display X 
    // or we can pass it via URL params if we were using a more complex router.
  };

  return (
    <div 
      className={cn(
        "fixed w-[360px] glass rounded-2xl border border-white/10 shadow-2xl z-[9999] p-6 flex flex-col gap-6",
        positionClasses[taskbarPosition]
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header: User & Global Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-accent/20">
            <AvatarFallback 
              className="text-white font-bold"
              style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
            >
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/90 truncate">{currentUser?.username || 'Guest'}</span>
            <span className="text-[10px] text-accent font-medium uppercase tracking-tighter">System Administrator</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-white/40 hover:text-accent hover:bg-accent/10 rounded-xl"
            onClick={() => {
              openApp('settings', 'Settings');
              setIsQuickSettingsOpen(false);
            }}
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={shutDown}
          >
            <Power size={18} />
          </Button>
        </div>
      </div>

      {/* Grid: Feature Toggles */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => connectToWifi(isOnline ? 'Public_Guest_No_Internet' : 'Nebula_Secure_5G')}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            isOnline ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
          )}
        >
          {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold">WiFi</span>
            <span className="text-[9px] truncate opacity-60">{isOnline ? currentWifi : 'Disconnected'}</span>
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/5 text-white/40 hover:bg-white/10 transition-all text-left">
              <Monitor size={18} className="text-accent" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-white/80">Displays</span>
                <span className="text-[9px] truncate opacity-60">ID: {currentDisplayId}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-white/10 w-48">
             <div className="px-2 py-1.5 text-[10px] font-black uppercase text-white/30 tracking-widest">Identify This Display</div>
             {['1', '2', '3'].map(id => (
               <DropdownMenuItem 
                 key={id} 
                 onClick={() => setCurrentDisplayId(id)}
                 className="gap-2"
               >
                 <Monitor size={12} className={id === currentDisplayId ? "text-accent" : ""} />
                 Display {id} {id === currentDisplayId ? '(Selected)' : ''}
               </DropdownMenuItem>
             ))}
             <Separator className="my-1 bg-white/5" />
             <DropdownMenuItem onClick={addDisplay} className="gap-2 text-accent">
               <Plus size={12} />
               Add Virtual Display
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button 
          onClick={handleToggleTheme}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            theme === 'dark' ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
          )}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">Dark Mode</span>
            <span className="text-[9px] opacity-60">{theme === 'dark' ? 'Enabled' : 'Disabled'}</span>
          </div>
        </button>

        <button 
          onClick={() => setIsDND(!isDND)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            isDND ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
          )}
        >
          {isDND ? <BellOff size={18} /> : <Bell size={18} />}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">Notifications</span>
            <span className="text-[9px] opacity-60">{isDND ? 'Do Not Disturb' : 'Enabled'}</span>
          </div>
        </button>
      </div>

      {/* Sliders: Brightness & Volume */}
      <div className="space-y-6 px-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
            <div className="flex items-center gap-2">
              <Sun size={12} className="text-accent" />
              <span>Display Brightness</span>
            </div>
            <span>{brightness}%</span>
          </div>
          <Slider 
            value={[brightness]} 
            max={100} 
            min={10}
            step={1} 
            onValueChange={(vals) => setBrightness(vals[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
            <div className="flex items-center gap-2">
              {volume === 0 ? <VolumeX size={12} className="text-accent" /> : <Volume1 size={12} className="text-accent" />}
              <span>System Volume</span>
            </div>
            <span>{volume}%</span>
          </div>
          <Slider 
            value={[volume]} 
            max={100} 
            step={1} 
            onValueChange={(vals) => setVolume(vals[0])}
            className="cursor-pointer"
          />
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Footer: Date & Logout */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white/80">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Nebula Kernel v1.0.4</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-[10px] font-bold gap-2 border-white/10 hover:bg-destructive hover:text-white hover:border-destructive transition-all rounded-xl"
          onClick={logout}
        >
          <LogOut size={12} />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
