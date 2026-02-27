
"use client"

import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Search, Navigation, Layers, MapPin, ZoomIn, ZoomOut, ExternalLink, ShieldCheck, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';

export const NebulaMaps: React.FC = () => {
  const { isOnline, userLocation, locationName, requestLocation } = useOS();
  const [search, setSearch] = useState("");
  const [mapUrl, setMapUrl] = useState(`https://www.google.com/maps?q=New+York&output=embed`);

  useEffect(() => {
    if (userLocation) {
      setMapUrl(`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lon}&output=embed`);
      setSearch(locationName);
    }
  }, [userLocation, locationName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) return;
    const encodedSearch = encodeURIComponent(search);
    setMapUrl(`https://www.google.com/maps?q=${encodedSearch}&output=embed`);
  };

  const externalUrl = `https://www.google.com/maps/search/${encodeURIComponent(search)}`;

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      {/* Maps Toolbar */}
      <div className="p-3 border-b border-white/5 bg-black/40 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 px-2 border-r border-white/10 mr-1">
          <MapIcon size={18} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Nebula Maps</span>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 bg-black/40 border-white/10 text-xs pl-9 pr-4 focus-visible:ring-accent text-white/80 rounded-xl"
            placeholder={isOnline ? "Search coordinate index..." : "Sensor Offline"}
            disabled={!isOnline}
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        </form>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("h-9 w-9 text-white/40 hover:text-accent", userLocation && "text-accent")} 
            title="My Location"
            onClick={requestLocation}
          >
            <Navigation size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-accent" title="Refresh Sensors"><RefreshCw size={16} /></Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 text-[10px] gap-2 border-white/10 text-white/60 hover:bg-accent hover:text-primary transition-all font-bold"
            asChild
            disabled={!isOnline}
          >
            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={12} />
              Open External
            </a>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#ebebeb] relative overflow-hidden">
        {isOnline ? (
          <>
            {!userLocation && (
              <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 gap-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border border-accent/40 animate-pulse">
                  <MapPin size={40} className="text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Authorize Satellite Uplink</h3>
                  <p className="text-sm text-white/40 max-w-xs font-medium">Nebula Maps requires GPS sensor authorization to calibrate your local coordinate matrix.</p>
                </div>
                <Button 
                  onClick={requestLocation}
                  className="bg-accent text-primary font-black uppercase tracking-[0.2em] px-10 h-12 rounded-xl shadow-xl shadow-accent/20"
                >
                  Enable GPS sensors
                </Button>
              </div>
            )}

            <iframe 
              src={mapUrl}
              className="w-full h-full border-none"
              title="Nebula Maps Viewport"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Map Controls Overlay */}
            <div className="absolute right-4 bottom-8 flex flex-col gap-2">
              <Button size="icon" className="bg-white text-black hover:bg-white/90 shadow-xl border-none rounded-xl h-10 w-10"><ZoomIn size={18} /></Button>
              <Button size="icon" className="bg-white text-black hover:bg-white/90 shadow-xl border-none rounded-xl h-10 w-10"><ZoomOut size={18} /></Button>
            </div>

            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                <ShieldCheck size={12} className="text-accent" />
                <span className="text-[9px] font-black text-white uppercase tracking-wider">Encrypted Telemetry</span>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#161d25] flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 border border-destructive/40">
              <WifiOff size={40} className="text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Maps Data Unavailable</h2>
            <p className="text-sm text-white/40 max-w-xs mb-8">Navigation services are restricted while the hardware network stack is offline.</p>
            <Button className="bg-accent text-primary font-bold px-8 rounded-xl">Re-establish Uplink</Button>
          </div>
        )}
      </div>
    </div>
  );
};
