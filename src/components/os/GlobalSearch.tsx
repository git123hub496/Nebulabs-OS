
"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { Search, Sparkles, Command, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GlobalSearch: React.FC = () => {
  const { taskbarPosition, installedApps, openApp } = useOS();
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return installedApps.filter(appId => {
      const info = APP_INFO[appId];
      return info?.label.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 5);
  }, [query, installedApps]);

  const handleClose = () => {
    setIsVisible(false);
    setQuery("");
  };

  const handleLaunch = (appId: AppId) => {
    openApp(appId, APP_INFO[appId].label);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleLaunch(results[0]);
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Listen for ALT + O globally to toggle visibility
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Auto-focus input when HUD becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isVisible && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible]);

  const isAtBottom = taskbarPosition === 'top';

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[9990] w-full max-w-[500px] transition-all duration-500 ease-in-out px-4",
        isAtBottom ? "bottom-32" : "top-12"
      )}
    >
      <div className={cn(
        "glass border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden ring-2 ring-accent/40 bg-background/60 scale-[1.02]"
      )}>
        <div className="relative flex items-center h-14 px-5 gap-3">
          <Search className="shrink-0 text-accent" size={20} />
          <input 
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps and system tools..."
            className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground/40 font-medium h-full"
          />
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/20 hover:text-white transition-colors"
            title="Close Search"
          >
            <X size={16} />
          </button>
        </div>

        {query.trim() && (
          <div className="border-t border-white/5 bg-black/5 animate-in fade-in slide-in-from-top-2">
            <div className="p-2 space-y-1">
              {results.length > 0 ? (
                results.map(appId => {
                  const info = APP_INFO[appId];
                  const Icon = info.icon;
                  return (
                    <button
                      key={appId}
                      onClick={() => handleLaunch(appId)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-accent/10 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/10 group-hover:scale-110 transition-transform">
                          <Icon size={18} className="text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{info.label}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">System Application</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform" />
                    </button>
                  )
                })
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground opacity-40 gap-2">
                  <Sparkles size={24} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No matching results found</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 bg-accent/5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Command size={10} className="text-accent" />
                <span className="text-[9px] font-black text-accent uppercase tracking-tighter">Nebula Command HUD</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-bold opacity-60">Press ENTER to launch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
