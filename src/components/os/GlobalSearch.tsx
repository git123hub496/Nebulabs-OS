
"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOS, AppId, APP_INFO } from '@/context/os-context';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const GlobalSearch: React.FC = () => {
  const { taskbarPosition, installedApps, openApp, theme } = useOS();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return installedApps.filter(appId => {
      const info = APP_INFO[appId];
      return info?.label.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 5);
  }, [query, installedApps]);

  const handleLaunch = (appId: AppId) => {
    openApp(appId, APP_INFO[appId].label);
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleLaunch(results[0]);
    }
    if (e.key === 'Escape') {
      setQuery("");
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  // Listen for ALT + O globally to jump to search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAtBottom = taskbarPosition === 'top';

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[9990] w-full max-w-[500px] transition-all duration-500 ease-in-out px-4",
        isAtBottom ? "bottom-20" : "top-4"
      )}
    >
      <div className={cn(
        "glass border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
        isFocused ? "ring-2 ring-accent/40 bg-background/60 scale-[1.02]" : "bg-background/20"
      )}>
        <div className="relative flex items-center h-12 px-4 gap-3">
          <Search className={cn("shrink-0 transition-colors", isFocused ? "text-accent" : "text-white/40")} size={18} />
          <input 
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search apps, tools, and intelligence..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/40 font-medium h-full"
          />
          <div className="flex items-center gap-1 opacity-20 hidden sm:flex">
            <div className="px-1.5 py-0.5 rounded border border-foreground/50 text-[9px] font-black">ALT</div>
            <div className="px-1.5 py-0.5 rounded border border-foreground/50 text-[9px] font-black">O</div>
          </div>
        </div>

        {isFocused && query.trim() && (
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
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-accent/10 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/10 group-hover:scale-110 transition-transform">
                          <Icon size={16} className="text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{info.label}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Application</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 transition-transform" />
                    </button>
                  )
                })
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground opacity-40 gap-2">
                  <Sparkles size={24} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No local results found</p>
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-accent/5 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Command size={10} className="text-accent" />
                <span className="text-[9px] font-black text-accent uppercase tracking-tighter">Nebula Intelligence Engine</span>
              </div>
              <span className="text-[9px] text-muted-foreground font-medium">Press ENTER to launch</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
