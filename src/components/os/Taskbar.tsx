
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { Wifi, Volume2, FolderOpen, ShoppingBag, MessageSquare, Settings, Lock, Check, Loader2, VolumeX, Volume1, LayoutGrid, Battery, BatteryMedium } from 'lucide-react';
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
    openWindows, activeWindowId, focusWindow, openApp, taskbarPosition, taskbarSize, 
    currentWifi, isWifiConnecting, connectToWifi, volume, setVolume, isOnline,
    isWidgetsOpen, setIsWidgetsOpen, pinnedApps, reorderPinnedApps,
    isQuickSettingsOpen, setIsQuickSettingsOpen, isStartOpen, setIsStartOpen
  } = useOS();
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<AppId | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const isVertical = taskbarPosition === 'left' || taskbarPosition === 'right';

  const positionClasses = {
    bottom: `bottom-0 left-0 right-0 border-t`,
    top: `top-0 left-0 right-0 border-b`,
    left: `left-0 top-0 bottom-0 border-r`,
    right: `right-0 top-0 bottom-0 border-l`,
  };

  const iconSize = Math.max(12, Math.floor(taskbarSize * 0.45));
  const logoFontSize = Math.max(14, Math.floor(taskbarSize * 0.5));

  // Drag handlers for taskbar reordering
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

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div 
      className={cn(
        "fixed glass flex z-[9999] transition-all duration-300",
        positionClasses[taskbarPosition],
        isVertical ? "flex-col py-2" : "items-center px-2"
      )}
      style={{
        [isVertical ? 'width' : 'height']: `${taskbarSize}px`
      }}
    >
      {/* Start & Widgets Buttons */}
      <div className={cn("flex", isVertical ? "flex-col gap-1" : "gap-1")}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsStartOpen(!isStartOpen);
            setIsWidgetsOpen(false);
            setIsQuickSettingsOpen(false);
          }}
          className={cn(
            "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
            isStartOpen && "bg-white/10"
          )}
        >
          <span 
            className="font-black text-accent font-headline tracking-tighter select-none leading-none"
            style={{ fontSize: `${logoFontSize}px` }}
          >
            N
          </span>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWidgetsOpen(!isWidgetsOpen);
            setIsStartOpen(false);
            setIsQuickSettingsOpen(false);
          }}
          className={cn(
            "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
            isWidgetsOpen && "bg-accent/20 text-accent"
          )}
        >
          <LayoutGrid size={iconSize} className={isWidgetsOpen ? "text-accent" : "text-white/60 group-hover:text-white"} />
        </button>
        
        {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}
      </div>

      {/* Centered App Container */}
      <div className={cn(
        "flex-1 flex gap-2 overflow-hidden",
        isVertical ? "flex-col items-center justify-center" : "items-center justify-center"
      )}>
        {pinnedApps.map((appId, index) => {
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
                className={cn(
                  "p-2 rounded-md transition-all active:scale-90 flex items-center justify-center",
                  isActive ? "bg-white/10" : "hover:bg-white/10 text-white/60 hover:text-accent"
                )}
                title={info.label}
              >
                <Icon size={iconSize} />
              </button>
              {isAppOpen && (
                <div className={cn(
                  "absolute bg-accent rounded-full transition-all",
                  isVertical 
                    ? "w-1.5 h-6 -right-1 top-1/2 -translate-y-1/2" 
                    : "h-1 w-6 -bottom-1 left-1/2 -translate-x-1/2"
                )} />
              )}
            </div>
          );
        })}

        {/* Temporary items for open but unpinned apps */}
        {openWindows.filter(w => !pinnedApps.includes(w.appId)).map(window => {
          const isActive = activeWindowId === window.id;
          const info = APP_INFO[window.appId];
          const Icon = info?.icon || FolderOpen;

          return (
            <div key={window.id} className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  focusWindow(window.id);
                }}
                className={cn(
                  "p-2 rounded-md transition-all active:scale-90 flex items-center justify-center",
                  isActive ? "bg-white/10 text-accent" : "hover:bg-white/10 text-white/40"
                )}
                title={window.title}
              >
                <Icon size={iconSize} />
              </button>
              <div className={cn(
                "absolute bg-accent rounded-full transition-all",
                isVertical 
                  ? "w-1.5 h-6 -right-1 top-1/2 -translate-y-1/2" 
                  : "h-1 w-6 -bottom-1 left-1/2 -translate-x-1/2"
              )} />
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
            setIsQuickSettingsOpen(!isQuickSettingsOpen);
            setIsStartOpen(false);
            setIsWidgetsOpen(false);
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all active:scale-95 group",
            isQuickSettingsOpen && "bg-accent/20 text-accent"
          )}
        >
          <div className="flex items-center gap-2 mr-2 border-r border-white/10 pr-2">
            {isWifiConnecting ? (
              <Loader2 size={14} className="animate-spin text-accent" />
            ) : (
              <Wifi size={14} className={cn(isOnline ? (isQuickSettingsOpen ? "text-accent" : "text-white/60") : "text-destructive")} />
            )}
            <VolumeIcon size={14} className={cn(isQuickSettingsOpen ? "text-accent" : "text-white/60")} />
            <BatteryMedium size={14} className={cn(isQuickSettingsOpen ? "text-accent" : "text-white/60")} />
          </div>
          
          {!isVertical && (
            <div className="flex flex-col items-end leading-none min-w-[50px]">
              {mounted && time ? (
                <span className="text-[11px] font-bold whitespace-nowrap">{formatTime(time)}</span>
              ) : (
                <div className="h-3 w-10 bg-white/10 rounded animate-pulse" />
              )}
            </div>
          )}
        </button>
      </div>

      {isQuickSettingsOpen && <QuickSettings />}
    </div>
  );
};
