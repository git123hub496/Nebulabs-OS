
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { Wifi, Volume2, FolderOpen, ShoppingBag, MessageSquare, Settings, Lock, Check, Loader2, VolumeX, Volume1, LayoutGrid, Battery, BatteryMedium, MessageCircle, GraduationCap, PinOff, EyeOff, Smile, Home, RotateCw, Clock as ClockIcon, Calendar as CalendarIcon, ChevronUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StartMenu } from './StartMenu';
import { QuickSettings } from './QuickSettings';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Taskbar: React.FC = () => {
  const { 
    openWindows, activeWindowId, openApp, taskbarPosition, taskbarSize, rotateTaskbar,
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
  
  const [taskbarMenu, setTaskbarMenu] = useState<{ x: number, y: number, type: 'taskbar' | 'app', appId?: AppId } | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setTaskbarMenu(null);
    if (taskbarMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [taskbarMenu]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLongDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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

  const handleStartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStartOpen(!isStartOpen);
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const menuWidth = 208;
    const menuHeight = 120;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    setTaskbarMenu({ x, y, type: 'taskbar' });
  };

  const handleAppContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const menuWidth = 208;
    const menuHeight = 60;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    setTaskbarMenu({ x, y, type: 'app', appId });
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // Auto-hide logic classes
  const isHidden = isTaskbarAutoHide && !isHovered && !isStartOpen && !isQuickSettingsOpen && !isChatOpen && !isWidgetsOpen;
  
  const hideTransforms = {
    bottom: isHidden ? 'translateY(100%)' : 'translateY(0)',
    top: isHidden ? 'translateY(-100%)' : 'translateY(0)',
    left: isHidden ? 'translateX(-100%)' : 'translateX(0)',
    right: isHidden ? 'translateX(100%)' : 'translateX(0)',
  };

  const triggerClasses = {
    bottom: 'bottom-0 left-0 right-0 h-1 cursor-pointer',
    top: 'top-0 left-0 right-0 h-1 cursor-pointer',
    left: 'left-0 top-0 bottom-0 w-1 cursor-pointer',
    right: 'right-0 top-0 bottom-0 w-1 cursor-pointer',
  };

  return (
    <>
      {/* Invisible Trigger for Auto-Hide */}
      {isTaskbarAutoHide && (
        <div 
          className={cn("fixed z-[9998] bg-transparent hover:bg-accent/5 transition-colors", triggerClasses[taskbarPosition])}
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <div 
        className={cn(
          "fixed glass flex z-[9999] transition-all duration-500 ease-in-out",
          taskbarPosition === 'bottom' && "bottom-0 left-0 right-0 border-t",
          taskbarPosition === 'top' && "top-0 left-0 right-0 border-b",
          taskbarPosition === 'left' && "left-0 top-0 bottom-0 border-r",
          taskbarPosition === 'right' && "right-0 top-0 bottom-0 border-l",
          isVertical ? "flex-col py-2" : "items-center px-2",
          isSchool && "border-blue-500/20",
          isKid && "border-pink-500/20"
        )}
        style={{
          [isVertical ? 'width' : 'height']: `${safeTaskbarSize}px`,
          transform: hideTransforms[taskbarPosition],
          opacity: isHidden ? 0 : 1
        }}
        onContextMenu={handleTaskbarContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn("flex", isVertical ? "flex-col gap-1" : "gap-1")}>
          <button
            onClick={handleStartToggle}
            className={cn(
              "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
              isStartOpen && "bg-white/10"
            )}
          >
            {isSchool ? (
              <GraduationCap size={iconSize} className="text-blue-400" />
            ) : isKid ? (
              <Smile size={iconSize} className="text-pink-400" />
            ) : (
              <span 
                className="font-black text-accent font-headline tracking-tighter select-none leading-none"
                style={{ fontSize: `${logoFontSize}px` }}
              >
                N
              </span>
            )}
          </button>
          
          {!isSchool && !isKid && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWidgetsOpen(!isWidgetsOpen);
              }}
              className={cn(
                "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
                isWidgetsOpen && "bg-accent/20 text-accent"
              )}
            >
              <LayoutGrid size={iconSize} className={isWidgetsOpen ? "text-accent" : "text-white/60 group-hover:text-white"} />
            </button>
          )}
          
          {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}
        </div>

        <div className={cn(
          "flex-1 flex gap-2 overflow-hidden",
          isVertical ? "flex-col items-center justify-center" : "items-center justify-center"
        )}>
          {pinnedApps.map((appId, index) => {
            if (isKid && (appId === 'terminal' || appId === 'virus')) return null;

            const info = APP_INFO[appId];
            if (!info) return null;
            const Icon = info.icon;
            const isAppOpen = openWindows.some(w => w.appId === appId);
            const isActive = openWindows.some(w => w.appId === appId && w.id === activeWindowId);
            const isTarget = targetIndex === index;
            const isDragging = draggingAppId === appId;
            
            return (
              <div 
                key={appId} 
                className={cn(
                  "relative group transition-all duration-200",
                  isTarget && (index > (dragIndex ?? 0) ? "translate-x-2" : "-translate-x-2"),
                  isDragging && "opacity-20 scale-75"
                )}
                draggable
                onDragStart={() => handleDragStart(appId, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openApp(appId, info.label);
                  }}
                  onContextMenu={(e) => handleAppContextMenu(e, appId)}
                  className={cn(
                    "p-2 rounded-md transition-all active:scale-90 flex items-center justify-center",
                    isActive ? "bg-white/10" : "hover:bg-white/10 text-white/60 hover:text-accent"
                  )}
                  title={info.label}
                >
                  <Icon size={iconSize} className={isSchool && isActive ? "text-blue-400" : isKid && isActive ? "text-pink-400" : ""} />
                </button>
                {isAppOpen && (
                  <div className={cn(
                    "absolute rounded-full transition-all",
                    isSchool ? "bg-blue-500" : isKid ? "bg-pink-500" : "bg-accent",
                    isVertical 
                      ? "w-1.5 h-6 -right-1 top-1/2 -translate-y-1/2" 
                      : "h-1 w-6 -bottom-1 left-1/2 -translate-x-1/2"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        <div className={cn(
          "flex gap-3 text-white/70 z-10",
          isVertical ? "flex-col items-center pb-2" : "items-center px-1"
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsChatOpen(!isChatOpen);
            }}
            className={cn(
              "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
              isChatOpen && (isSchool ? "bg-blue-500/20 text-blue-400" : isKid ? "bg-pink-500/20 text-pink-400" : "bg-accent/20 text-accent")
            )}
            title={isSchool ? "Nebula Classroom" : isKid ? "Family Chat" : "District Communication"}
          >
            <MessageCircle size={iconSize} className={isChatOpen ? (isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent") : "text-white/60 group-hover:text-white"} />
          </button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsQuickSettingsOpen(!isQuickSettingsOpen);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 group",
                    isQuickSettingsOpen && (isSchool ? "bg-blue-500/20 text-blue-400" : isKid ? "bg-pink-500/20 text-pink-400" : "bg-accent/20 text-accent"),
                    isVertical ? "flex-col py-3 px-1.5" : ""
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 mr-2 border-white/10 pr-2",
                    isVertical ? "flex-col mr-0 pr-0 mb-2 border-b pb-2 border-r-0" : "border-r"
                  )}>
                    {isWifiConnecting ? (
                      <Loader2 size={14} className="animate-spin text-blue-400" />
                    ) : (
                      <Wifi size={14} className={cn(isOnline ? (isQuickSettingsOpen ? (isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent") : "text-white/60") : "text-destructive")} />
                    )}
                    <VolumeIcon size={14} className={cn(isQuickSettingsOpen ? (isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent") : "text-white/60")} />
                    <BatteryMedium size={14} className={cn(isQuickSettingsOpen ? (isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent") : "text-white/60")} />
                  </div>
                  
                  <div className={cn(
                    "flex flex-col leading-none",
                    isVertical ? "items-center" : "items-end min-w-[50px]"
                  )}>
                    {mounted && time ? (
                      <span className="text-[11px] font-bold whitespace-nowrap">{formatTime(time)}</span>
                    ) : (
                      <div className="h-3 w-10 bg-white/10 rounded animate-pulse" />
                    )}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="glass border-white/10 p-4 space-y-2 mb-2 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                    <ClockIcon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-accent tracking-widest">Local Time</p>
                    <p className="text-sm font-bold text-white">
                      {time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                    <CalendarIcon size={16} />
                  </div>
                  <p className="text-[10px] font-bold text-white/60">
                    {time ? formatLongDate(time) : ''}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Show Desktop Trigger */}
          <button
            onClick={() => minimizeAllWindows()}
            className={cn(
              "border-white/10 hover:bg-white/10 transition-colors active:bg-accent/40",
              isVertical ? "w-full h-2 border-t mt-1" : "h-full w-2 border-l ml-1"
            )}
            title="Show Desktop"
          />
        </div>

        {isQuickSettingsOpen && <QuickSettings />}
      </div>

      {taskbarMenu && (
        <div 
          className="fixed z-[100000] w-52 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ left: taskbarMenu.x, top: taskbarMenu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {taskbarMenu.type === 'taskbar' ? (
            <>
              <button 
                onClick={() => {
                  rotateTaskbar();
                  setTaskbarMenu(null);
                  playSound('click');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <RotateCw size={14} className="text-accent/60 group-hover:text-accent" />
                  <span>Rotate Taskbar</span>
                </div>
              </button>
              <button 
                onClick={() => {
                  setTaskbarAutoHide(!isTaskbarAutoHide);
                  setTaskbarMenu(null);
                  playSound('click');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {isTaskbarAutoHide ? <Eye size={14} className="text-accent/60 group-hover:text-accent" /> : <EyeOff size={14} className="text-accent/60 group-hover:text-accent" />}
                  <span>{isTaskbarAutoHide ? "Lock Taskbar" : "Auto-hide Taskbar"}</span>
                </div>
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                if (taskbarMenu.appId) togglePinApp(taskbarMenu.appId);
                setTaskbarMenu(null);
                playSound('click');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-destructive/20 text-xs font-medium text-white/80 hover:text-destructive transition-colors group"
            >
              <div className="flex items-center gap-3">
                <PinOff size={14} className="text-destructive/60 group-hover:text-destructive" />
                <span>Unpin from Taskbar</span>
              </div>
            </button>
          )}
        </div>
      )}
    </>
  );
};
