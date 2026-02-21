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

  // Determine if this window is "near" enough to be grabbed on this display
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

    // MULTI-DISPLAY COORDINATE MAPPING
    let finalX = win.x;
    let finalY = win.y;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    if (win.displayId !== currentDisplayId) {
      const layout = displayLayout[currentDisplayId];
      if (layout) {
        if (layout.left === win.displayId) finalX = win.x - screenWidth;
        else if (layout.right === win.displayId) finalX = win.x + screenWidth;
        else if (layout.top === win.displayId) finalY = win.y - screenHeight;
        else if (layout.bottom === win.displayId) finalY = win.y + screenHeight;
      }
    }

    return {
      left: finalX,
      top: finalY,
      width: win.initialWidth || 800,
      height: win.initialHeight || 600,
      isVisibleOnThisScreen: (
        finalX < screenWidth && finalX + (win.initialWidth || 800) > 0 &&
        finalY < screenHeight && finalY + (win.initialHeight || 600) > 0
      )
    };
  };

  const dims = getResponsiveDimensions();
  if (!dims.isVisibleOnThisScreen && win.displayId !== currentDisplayId) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(win.id);
    if (win.isMaximized || win.isSnapped) return;
    
    // We can grab it if it's visible here
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
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowWidth = windowRef.current?.offsetWidth || 800;
        const windowHeight = windowRef.current?.offsetHeight || 600;

        // Calculate theoretical local position
        let localX = e.clientX - dragOffset.x;
        let localY = e.clientY - dragOffset.y;

        // Convert local position to "Master" position of the current owner display
        let masterX = localX;
        let masterY = localY;

        if (win.displayId !== currentDisplayId) {
          const layout = displayLayout[currentDisplayId];
          if (layout) {
            if (layout.left === win.displayId) masterX = localX + screenWidth;
            else if (layout.right === win.displayId) masterX = localX - screenWidth;
            else if (layout.top === win.displayId) masterY = localY + screenHeight;
            else if (layout.bottom === win.displayId) masterY = localY - screenHeight;
          }
        }

        // Check for "Hopping" - swap ownership when more than 50% is on the neighbor
        const layout = displayLayout[win.displayId];
        if (layout) {
          // Hop Right
          if (masterX > screenWidth / 2 && layout.right) {
            updateWindowPosition(win.id, masterX - screenWidth, masterY, layout.right);
            return;
          }
          // Hop Left
          if (masterX < -windowWidth / 2 && layout.left) {
            updateWindowPosition(win.id, masterX + screenWidth, masterY, layout.left);
            return;
          }
          // Hop Bottom
          if (masterY > screenHeight / 2 && layout.bottom) {
            updateWindowPosition(win.id, masterX, masterY - screenHeight, layout.bottom);
            return;
          }
          // Hop Top
          if (masterY < -windowHeight / 2 && layout.top) {
            updateWindowPosition(win.id, masterX, masterY + screenHeight, layout.top);
            return;
          }
        }

        updateWindowPosition(win.id, masterX, masterY);
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
  }, [isDragging, dragOffset, win.id, win.displayId, currentDisplayId, displayLayout, updateWindowPosition]);

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={cn(
        "fixed flex flex-col glass rounded-xl border overflow-hidden window-shadow",
        isActive ? "z-[100] border-accent/40 ring-1 ring-accent/20" : "z-10 opacity-90",
        win.isMaximized || win.isSnapped ? "rounded-none" : "",
        isDragging ? "transition-none shadow-accent/20 border-accent" : "transition-all duration-300"
      )}
      style={{
        left: dims.left,
        top: dims.top,
        width: dims.width,
        height: dims.height,
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
                  disabled={id === win.displayId}
                  className="gap-2 text-[10px] font-bold uppercase"
                >
                  <Monitor size={12} />
                  Display {id} {id === win.displayId ? '(Current)' : ''}
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

      <div className="flex-1 bg-background/40 overflow-hidden pointer-events-auto">
        {children}
      </div>
    </div>
  );
};
