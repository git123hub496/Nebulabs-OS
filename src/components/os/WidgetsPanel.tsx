"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { Cloud, Sun, Newspaper, TrendingUp, Calendar, Zap, LayoutGrid, ArrowUpRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const WidgetsPanel: React.FC = () => {
  const { isWidgetsOpen, setIsWidgetsOpen, accentColor, currentUser } = useOS();

  if (!isWidgetsOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 w-[400px] z-[9998] glass border-r border-white/10 backdrop-blur-3xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <LayoutGrid className="text-accent" size={24} />
          <h2 className="text-xl font-bold">Nebula Widgets</h2>
        </div>
        <button 
          onClick={() => setIsWidgetsOpen(false)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <Zap size={18} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
        <Input 
          placeholder="Search for widgets..." 
          className="pl-10 bg-white/10 border-white/10 text-white rounded-xl"
        />
      </div>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-400/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Weather • Local</p>
                <h3 className="text-3xl font-black">72°</h3>
                <p className="text-sm font-medium">Mostly Sunny</p>
                <p className="text-[11px] text-white/40">San Francisco, CA</p>
              </div>
              <Sun className="text-yellow-400 animate-spin-slow" size={48} />
            </div>
            <div className="mt-6 flex justify-between items-center relative z-10">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[9px] text-white/30 uppercase">High</p>
                  <p className="text-xs font-bold">78°</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/30 uppercase">Low</p>
                  <p className="text-xs font-bold">64°</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-blue-400 flex items-center gap-1 group-hover:underline">
                7-day forecast <ArrowUpRight size={10} />
              </button>
            </div>
          </div>

          {/* News Widget */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper size={14} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Top News</span>
              </div>
              <TrendingUp size={12} className="text-green-400" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0 overflow-hidden">
                  <img src="https://picsum.photos/seed/n1/100/100" alt="news" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[11px] font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">Nebula WebOS hits 1 million active users this quarter</h4>
                  <p className="text-[9px] text-white/30">2 hours ago • Tech</p>
                </div>
              </div>
              <div className="flex gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0 overflow-hidden">
                  <img src="https://picsum.photos/seed/n2/100/100" alt="news" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[11px] font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">New security protocols deployed across virtual workspace</h4>
                  <p className="text-[9px] text-white/30">5 hours ago • System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upcoming Events</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-accent rounded-full" />
                <div>
                  <h4 className="text-[11px] font-bold">Design Sync with Team</h4>
                  <p className="text-[9px] text-white/30">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-white/10 rounded-full" />
                <div>
                  <h4 className="text-[11px] font-bold text-white/60">Nebula Product Launch</h4>
                  <p className="text-[9px] text-white/30">Tomorrow, 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent">{currentUser?.username[0].toUpperCase()}</span>
          </div>
          <span className="text-[11px] font-medium opacity-60">Personalized for {currentUser?.username}</span>
        </div>
        <button className="text-[10px] font-bold text-accent hover:underline">Edit Layout</button>
      </div>
    </div>
  );
};