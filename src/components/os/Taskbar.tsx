"use client"

import React, { useState, useEffect } from 'react';
import { useOS, AppId } from '@/context/os-context';
import { Grid, Monitor, Search, LayoutGrid, Clock, Wifi, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StartMenu } from './StartMenu';

export const Taskbar: React.FC = () => {
  const { openWindows, activeWindowId, focusWindow, openApp } = useOS();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 glass border-t flex items-center px-2 z-[9999]">
      <div className="relative">
        <button
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={cn(
            "p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group",
            isStartOpen && "bg-white/10"
          )}
        >
          <Monitor className="text-accent group-hover:scale-110 transition-transform" size={24} />
        </button>
        {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}
      </div>

      <div className="flex-1 flex items-center justify-center gap-1 mx-4">
        {openWindows.map(window => (
          <button
            key={window.id}
            onClick={() => focusWindow(window.id)}
            className={cn(
              "h-9 px-3 rounded-md flex items-center gap-2 transition-all border border-transparent",
              activeWindowId === window.id ? "bg-white/10 border-white/20 w-40" : "hover:bg-white/5 w-10 overflow-hidden"
            )}
            title={window.title}
          >
            <div className="shrink-0 w-4 h-4 bg-accent/20 rounded-sm" />
            {activeWindowId === window.id && (
              <span className="text-xs font-medium truncate text-white/80">{window.title}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-3 text-white/70">
        <div className="flex items-center gap-2">
          <Wifi size={14} />
          <Volume2 size={14} />
        </div>
        <div className="flex flex-col items-end leading-none">
          <span className="text-[11px] font-medium">{formatTime(time)}</span>
          <span className="text-[10px] opacity-60">{formatDate(time)}</span>
        </div>
      </div>
    </div>
  );
};