"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS, WindowInstance } from '@/context/os-context';
import { X, Minus, Square, Columns, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WindowProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const { 
    closeWindow, minimizeWindow, maximizeWindow, snapWindow, focusWindow, 
    activeWindowId, taskbarPosition, moveWindowToDisplay, currentDisplayId, 
    updateWindowPosition, displayLayout 
  } = useOS();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === win.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(win.id);
    if (win.isMaximized || win.isSnapped) return;
    
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
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowWidth = win.initialWidth || 800;
        const windowHeight = win.initialHeight || 600;

        const currentLayout = displayLayout[currentDisplayId];
        if (currentLayout) {
          const threshold = 50; 

          // Check Left Hopping
          if (newX < -threshold && currentLayout.left) {
            updateWindowPosition(win.id, screenWidth - windowWidth - 20, newY, currentLayout.left);
            setIsDragging(false);
            return;
          }
          // Check Right Hopping
          if (newX > screenWidth - threshold && currentLayout.right) {
            updateWindowPosition(win.id, 20, newY, currentLayout.right);
            setIsDragging(false);
            return;
          }
          // Check Top Hopping
          if (newY < -threshold && currentLayout.top) {
            updateWindowPosition(win.id, newX, screenHeight - windowHeight - 20, currentLayout.top);
            setIsDragging(false);
            return;
          }
          // Check Bottom Hopping
          if (newY > screenHeight - threshold && currentLayout.bottom) {
            updateWindowPosition(win.id, newX, 20, currentLayout.bottom);
            setIsDragging(false);
            return;
          }
        }

        updateWindowPosition(win.id, newX, newY);
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
  }, [isDragging, dragOffset, win.id, currentDisplayId, displayLayout, win.initialWidth, win.initialHeight, updateWindowPosition]);

  if (win.isMinimized) return null;

  const getResponsiveDimensions = () => {
    const isHorizontal = taskbarPosition === 'bottom' || taskbarPosition === 'top';
    const offset = 48; 
    
    if (win.isMaximized) {
      return {
        left: taskbarPosition === 'left' ? offset : 0,
        right: taskbarPosition === 'right' ? offset : 0,
        top: taskbarPosition === 'top' ? offset : 0,
        bottom: taskbarPosition === 'bottom' ? offset : 0,
        width: isHorizontal ? '100%' : `calc(100% - ${offset}px)`,
        height: !isHorizontal ? '100%' : `calc(100% - ${offset}px)`,
      };
    }

    if (win.isSnapped === 'left') {
      return {
        left: taskbarPosition === 'left' ? offset : 0,
        top: taskbarPosition === 'top' ? offset : 0,
        bottom: taskbarPosition === 'bottom' ? offset : 0,
        width: isHorizontal ? '50%' : `calc(50% - ${offset / 2}px)`,
        height: !isHorizontal ? '100%' : `calc(100% - ${offset}px)`,
      };
    }

    if (win.isSnapped === 'right') {
      return {
        right: taskbarPosition === 'right' ? offset : 0,
        top: taskbarPosition === 'top' ? offset : 0,
        bottom: taskbarPosition === 'bottom' ? offset : 0,
        left: isHorizontal ? '50%' : undefined,
        width: isHorizontal ? '50%' : `calc(50% - ${offset / 2}px)`,
        height: !isHorizontal ? '100%' : `calc(100% - ${offset}px)`,
      };
    }

    return {
      left: win.x,
      top: win.y,
      width: win.initialWidth || 800,
      height: win.initialHeight || 600,
    };
  };

  const dimensions = getResponsiveDimensions();

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed flex flex-col glass rounded-xl border overflow-hidden window-shadow transition-all duration-300",
        isActive ? "z-[100] border-accent/40 ring-1 ring-accent/20" : "z-10 opacity-90",
        win.isMaximized || win.isSnapped ? "rounded-none" : ""
      )}
      style={{
        ...dimensions,
        zIndex: win.zIndex,
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                title="Move to Display"
                onClick={(e) => e.stopPropagation()}
              >
                <Monitor size={14} className="text-accent" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-white/10">
              {['1', '2', '3'].map(id => (
                <DropdownMenuItem 
                  key={id} 
                  onClick={() => moveWindowToDisplay(win.id, id)}
                  disabled={id === (win.displayId || '1')}
                  className="gap-2 text-[10px] font-bold uppercase"
                >
                  <Monitor size={12} />
                  Display {id} {id === (win.displayId || '1') ? '(Current)' : ''}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
            title="Minimize"
          >
            <Minus size={14} className="text-white/60" />
          </button>
          
          <div className="flex items-center group/snap relative">
            <button 
              onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Maximize"
            >
              <Square size={12} className="text-white/60" />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover/snap:flex glass border border-white/10 p-1 rounded-lg gap-1 z-[200] shadow-2xl">
              <button 
                onClick={(e) => { e.stopPropagation(); snapWindow(win.id, 'left'); }}
                className="p-1 hover:bg-accent/20 rounded text-accent"
                title="Snap Left"
              >
                <Columns size={12} className="rotate-180" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); snapWindow(win.id, 'right'); }}
                className="p-1 hover:bg-accent/20 rounded text-accent"
                title="Snap Right"
              >
                <Columns size={12} />
              </button>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="p-1.5 hover:bg-destructive/80 group rounded-md transition-colors"
            title="Close"
          >
            <X size={14} className="text-white/60" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-background/40 overflow-hidden">
        {children}
      </div>
    </div>
  );
};