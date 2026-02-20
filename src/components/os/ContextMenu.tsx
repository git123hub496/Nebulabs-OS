"use client"

import React, { useEffect, useRef } from 'react';
import { useOS } from '@/context/os-context';
import { 
  RefreshCw, 
  Settings, 
  FolderPlus, 
  Monitor, 
  Terminal,
  ChevronRight,
  Layout,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { restart, openApp, createFolder, setTaskbarPosition, taskbarPosition } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-[99999] w-56 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: x, top: y }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button 
        onClick={() => handleAction(() => openApp('settings', 'Settings'))}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Monitor size={14} className="text-accent/60 group-hover:text-accent" />
          <span>Personalize Desktop</span>
        </div>
      </button>

      <button 
        onClick={() => handleAction(() => createFolder("New Folder", null))}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
      >
        <div className="flex items-center gap-3">
          <FolderPlus size={14} className="text-accent/60 group-hover:text-accent" />
          <span>New Folder</span>
        </div>
      </button>

      <div className="my-1 border-t border-white/5 mx-2" />

      <div className="relative group/sub">
        <button 
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Layout size={14} className="text-accent/60 group-hover:text-accent" />
            <span>Taskbar Position</span>
          </div>
          <ChevronRight size={12} className="opacity-40" />
        </button>
        
        <div className="absolute left-full top-0 ml-1 hidden group-hover/sub:flex flex-col glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 w-32 gap-0.5">
          {['top', 'bottom', 'left', 'right'].map((pos) => (
            <button 
              key={pos}
              onClick={() => handleAction(() => setTaskbarPosition(pos as any))}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-left transition-colors",
                taskbarPosition === pos ? "bg-accent/20 text-accent" : "hover:bg-accent/10 text-white/60 hover:text-white"
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => handleAction(() => openApp('terminal', 'Terminal'))}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-accent/60 group-hover:text-accent" />
          <span>Open in Terminal</span>
        </div>
      </button>

      <div className="my-1 border-t border-white/5 mx-2" />

      <button 
        onClick={() => handleAction(restart)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-medium text-white/80 hover:text-accent transition-colors group"
      >
        <div className="flex items-center gap-3">
          <RefreshCw size={14} className="text-accent/60 group-hover:text-accent" />
          <span>Refresh System</span>
        </div>
      </button>
    </div>
  );
};