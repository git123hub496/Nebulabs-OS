"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS, WindowInstance } from '@/context/os-context';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: windowInstance, children }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindowId } = useOS();
  const [position, setPosition] = useState({ x: 100 + (windowInstance.zIndex * 2), y: 50 + (windowInstance.zIndex * 2) });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === windowInstance.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(windowInstance.id);
    if (windowInstance.isMaximized) return;
    
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
      globalThis.window.addEventListener('mousemove', handleMouseMove);
      globalThis.window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      globalThis.window.removeEventListener('mousemove', handleMouseMove);
      globalThis.window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (windowInstance.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed flex flex-col glass rounded-xl border overflow-hidden window-shadow transition-[box-shadow,transform]",
        isActive ? "z-[100] border-accent/40 ring-1 ring-accent/20" : "z-10 opacity-90",
        windowInstance.isMaximized ? "inset-0 w-full h-full rounded-none" : ""
      )}
      style={{
        left: windowInstance.isMaximized ? 0 : position.x,
        top: windowInstance.isMaximized ? 0 : position.y,
        width: windowInstance.isMaximized ? '100%' : size.width,
        height: windowInstance.isMaximized ? 'calc(100% - 48px)' : size.height,
        zIndex: windowInstance.zIndex
      }}
      onClick={() => focusWindow(windowInstance.id)}
    >
      <div
        className="h-10 bg-white/5 flex items-center justify-between px-3 cursor-default select-none shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">{windowInstance.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(windowInstance.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Minus size={14} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(windowInstance.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Square size={12} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(windowInstance.id); }}
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
