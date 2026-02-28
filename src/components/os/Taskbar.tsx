
'use client';

import React, { useState, useEffect } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { 
  Wifi, 
  Volume2, 
  MessageCircle, 
  PinOff, 
  EyeOff, 
  LayoutGrid, 
  BatteryMedium, 
  VolumeX, 
  Volume1, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  ChevronUp, 
  Eye, 
  RotateCw, 
  Loader2,
  GraduationCap,
  Smile,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StartMenu } from './StartMenu';
import { QuickSettings } from './QuickSettings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const Taskbar: React.FC = () => {
  const { 
    openWindows, activeWindowId, openApp, taskbarPosition, taskbarSize, taskbarTransparency, rotateTaskbar,
    isWifiConnecting, volume, isOnline, isWidgetsOpen, setIsWidgetsOpen, 
    pinnedApps, reorderPinnedApps, togglePinApp, isTaskbarAutoHide, setTaskbarAutoHide,
    isQuickSettingsOpen, setIsQuickSettingsOpen, isStartOpen, setIsStartOpen,
    isChatOpen, setIsChatOpen, playSound, currentUser, minimizeAllWindows
  } = useOS();
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<AppId | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [taskbarMenu, setTaskbarMenu] = useState<{ x: number, y: number, type: 'taskbar' | 'app', appId?: AppId } | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&igu=1`;
      openApp('browser', 'Nebula Browser', { url });
      setSearchTerm("");
    }
  };

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';
  const isSchool = currentUser?.isSchoolAccount;
  const isKid = currentUser?.isKidAccount;

  const safeTaskbarSize = isNaN(taskbarSize) ? 48 : taskbarSize;
  const iconSize = Math.max(12, Math.floor(safeTaskbarSize * 0.45));
  const logoFontSize = Math.max(14, Math.floor(safeTaskbarSize * 0.5));

  const handleDragStart = (id: AppId, index: number) => {
    setDraggingAppId(id);
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      setTargetIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && targetIndex !== null) {
      const newOrder = [...pinnedApps];
      const [removed] = newOrder.splice(dragIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      reorderPinnedApps(newOrder);
    }
    setDraggingAppId(null);
    setDragIndex(null);
    setTargetIndex(null);
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    setTaskbarMenu({ x, y, type: 'taskbar' });
  };

  const handleAppContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    setTaskbarMenu({ x, y, type: 'app', appId });
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const isHidden = isTaskbarAutoHide && !isHovered && !isStartOpen && !isQuickSettingsOpen && !isChatOpen && !isWidgetsOpen;
  
  const hideTransforms = {
    bottom: isHidden ? 'translateY(100%)' : 'translateY(0)',
    top: isHidden ? 'translateY(-100%)' : 'translateY(0)',
    left: isHidden ? 'translateX(-100%)' : 'translateX(0)',
    right: isHidden ? 'translateX(100%)' : 'translateX(0)',
  };

  const bgStyle = {
    backgroundColor: `hsl(var(--background) / ${taskbarTransparency / 100})`,
    borderColor: `hsl(var(--border) / ${taskbarTransparency / 100})`
  };

  return (
    <>
      {isTaskbarAutoHide && (
        <div 
          className={cn("fixed z-[9998] bg-transparent h-1 bottom-0 left-0 right-0 cursor-pointer")}
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <div 
        className={cn(
          "fixed grid z-[9999] transition-all duration-500 ease-in-out backdrop-blur-3xl",
          taskbarPosition === 'bottom' && "bottom-0 left-0 right-0 border-t",
          taskbarPosition === 'top' && "top-0 left-0 right-0 border-b",
          taskbarPosition === 'left' && "left-0 top-0 bottom-0 border-r",
          taskbarPosition === 'right' && "right-0 top-0 bottom-0 border-l",
          isVertical ? "grid-rows-[auto_1fr_auto] py-2" : "grid-cols-[1fr_auto_1fr] items-center px-4",
          isSchool && "border-blue-500/20",
          isKid && "border-pink-500/20"
        )}
        style={{
          [isVertical ? 'width' : 'height']: `${safeTaskbarSize}px`,
          transform: hideTransforms[taskbarPosition],
          opacity: isHidden ? 0 : 1,
          ...bgStyle
        }}
        onContextMenu={handleTaskbarContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Section: Start & Search */}
        <div className={cn("flex items-center", isVertical ? "flex-col gap-2" : "gap-2 justify-start")}>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsStartOpen(!isStartOpen); }}
              className={cn(
                "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
                isStartOpen && "bg-white/10"
              )}
            >
              {isSchool ? <GraduationCap size={iconSize} className="text-blue-400" /> : isKid ? <Smile size={iconSize} className="text-pink-400" /> : <span className="font-black text-accent font-headline tracking-tighter select-none leading-none" style={{ fontSize: `${logoFontSize}px` }}>N</span>}
            </button>
            {isStartOpen && (
              <div className={cn("absolute z-[10000]", taskbarPosition === 'top' ? "top-full mt-2" : "bottom-full mb-2")}>
                <StartMenu onClose={() => setIsStartOpen(false)} />
              </div>
            )}
          </div>

          {!isVertical && (
            <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/5 rounded-full px-3 py-1 gap-2 focus-within:border-accent/40 focus-within:bg-white/10 transition-all w-48 lg:w-64 group">
              <Search size={14} className="text-white/20 group-focus-within:text-accent transition-colors" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Nebula..."
                className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/20 w-full"
              />
            </form>
          )}
          
          {!isSchool && !isKid && (
            <button onClick={() => setIsWidgetsOpen(!isWidgetsOpen)} className={cn("p-2 rounded-md hover:bg-white/10 transition-all active:scale-95", isWidgetsOpen && "bg-accent/20 text-accent")}>
              <LayoutGrid size={iconSize} className={isWidgetsOpen ? "text-accent" : "text-white/60"} />
            </button>
          )}
        </div>

        {/* Center Section: Centered Apps */}
        <div className={cn("flex items-center", isVertical ? "flex-col justify-center gap-2" : "justify-center gap-2")}>
          {pinnedApps.map((appId, index) => {
            const info = APP_INFO[appId];
            if (!info) return null;
            const Icon = info.icon;
            const isActive = openWindows.some(w => w.appId === appId && w.id === activeWindowId);
            const isAppOpen = openWindows.some(w => w.appId === appId);
            
            return (
              <div key={appId} className="relative group" draggable onDragStart={() => handleDragStart(appId, index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd}>
                <button
                  onClick={() => openApp(appId, info.label)}
                  onContextMenu={(e) => handleAppContextMenu(e, appId)}
                  className={cn(
                    "p-2 rounded-md transition-all active:scale-90 flex items-center justify-center",
                    isActive ? "bg-white/10" : "hover:bg-white/10 text-white/60 hover:text-accent"
                  )}
                  title={info.label}
                >
                  <Icon size={iconSize} className={isSchool && isActive ? "text-blue-400" : isKid && isActive ? "text-pink-400" : ""} />
                </button>
                {isAppOpen && <div className={cn("absolute rounded-full", isSchool ? "bg-blue-500" : isKid ? "bg-pink-500" : "bg-accent", isVertical ? "w-1 h-6 -right-1 top-1/2 -translate-y-1/2" : "h-1 w-6 -bottom-1 left-1/2 -translate-x-1/2")} />}
              </div>
            );
          })}
        </div>

        {/* Right Section: Identity & Quick Settings */}
        <div className={cn("flex items-center", isVertical ? "flex-col pb-2 gap-3" : "justify-end gap-2")}>
          <button onClick={() => setIsChatOpen(!isChatOpen)} className={cn("p-2 rounded-md hover:bg-white/10", isChatOpen && "bg-accent/20")}>
            <MessageCircle size={iconSize} className={isChatOpen ? "text-accent" : "text-white/60"} />
          </button>

          {/* User Icon Hub - Before Quick Settings */}
          <Avatar 
            className="w-8 h-8 border border-white/10 cursor-pointer hover:border-accent transition-all active:scale-90 shrink-0" 
            onClick={(e) => { 
              e.stopPropagation(); 
              openApp('settings', 'Settings', { tab: 'accounts' });
            }}
            title="Account Settings"
          >
            <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
            <AvatarFallback className="text-[10px] font-bold text-white" style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}>
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>

          <div className="relative">
            <button
              onClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
              className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10", isQuickSettingsOpen && "bg-accent/20")}
            >
              <div className={cn("flex items-center gap-2 mr-2 border-r border-white/10 pr-2", isVertical && "flex-col border-r-0 border-b pb-2 mb-2")}>
                {isWifiConnecting ? <Loader2 size={14} className="animate-spin text-blue-400" /> : <Wifi size={14} className={cn(isOnline ? "text-white/60" : "text-destructive")} />}
                <VolumeIcon size={14} className="text-white/60" />
                <BatteryMedium size={14} className="text-white/60" />
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap">{mounted && time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
            </button>
            {isQuickSettingsOpen && (
              <div className={cn("absolute z-[10000] right-0", taskbarPosition === 'top' ? "top-full mt-2" : "bottom-full mb-2")}>
                <QuickSettings />
              </div>
            )}
          </div>

          <button onClick={() => minimizeAllWindows()} className={cn("border-white/10 hover:bg-white/10", isVertical ? "w-full h-2 border-t mt-1" : "h-full w-2 border-l ml-1")} />
        </div>
      </div>

      {taskbarMenu && (
        <div 
          className="fixed z-[100000] w-52 glass rounded-xl border border-white/10 p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95"
          style={{ left: taskbarMenu.x, top: taskbarMenu.y }}
        >
          {taskbarMenu.type === 'taskbar' ? (
            <>
              <button onClick={() => { rotateTaskbar(); setTaskbarMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-white/80"><RotateCw size={14} /> Rotate Taskbar</button>
              <button onClick={() => { setTaskbarAutoHide(!isTaskbarAutoHide); setTaskbarMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-white/80">{isTaskbarAutoHide ? <Eye size={14} /> : <EyeOff size={14} />} Auto-hide Taskbar</button>
            </>
          ) : (
            <button onClick={() => { if (taskbarMenu.appId) togglePinApp(taskbarMenu.appId); setTaskbarMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/20 text-xs text-destructive"><PinOff size={14} /> Unpin</button>
          )}
        </div>
      )}
    </>
  );
};
