
"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { Cloud, Sun, Newspaper, TrendingUp, Calendar, Zap, LayoutGrid, ArrowUpRight, Search, MapPin, RefreshCw, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const WidgetsPanel: React.FC = () => {
  const { isWidgetsOpen, setIsWidgetsOpen, weatherData, locationName, userLocation, requestLocation, openApp, currentUser } = useOS();

  if (!isWidgetsOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 w-[400px] z-[9998] glass border-r border-white/10 backdrop-blur-3xl p-6 flex flex-col gap-6 animate-in slide-in-from-left duration-300 shadow-2xl",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <LayoutGrid className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nebula Widgets</h2>
            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Live Intelligence</p>
          </div>
        </div>
        <button 
          onClick={() => setIsWidgetsOpen(false)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <Zap size={16} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
        <Input 
          placeholder="Search for widgets..." 
          className="pl-10 bg-white/10 border-white/10 text-white rounded-xl h-11 focus-visible:ring-accent"
        />
      </div>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-400/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Weather • Accurate</p>
                <h3 className="text-3xl font-black">{weatherData ? `${weatherData.temp}°` : '--°'}</h3>
                <p className="text-sm font-medium">{weatherData ? weatherData.condition : 'Establishing...'}</p>
                <p className="text-[11px] text-white/40 flex items-center gap-1">
                  <MapPin size={10} />
                  {locationName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Sun className="text-yellow-400 animate-spin-slow" size={48} />
                <button 
                  onClick={requestLocation}
                  className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                  title="Update Location"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            
            {!userLocation && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-center p-4">
                <p className="text-xs font-bold text-white mb-3">Sync Local Sensors</p>
                <Button 
                  size="sm" 
                  className="bg-blue-500 text-white h-8 text-[10px] font-black uppercase rounded-lg"
                  onClick={requestLocation}
                >
                  Authorize Location
                </Button>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center relative z-10">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[9px] text-white/30 uppercase">Feels Like</p>
                  <p className="text-xs font-bold">{weatherData ? `${weatherData.temp - 2}°` : '--'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-white/30 uppercase">Status</p>
                  <p className="text-xs font-bold">Stable</p>
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
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Top Stories</span>
              </div>
              <TrendingUp size={12} className="text-green-400" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 group cursor-pointer" onClick={() => openApp('news', 'Nebula News')}>
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0 overflow-hidden border border-white/5">
                  <img src="https://picsum.photos/seed/n1/100/100" alt="news" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[11px] font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">Nebula Core v5.0 prepares for global rollout</h4>
                  <p className="text-[9px] text-white/30">Just now • Tech</p>
                </div>
              </div>
              <div className="flex gap-3 group cursor-pointer" onClick={() => openApp('news', 'Nebula News')}>
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0 overflow-hidden border border-white/5">
                  <img src="https://picsum.photos/seed/n2/100/100" alt="news" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-[11px] font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2">New security protocols detected in your sector</h4>
                  <p className="text-[9px] text-white/30">Local • {locationName}</p>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest" onClick={() => openApp('news', 'Nebula News')}>
              Read Full Feed
            </button>
          </div>

          {/* Maps Widget Mini */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapIcon size={14} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Maps Telemetry</span>
              </div>
            </div>
            <div className="aspect-video w-full rounded-xl bg-black/40 border border-white/5 overflow-hidden group relative cursor-pointer" onClick={() => openApp('maps', 'Nebula Maps')}>
              <img 
                src={userLocation ? `https://picsum.photos/seed/${userLocation.lat}/400/300` : "https://picsum.photos/seed/map-widget/400/300"} 
                alt="map" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2 bg-accent/20 backdrop-blur-md rounded-full border border-accent/40 text-accent">
                   <MapPin size={24} />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-bold text-white">
                {locationName}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-accent/40 bg-accent/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent">{currentUser?.username[0].toUpperCase() || 'G'}</span>
          </div>
          <span className="text-[11px] font-medium opacity-60">Personalized for {currentUser?.username || 'Guest'}</span>
        </div>
        <button className="text-[10px] font-bold text-accent hover:underline uppercase tracking-tighter">Edit Hub</button>
      </div>
    </div>
  );
};
