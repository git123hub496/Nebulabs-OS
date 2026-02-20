"use client"

import React from 'react';
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
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { 
    installedApps, openApp, restart, shutDown, taskbarPosition, 
    currentUser, logout, pinnedApps, togglePinApp 
  } = useOS();

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId]?.label || appId);
    onClose();
  };

  const positionClasses = {
    bottom: 'bottom-14 left-0 animate-in slide-in-from-bottom-2 origin-bottom-left',
    top: 'top-14 left-0 animate-in slide-in-from-top-2 origin-top-left',
    left: 'left-14 top-0 animate-in slide-in-from-left-2 origin-top-left',
    right: 'right-14 top-0 animate-in slide-in-from-right-2 origin-top-right',
  };

  return (
    <div className={cn(
      "absolute w-[360px] h-[520px] glass rounded-2xl border window-shadow p-6 flex flex-col gap-6 z-[10000] shadow-2xl",
      positionClasses[taskbarPosition]
    )}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" size={16} />
        <Input 
          placeholder="Search apps, settings, and files" 
          className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 h-10 rounded-xl focus-visible:ring-accent"
        />
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4 opacity-80">All Applications</h3>
          <div className="grid grid-cols-4 gap-4">
            {installedApps.map(appId => {
              const info = APP_INFO[appId];
              if (!info) return null;
              const Icon = info.icon;
              const isPinned = pinnedApps.includes(appId);

              return (
                <DropdownMenu key={appId}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex flex-col items-center gap-2 group transition-all"
                      onClick={() => handleAppClick(appId)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all border border-white/5 group-hover:border-accent/20">
                        <Icon className="text-white/80 group-hover:text-accent transition-colors" size={24} />
                      </div>
                      <span className="text-[10px] text-white/70 font-medium text-center truncate w-full group-hover:text-accent transition-colors">{info.label}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border-white/10 w-48 backdrop-blur-3xl">
                    <DropdownMenuItem onClick={() => handleAppClick(appId)} className="gap-2">
                      <div className="w-4" /> Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePinApp(appId)} className="gap-2">
                      {isPinned ? <PinOff size={14} className="text-accent" /> : <Pin size={14} className="text-accent" />}
                      {isPinned ? 'Unpin from Taskbar' : 'Pin to Taskbar'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4 opacity-80">Quick Links</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-white/80 transition-colors group" onClick={() => handleAppClick('news')}>
              <Newspaper size={16} className="text-accent group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-accent">Nebula Local News</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-white/80 transition-colors group" onClick={() => handleAppClick('maps')}>
              <MapIcon size={16} className="text-accent group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-accent">Nebula Maps</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-white/80 transition-colors group" onClick={() => handleAppClick('browser')}>
              <Globe size={16} className="text-accent group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-accent">Nebula Browser</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="w-10 h-10 border-2 border-accent/20">
            <AvatarFallback 
              className="text-white font-bold"
              style={{ backgroundColor: currentUser?.avatarColor || 'var(--accent)' }}
            >
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white/90 truncate">{currentUser?.username || 'Guest User'}</span>
            <span className="text-[10px] text-accent/60 truncate font-medium uppercase tracking-tighter">Local Administrator</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-white/40 hover:text-accent hover:bg-accent/10 rounded-xl">
                <Power size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass border-white/10 text-white p-2 rounded-xl backdrop-blur-3xl shadow-2xl">
              <DropdownMenuItem onClick={restart} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent/10 focus:bg-accent/20">
                <RefreshCw size={16} className="text-accent" />
                <span className="font-medium">Restart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shutDown} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent/10 focus:bg-accent/20">
                <Power size={16} className="text-accent" />
                <span className="font-medium">Shut Down</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={logout} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-destructive/10 focus:bg-destructive/20 text-destructive font-medium">
                <LogOut size={16} />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};