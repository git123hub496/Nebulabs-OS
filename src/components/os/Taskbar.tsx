'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { Wifi, Volume2, FolderOpen, ShoppingBag, MessageSquare, Settings, Lock, Check, Loader2, VolumeX, Volume1, LayoutGrid, Battery, BatteryMedium, MessageCircle, GraduationCap, PinOff, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StartMenu } from './StartMenu';
import { QuickSettings } from './QuickSettings';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

export const Taskbar: React.FC = () => {
  const { 
    openWindows, activeWindowId, focusWindow, openApp, taskbarPosition, taskbarSize, taskbarAutoHide, setTaskbarAutoHide,
    currentWifi, isWifiConnecting, connectToWifi, volume, setVolume, isOnline,
    isWidgetsOpen, setIsWidgetsOpen, pinnedApps, reorderPinnedApps, togglePinApp,
    isQuickSettingsOpen, setIsQuickSettingsOpen, isStartOpen, setIsStartOpen,
    isChatOpen, setIsChatOpen, playSound, currentUser, addNotification
  } = useOS();
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<AppId | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isForcedVisible, setIsForcedVisible] = useState(false);
  
  // Taskbar-specific context menu state
  const [taskbarMenu, setTaskbarMenu] = useState<{ x: number, y: number, type: 'taskbar' | 'app', appId?: AppId } | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Force taskbar to be visible if a menu is open
  useEffect(() => {
    if (isStartOpen || isQuickSettingsOpen || isWidgetsOpen || isChatOpen) {
      setIsForcedVisible(true);
    } else {
      setIsForcedVisible(false);
    }
  }, [isStartOpen, isQuickSettingsOpen, isWidgetsOpen, isChatOpen]);

  // Close context menu on click outside
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

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';
  const isSchool = currentUser?.isSchoolAccount;

  const positionClasses = {
    bottom: `bottom-0 left-0 right-0 border-t`,
    top: `top-0 left-0 right-0 border-b`,
    left: `left-0 top-0 bottom-0 border-r`,
    right: `right-0 top-0 bottom-0 border-l`,
  };

  const autoHideClasses = {
    bottom: isForcedVisible ? 'translate-y-0' : 'translate-y-[calc(100%-2px)] hover:translate-y-0',
    top: isForcedVisible ? 'translate-y-0' : '-translate-y-[calc(100%-2px)] hover:translate-y-0',
    left: isForcedVisible ? 'translate-x-0' : '-translate-x-[calc(100%-2px)] hover:translate-x-0',
    right: isForcedVisible ? 'translate-x-0' : 'translate-x-[calc(100%-2px)] hover:translate-x-0',
  };

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
    if (isSchool) {
      addNotification("System Restriction", "Managed learning accounts do not have access to the global start menu.", "security");
      return;
    }
    setIsStartOpen(!isStartOpen);
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuWidth = 208;
    const menuHeight = 60;
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

  return (
    <>
      <div 
        className={cn(
          "fixed glass flex z-[9999] transition-all duration-500 ease-in-out",
          positionClasses[taskbarPosition],
          taskbarAutoHide && autoHideClasses[taskbarPosition],
          isVertical ? "flex-col py-2" : "items-center px-2",
          isSchool && "border-blue-500/20"
        )}
        style={{
          [isVertical ? 'width' : 'height']: `${safeTaskbarSize}px`
        }}
        onContextMenu={handleTaskbarContextMenu}
      >
        {/* Start & Widgets Buttons */}
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
            ) : (
              <span 
                className="font-black text-accent font-headline tracking-tighter select-none leading-none"
                style={{ fontSize: `${logoFontSize}px` }}
              >
                N
              </span>
            )}
          </button>
          
          {!isSchool && (
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
          
          {isStartOpen && !isSchool && <StartMenu onClose={() => setIsStartOpen(false)} />}
        </div>

        {/* Centered App Container */}
        <div className={cn(
          "flex-1 flex gap-2 overflow-hidden",
          isVertical ? "flex-col items-center justify-center" : "items-center justify-center"
        )}>
          {pinnedApps.map((appId, index) => {
            // School Restriction for pinned apps
            if (isSchool && appId === 'news') return null;

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
                  <Icon size={iconSize} className={isSchool && isActive ? "text-blue-400" : ""} />
                </button>
                {isAppOpen && (
                  <div className={cn(
                    "absolute rounded-full transition-all",
                    isSchool ? "bg-blue-500" : "bg-accent",
                    isVertical 
                      ? "w-1.5 h-6 -right-1 top-1/2 -translate-y-1/2" 
                      : "h-1 w-6 -bottom-1 left-1/2 -translate-x-1/2"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* System Tray (Right Side) */}
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
              isChatOpen && (isSchool ? "bg-blue-500/20 text-blue-400" : "bg-accent/20 text-accent")
            )}
            title={isSchool ? "Nebula Classroom" : "District Communication"}
          >
            <MessageCircle size={iconSize} className={isChatOpen ? (isSchool ? "text-blue-400" : "text-accent") : "text-white/60 group-hover:text-white"} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickSettingsOpen(!isQuickSettingsOpen);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 group",
              isQuickSettingsOpen && (isSchool ? "bg-blue-500/20 text-blue-400" : "bg-accent/20 text-accent"),
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
                <Wifi size={14} className={cn(isOnline ? (isQuickSettingsOpen ? (isSchool ? "text-blue-400" : "text-accent") : "text-white/60") : "text-destructive")} />
              )}
              <VolumeIcon size={14} className={cn(isQuickSettingsOpen ? (isSchool ? "text-blue-400" : "text-accent") : "text-white/60")} />
              <BatteryMedium size={14} className={cn(isQuickSettingsOpen ? (isSchool ? "text-blue-400" : "text-accent") : "text-white/60")} />
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
        </div>

        {isQuickSettingsOpen && <QuickSettings />}
      </div>

      {/* Taskbar Context Menu */}
      {taskbarMenu && (
        <div 
          className="fixed z-[10000] w-52 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ left: taskbarMenu.x, top: taskbarMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {taskbarMenu.type === 'taskbar' ? (
            <button 
              onClick={() => {
                setTaskbarAutoHide(!taskbarAutoHide);
                setTaskbarMenu(null);
                playSound('click');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
            >
              <div className="flex items-center gap-3">
                <EyeOff size={14} className="text-accent/60 group-hover:text-accent" />
                <span>Auto-hide Taskbar</span>
              </div>
              {taskbarAutoHide && <Check size={12} className="text-accent" />}
            </button>
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
