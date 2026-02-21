
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
  GraduationCap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  const [searchQuery, setSearchQuery] = useState("");

  const isSchool = currentUser?.isSchoolAccount;

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId]?.label || appId);
    onClose();
  };

  const filteredApps = installedApps.filter(appId => {
    // School restrictions
    if (isSchool && (appId === 'news' || appId === 'virus' || appId === 'terminal')) return false;
    
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
    <div className={cn(
      "absolute w-[360px] h-[520px] glass rounded-2xl border window-shadow p-6 flex flex-col gap-6 z-[10000] shadow-2xl",
      positionClasses[taskbarPosition],
      isSchool && "border-blue-500/20"
    )}>
      <div className="relative">
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2", isSchool ? "text-blue-400/60" : "text-accent/60")} size={16} />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isSchool ? "Search learning tools..." : "Search apps, settings, and files"} 
          className="pl-10 bg-white/10 border-white/10 text-foreground placeholder:text-muted-foreground/40 h-10 rounded-xl focus-visible:ring-accent"
        />
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="mb-6">
          <h3 className={cn("text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80", isSchool ? "text-blue-400" : "text-accent")}>
            {searchQuery ? "Search Results" : (isSchool ? "Academic Suite" : "All Applications")}
          </h3>
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredApps.map(appId => {
                const info = APP_INFO[appId];
                if (!info) return null;
                const Icon = info.icon;
                const isPinned = pinnedApps.includes(appId);

                return (
                  <button
                    key={appId}
                    className="flex flex-col items-center gap-2 group transition-all"
                    onClick={() => handleAppClick(appId)}
                  >
                    <div className={cn("w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all border border-white/5", isSchool ? "group-hover:bg-blue-500/20 group-hover:border-blue-500/20" : "group-hover:bg-accent/20 group-hover:border-accent/20")}>
                      <Icon className={cn("text-muted-foreground transition-colors", isSchool ? "group-hover:text-blue-400" : "group-hover:text-accent")} size={24} />
                    </div>
                    <span className={cn("text-[10px] text-muted-foreground font-medium text-center truncate w-full transition-colors", isSchool ? "group-hover:text-blue-400" : "group-hover:text-accent")}>{info.label}</span>
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
            <h3 className={cn("text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80", isSchool ? "text-blue-400" : "text-accent")}>Quick Links</h3>
            <div className="space-y-1">
              {isSchool ? (
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-500/10 text-sm text-foreground transition-colors group" onClick={() => handleAppClick('slides')}>
                  <Presentation size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-blue-400">Classroom Presentations</span>
                </button>
              ) : (
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-foreground transition-colors group" onClick={() => handleAppClick('news')}>
                  <Newspaper size={16} className="text-accent group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-accent">Nebula Local News</span>
                </button>
              )}
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/10 text-sm text-foreground transition-colors group" onClick={() => handleAppClick('browser')}>
                <Globe size={16} className={cn("group-hover:scale-110 transition-transform", isSchool ? "text-blue-400" : "text-accent")} />
                <span className={isSchool ? "group-hover:text-blue-400" : "group-hover:text-accent"}>Research Browser</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className={cn("w-10 h-10 border-2 shrink-0", isSchool ? "border-blue-500/40" : "border-accent/20")}>
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
            <span className={cn("text-[10px] truncate font-medium uppercase tracking-tighter", isSchool ? "text-blue-400" : "text-accent/60")}>
              {isSchool ? "Student • NHU-7" : "Local Administrator"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl">
                <Power size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass border-white/10 text-foreground p-2 rounded-xl backdrop-blur-3xl shadow-2xl">
              <DropdownMenuItem onClick={restart} className="gap-3 cursor-pointer p-3 rounded-lg">
                <RefreshCw size={16} className="text-accent" />
                <span className="font-medium">Restart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shutDown} className="gap-3 cursor-pointer p-3 rounded-lg">
                <Power size={16} className="text-accent" />
                <span className="font-medium">Shut Down</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={logout} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-destructive/10 text-destructive font-medium">
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
