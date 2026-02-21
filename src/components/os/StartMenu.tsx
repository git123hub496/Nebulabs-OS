"use client"

import React, { useState } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { 
  Search, 
  Settings, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  FolderOpen,
  Cloud,
  Calculator as CalcIcon,
  Terminal as TermIcon,
  Power,
  RefreshCw,
  LogOut,
  Globe,
  Newspaper,
  Pin,
  PinOff,
  Trash2,
  Map as MapIcon,
  Activity,
  Calendar as CalendarIcon,
  GraduationCap,
  Presentation as PresentationIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/dropdown-menu-placeholder"; // Using local implementation or radix if available
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Local implementation of Dropdown for Context Menu behavior in Start Menu
const StartAppContextMenu: React.FC<{ x: number, y: number, appId: AppId, onClose: () => void }> = ({ x, y, appId, onClose }) => {
  const { togglePinApp, pinnedApps, openApp } = useOS();
  
  return (
    <div 
      className="fixed z-[100001] w-52 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={() => {
          openApp(appId, APP_INFO[appId].label);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <RefreshCw size={14} className="text-accent/60" />
          <span>Launch</span>
        </div>
      </button>
      <button 
        onClick={() => {
          togglePinApp(appId);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          {pinnedApps.includes(appId) ? (
            <>
              <PinOff size={14} className="text-accent/60" />
              <span>Unpin from Taskbar</span>
            </>
          ) : (
            <>
              <Pin size={14} className="text-accent/60" />
              <span>Pin to Taskbar</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { 
    installedApps, openApp, restart, shutDown, taskbarPosition, 
    currentUser, logout, pinnedApps, togglePinApp 
  } = useOS();

  const [searchQuery, setSearchQuery] = useState("");
  const [appContextMenu, setAppContextMenu] = useState<{ x: number, y: number, appId: AppId } | null>(null);

  const isSchool = currentUser?.isSchoolAccount;

  // In case somehow opened on school account, return null
  if (isSchool) return null;

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId]?.label || appId);
    onClose();
  };

  const handleAppContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    e.stopPropagation();
    setAppContextMenu({ x: e.clientX, y: e.clientY, appId });
  };

  const filteredApps = installedApps.filter(appId => {
    const info = APP_INFO[appId];
    if (!info) return false;
    return info.label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const positionClasses = {
    bottom: 'bottom-14 left-0 animate-in slide-in-from-bottom-2 origin-bottom-left',
    top: 'top-14 left-0 animate-in slide-in-from-top-2 origin-top-left',
    left: 'left-14 top-0 animate-in slide-in-from-left-2 origin-top-left',
    right: 'right-14 top-0 animate-in slide-in-from-right-2 origin-top-right',
  };

  return (
    <div 
      className={cn(
        "absolute w-[360px] h-[520px] glass rounded-2xl border window-shadow p-6 flex flex-col gap-6 z-[10000] shadow-2xl",
        positionClasses[taskbarPosition]
      )}
      onClick={() => setAppContextMenu(null)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" size={16} />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, settings, and files" 
          className="pl-10 bg-white/10 border-white/10 text-foreground placeholder:text-muted-foreground/40 h-10 rounded-xl focus-visible:ring-accent"
        />
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="mb-6">
          <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80 text-accent">
            {searchQuery ? "Search Results" : "All Applications"}
          </h3>
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredApps.map(appId => {
                const info = APP_INFO[appId];
                if (!info) return null;
                const Icon = info.icon;

                return (
                  <button
                    key={appId}
                    className="flex flex-col items-center gap-2 group transition-all"
                    onClick={() => handleAppClick(appId)}
                    onContextMenu={(e) => handleAppContextMenu(e, appId)}
                  >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all border border-white/5 group-hover:bg-accent/20 group-hover:border-accent/20">
                      <Icon className="text-muted-foreground transition-colors group-hover:text-accent" size={24} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium text-center truncate w-full transition-colors group-hover:text-accent">{info.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground opacity-40 flex flex-col items-center gap-2">
              <Search size={32} strokeWidth={1} />
              <p className="text-xs">No matching applications found.</p>
            </div>
          )}
        </div>

        {!searchQuery && (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80 text-accent">Quick Links</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-foreground transition-colors group" onClick={() => handleAppClick('news')}>
                <Newspaper size={16} className="text-accent group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-accent">Nebula Local News</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-foreground transition-colors group" onClick={() => handleAppClick('browser')}>
                <Globe size={16} className="text-accent group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-accent">Research Browser</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="w-10 h-10 border-2 shrink-0 border-accent/20">
            <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
            <AvatarFallback 
              className="text-white font-bold"
              style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
            >
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-foreground truncate">{currentUser?.username || 'Guest User'}</span>
            <span className="text-[10px] truncate font-medium uppercase tracking-tighter text-accent/60">
              Local Administrator
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl" onClick={restart}>
            <RefreshCw size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={shutDown}>
            <Power size={20} />
          </Button>
        </div>
      </div>

      {appContextMenu && (
        <StartAppContextMenu 
          x={appContextMenu.x} 
          y={appContextMenu.y} 
          appId={appContextMenu.appId} 
          onClose={() => setAppContextMenu(null)} 
        />
      )}
    </div>
  );
};
