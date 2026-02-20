
"use client"

import React, { useState, useEffect } from 'react';
import { useOS, AppId } from '@/context/os-context';
import { Wifi, Volume2, FolderOpen, ShoppingBag, MessageSquare, Settings, Lock, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StartMenu } from './StartMenu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';

const QUICK_LAUNCH: { id: AppId; icon: any; label: string }[] = [
  { id: 'files', icon: FolderOpen, label: 'File Explorer' },
  { id: 'store', icon: ShoppingBag, label: 'App Store' },
  { id: 'assistant', icon: MessageSquare, label: 'AI Assistant' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const SIMULATED_NETWORKS = [
  { ssid: 'Nebula_Secure_5G', secure: true, strength: 4 },
  { ssid: 'Hotel Guest', secure: false, strength: 3 },
  { ssid: 'Starbucks_Free_WiFi', secure: false, strength: 2 },
  { ssid: 'Dev_Network_Hidden', secure: true, strength: 1 },
];

export const Taskbar: React.FC = () => {
  const { openWindows, activeWindowId, focusWindow, openApp, taskbarPosition, currentWifi, isWifiConnecting, connectToWifi } = useOS();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);

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
    bottom: 'bottom-0 left-0 right-0 h-12 border-t',
    top: 'top-0 left-0 right-0 h-12 border-b',
    left: 'left-0 top-0 bottom-0 w-12 border-r',
    right: 'right-0 top-0 bottom-0 w-12 border-l',
  };

  return (
    <div className={cn(
      "fixed glass flex z-[9999] transition-all duration-300",
      positionClasses[taskbarPosition],
      isVertical ? "flex-col py-2" : "items-center px-2"
    )}>
      <div className="relative">
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={cn(
            "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group flex items-center justify-center min-w-[32px] min-h-[32px]",
            isStartOpen && "bg-white/10"
          )}
        >
          <span className="text-xl font-black text-accent font-headline tracking-tighter select-none leading-none">N</span>
        </button>
        {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}
      </div>

      <div className={cn(
        "flex gap-1 mx-2 overflow-hidden",
        isVertical ? "flex-col my-4 border-b border-white/10 pb-2" : "items-center border-r border-white/10 pr-2"
      )}>
        {QUICK_LAUNCH.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => openApp(item.id, item.label)}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-accent"
              title={item.label}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      <div className={cn(
        "flex flex-1 gap-1 mx-2 overflow-hidden",
        isVertical ? "flex-col items-center justify-start pt-2" : "items-center justify-start"
      )}>
        {openWindows.map(window => (
          <button
            key={window.id}
            onClick={() => focusWindow(window.id)}
            className={cn(
              "rounded-md flex items-center gap-2 transition-all border border-transparent",
              isVertical ? "w-8 h-8 justify-center" : "h-9 px-3 min-w-[40px] max-w-[160px]",
              activeWindowId === window.id ? "bg-white/10 border-white/20" : "hover:bg-white/5"
            )}
            title={window.title}
          >
            <div className={cn(
              "shrink-0 bg-accent/40 rounded-sm",
              isVertical ? "w-2 h-2" : "w-3 h-3"
            )} />
            {!isVertical && activeWindowId === window.id && (
              <span className="text-[11px] font-medium truncate text-white/80">{window.title}</span>
            )}
          </button>
        ))}
      </div>

      <div className={cn(
        "flex gap-3 text-white/70",
        isVertical ? "flex-col items-center pb-2" : "items-center px-3"
      )}>
        {!isVertical && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors relative">
                  {isWifiConnecting ? (
                    <Loader2 size={14} className="animate-spin text-accent" />
                  ) : (
                    <Wifi size={14} className={cn(currentWifi ? "text-accent" : "opacity-40")} />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 glass border-white/10 p-2 backdrop-blur-3xl rounded-xl shadow-2xl">
                <div className="p-2 border-b border-white/5 mb-2">
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest">Available Networks</h4>
                </div>
                <div className="space-y-1">
                  {SIMULATED_NETWORKS.map(net => (
                    <button
                      key={net.ssid}
                      onClick={() => connectToWifi(net.ssid)}
                      disabled={isWifiConnecting || currentWifi === net.ssid}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all",
                        currentWifi === net.ssid ? "bg-accent/20 text-accent" : "hover:bg-white/5 text-white/80"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Wifi size={12} className={cn(currentWifi === net.ssid ? "text-accent" : "opacity-40")} />
                        <span className="font-medium">{net.ssid}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {net.secure && <Lock size={10} className="opacity-40" />}
                        {currentWifi === net.ssid && <Check size={12} className="text-accent" />}
                      </div>
                    </button>
                  ))}
                </div>
                {currentWifi && (
                  <div className="mt-2 p-2 pt-2 border-t border-white/5">
                    <p className="text-[9px] text-white/40 italic">Connected to {currentWifi}</p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
              <Volume2 size={14} className="opacity-60 hover:opacity-100" />
            </button>
          </div>
        )}
        <div className={cn(
          "flex flex-col items-end leading-none min-w-[75px]",
          isVertical ? "items-center text-center scale-75 origin-bottom" : ""
        )}>
          {mounted && time ? (
            <>
              <span className="text-[11px] font-medium whitespace-nowrap">{formatTime(time)}</span>
              {!isVertical && <span className="text-[10px] opacity-40 whitespace-nowrap">{formatDate(time)}</span>}
            </>
          ) : (
            <div className="animate-pulse flex flex-col items-end gap-1">
              <div className="h-2 w-12 bg-white/10 rounded" />
              {!isVertical && <div className="h-2 w-10 bg-white/10 rounded" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
