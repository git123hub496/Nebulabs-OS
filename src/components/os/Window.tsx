
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS, WindowInstance } from '@/context/os-context';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindowId, taskbarPosition } = useOS();
  const [position, setPosition] = useState({ 
    x: 100 + (win.zIndex * 2), 
    y: 50 + (win.zIndex * 2) 
  });
  const [size, setSize] = useState({ 
    width: win.initialWidth || 800, 
    height: win.initialHeight || 600 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === win.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(win.id);
    if (win.isMaximized) return;
    
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (win.isMinimized) return null;

  const getMaximizedStyles = () => {
    if (!win.isMaximized) return {};
    
    const base = { zIndex: win.zIndex };
    switch (taskbarPosition) {
      case 'bottom': return { ...base, inset: 0, height: 'calc(100% - 48px)' };
      case 'top': return { ...base, inset: '48px 0 0 0', height: 'calc(100% - 48px)' };
      case 'left': return { ...base, inset: '0 0 0 48px', width: 'calc(100% - 48px)', height: '100%' };
      case 'right': return { ...base, inset: '0 48px 0 0', width: 'calc(100% - 48px)', height: '100%' };
      default: return { ...base, inset: 0 };
    }
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed flex flex-col glass rounded-xl border overflow-hidden window-shadow transition-all duration-300",
        isActive ? "z-[100] border-accent/40 ring-1 ring-accent/20" : "z-10 opacity-90",
        win.isMaximized ? "rounded-none" : ""
      )}
      style={{
        left: win.isMaximized ? undefined : position.x,
        top: win.isMaximized ? undefined : position.y,
        width: win.isMaximized ? undefined : size.width,
        height: win.isMaximized ? undefined : size.height,
        zIndex: win.zIndex,
        ...getMaximizedStyles()
      }}
      onClick={() => focusWindow(win.id)}
    >
      <div
        className="h-10 bg-white/5 flex items-center justify-between px-3 cursor-default select-none shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Minus size={14} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Square size={12} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="p-1.5 hover:bg-destructive/80 group rounded-md transition-colors"
          >
            <X size={14} className="text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-background/40 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
