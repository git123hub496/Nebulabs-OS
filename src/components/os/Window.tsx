"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS, WindowInstance } from '@/context/os-context';
import { X, Minus, Square, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window, children }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindowId } = useOS();
  const [position, setPosition] = useState({ x: 100 + (window.zIndex * 2), y: 50 + (window.zIndex * 2) });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === window.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(window.id);
    if (window.isMaximized) return;
    
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

  if (window.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed flex flex-col glass rounded-xl border overflow-hidden window-shadow transition-[box-shadow,transform]",
        isActive ? "z-[100] border-accent/40 ring-1 ring-accent/20" : "z-10 opacity-90",
        window.isMaximized ? "inset-0 w-full h-full rounded-none" : ""
      )}
      style={{
        left: window.isMaximized ? 0 : position.x,
        top: window.isMaximized ? 0 : position.y,
        width: window.isMaximized ? '100%' : size.width,
        height: window.isMaximized ? 'calc(100% - 48px)' : size.height,
        zIndex: window.zIndex
      }}
      onClick={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 bg-white/5 flex items-center justify-between px-3 cursor-default select-none shrink-0"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Minus size={14} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Square size={12} className="text-white/60" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
            className="p-1.5 hover:bg-destructive/80 group rounded-md transition-colors"
          >
            <X size={14} className="text-white/60 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background/40 overflow-auto">
        {children}
      </div>
    </div>
  );
};