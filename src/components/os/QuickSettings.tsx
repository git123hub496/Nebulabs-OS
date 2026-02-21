"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  Volume1,
  VolumeX, 
  Sun, 
  Moon, 
  Settings, 
  Power, 
  LogOut, 
  Bell, 
  BellOff, 
  Monitor,
  Check,
  ChevronRight,
  Plus,
  Layout,
  RefreshCcw
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const QuickSettings: React.FC = () => {
  const { 
    isQuickSettingsOpen, setIsQuickSettingsOpen, 
    theme, setTheme, 
    volume, setVolume, 
    brightness, setBrightness,
    currentWifi, isOnline, connectToWifi,
    currentUser, logout, shutDown, openApp,
    taskbarPosition, currentDisplayId, setCurrentDisplayId,
    displayLayout, updateDisplayLayout, resetDisplayLayout,
    playSound
  } = useOS();

  if (!isQuickSettingsOpen) return null;

  const [isDND, setIsDND] = React.useState(false);

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';

  const positionClasses = {
    bottom: 'bottom-14 right-4 animate-in slide-in-from-bottom-2 origin-bottom-right',
    top: 'top-14 right-4 animate-in slide-in-from-top-2 origin-top-right',
    left: 'left-14 bottom-4 animate-in slide-in-from-left-2 origin-bottom-left',
    right: 'right-14 bottom-4 animate-in slide-in-from-right-2 origin-bottom-right',
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    playSound('click');
  };

  const addDisplay = () => {
    window.open(window.location.href, '_blank', 'width=1280,height=720');
    playSound('click');
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div 
      className={cn(
        "fixed glass rounded-2xl border border-white/10 shadow-2xl z-[9999] p-6 flex flex-col gap-6",
        isVertical ? "w-[320px]" : "w-[380px]",
        positionClasses[taskbarPosition]
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={cn("flex items-center justify-between", isVertical ? "flex-col gap-4 items-start" : "")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="w-10 h-10 border-2 border-accent/20 shrink-0">
            <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
            <AvatarFallback 
              className="text-white font-bold"
              style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
            >
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">{currentUser?.username || 'Guest'}</span>
            <span className="text-[10px] text-accent font-medium uppercase tracking-tighter">System Administrator</span>
          </div>
        </div>
        <div className={cn("flex items-center gap-2", isVertical ? "w-full justify-between border-t border-white/5 pt-4" : "")}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              openApp('settings', 'Settings');
              setIsQuickSettingsOpen(false);
            }}
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={() => {
              playSound('click');
              shutDown();
            }}
          >
            <Power size={18} />
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-3", isVertical ? "grid-cols-1" : "grid-cols-2")}>
        <button 
          onClick={() => {
            playSound('click');
            connectToWifi(isOnline ? 'Public_Guest_No_Internet' : 'Nebula_Secure_5G');
          }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            isOnline ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
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
            <button 
              className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 transition-all text-left"
              onClick={() => playSound('click')}
            >
              <Monitor size={18} className="text-accent" />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-foreground">Displays</span>
                <span className="text-[9px] truncate opacity-60">ID: {currentDisplayId}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="glass border-white/10 w-56 backdrop-blur-3xl shadow-2xl">
             <div className="px-2 py-1.5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Identify This Screen</div>
             {['1', '2', '3'].map(id => (
               <DropdownMenuItem 
                 key={id} 
                 onClick={() => {
                   playSound('click');
                   setCurrentDisplayId(id);
                 }}
                 className="gap-2"
               >
                 <Monitor size={12} className={id === currentDisplayId ? "text-accent" : ""} />
                 Display {id} {id === currentDisplayId ? '(This Tab)' : ''}
               </DropdownMenuItem>
             ))}
             
             <Separator className="my-1 bg-white/5" />
             <div className="px-2 py-1.5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Physical Layout</div>
             
             {['1', '2', '3'].map(fromId => (
               <DropdownMenuSub key={fromId}>
                 <DropdownMenuSubTrigger className="gap-2 text-[11px]">
                   <Layout size={12} />
                   Arrange Display {fromId}
                 </DropdownMenuSubTrigger>
                 <DropdownMenuSubContent className="glass border-white/10 w-48 backdrop-blur-3xl shadow-2xl">
                    {['left', 'right', 'top', 'bottom'].map(dir => (
                      <DropdownMenuSub key={dir}>
                        <DropdownMenuSubTrigger className="text-[10px]">{dir} is...</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="glass border-white/10 backdrop-blur-3xl">
                          <DropdownMenuItem onClick={() => { playSound('click'); updateDisplayLayout(fromId, dir as any, 'none'); }} className="text-[10px]">
                            None
                            {!displayLayout[fromId]?.[dir as any] && <Check size={12} className="ml-auto text-accent" />}
                          </DropdownMenuItem>
                          {['1', '2', '3'].filter(id => id !== fromId).map(toId => (
                            <DropdownMenuItem 
                              key={toId} 
                              onClick={(e) => {
                                e.stopPropagation();
                                playSound('click');
                                updateDisplayLayout(fromId, dir as any, toId);
                              }}
                              className="text-[10px]"
                            >
                              Display {toId}
                              {displayLayout[fromId]?.[dir as any] === toId && <Check size={12} className="ml-auto text-accent" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ))}
                 </DropdownMenuSubContent>
               </DropdownMenuSub>
             ))}

             <Separator className="my-1 bg-white/5" />
             <DropdownMenuItem onClick={() => { playSound('click'); resetDisplayLayout(); }} className="gap-2 text-destructive">
               <RefreshCcw size={12} />
               Reset All Arrangements
             </DropdownMenuItem>
             <DropdownMenuItem onClick={addDisplay} className="gap-2 text-accent">
               <Plus size={12} />
               Connect New Display
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button 
          onClick={handleToggleTheme}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            theme === 'dark' ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
          )}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">Dark Mode</span>
            <span className="text-[9px] opacity-60">{theme === 'dark' ? 'Enabled' : 'Disabled'}</span>
          </div>
        </button>

        <button 
          onClick={() => {
            playSound('click');
            setIsDND(!isDND);
          }}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
            isDND ? "bg-accent/20 border-accent/30 text-accent" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
          )}
        >
          {isDND ? <BellOff size={18} /> : <Bell size={18} />}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold">Notifications</span>
            <span className="text-[9px] opacity-60">{isDND ? 'Do Not Disturb' : 'Enabled'}</span>
          </div>
        </button>
      </div>

      <div className="space-y-6 px-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <VolumeIcon size={12} className="text-accent" />
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

      <div className={cn("flex items-center justify-between", isVertical ? "flex-col items-start gap-4" : "")}>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Nebula Multi-Link Active</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-[10px] font-bold gap-2 border-border/50 hover:bg-destructive hover:text-white hover:border-destructive transition-all rounded-xl text-foreground"
          onClick={() => {
            playSound('click');
            logout();
          }}
        >
          <LogOut size={12} />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
