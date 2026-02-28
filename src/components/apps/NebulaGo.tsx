
"use client"

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Map as MapIcon, 
  Music, 
  Phone, 
  LayoutGrid, 
  Mic, 
  Settings, 
  Play, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Wifi, 
  BatteryMedium, 
  Clock, 
  Navigation,
  MessageSquare,
  Search,
  Zap,
  Home,
  Menu,
  Globe,
  Newspaper
} from 'lucide-react';
import { useOS } from '@/context/os-context';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type GoTab = 'dashboard' | 'maps' | 'media' | 'phone' | 'apps';

export const NebulaGo: React.FC = () => {
  const { weatherData, locationName, isOnline, openApp, playSound } = useOS();
  const [activeTab, setActiveTab] = useState<GoTab>('dashboard');
  const [currentTime, setCurrentTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: GoTab) => {
    setActiveTab(tab);
    playSound('click');
  };

  return (
    <div className="flex h-full bg-[#0a0a0a] text-white overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-black flex flex-col items-center py-6 border-r border-white/5 shrink-0">
        <button 
          onClick={() => handleTabChange('dashboard')}
          className={cn(
            "p-4 rounded-2xl transition-all mb-4",
            activeTab === 'dashboard' ? "bg-accent text-primary-foreground scale-110 shadow-lg" : "text-white/40 hover:bg-white/5"
          )}
        >
          <Home size={28} />
        </button>
        <button 
          onClick={() => handleTabChange('maps')}
          className={cn(
            "p-4 rounded-2xl transition-all mb-4",
            activeTab === 'maps' ? "bg-accent text-primary-foreground scale-110 shadow-lg" : "text-white/40 hover:bg-white/5"
          )}
        >
          <Navigation size={28} />
        </button>
        <button 
          onClick={() => handleTabChange('media')}
          className={cn(
            "p-4 rounded-2xl transition-all mb-4",
            activeTab === 'media' ? "bg-accent text-primary-foreground scale-110 shadow-lg" : "text-white/40 hover:bg-white/5"
          )}
        >
          <Music size={28} />
        </button>
        <button 
          onClick={() => handleTabChange('phone')}
          className={cn(
            "p-4 rounded-2xl transition-all mb-4",
            activeTab === 'phone' ? "bg-accent text-primary-foreground scale-110 shadow-lg" : "text-white/40 hover:bg-white/5"
          )}
        >
          <Phone size={28} />
        </button>
        
        <div className="mt-auto space-y-4">
          <button className="p-4 text-white/40 hover:text-white transition-colors">
            <Mic size={28} className="text-accent" />
          </button>
          <button 
            onClick={() => handleTabChange('apps')}
            className="p-4 text-white/40 hover:text-white transition-colors"
          >
            <LayoutGrid size={28} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Status Bar Top Overlay */}
        <div className="absolute top-0 inset-x-0 h-12 flex items-center justify-between px-8 z-20 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-white drop-shadow-md">{currentTime}</span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <Wifi size={18} className={isOnline ? "text-green-500" : "text-red-500"} />
            <BatteryMedium size={18} />
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="flex-1 grid grid-cols-12 gap-4 p-6 pt-16 animate-in fade-in duration-500">
            {/* Left: Mini Map */}
            <div className="col-span-7 bg-[#1a1a1a] rounded-[2rem] border border-white/5 overflow-hidden relative group">
              <iframe 
                src="https://www.google.com/maps?q=New+York&output=embed"
                className="w-full h-full border-none grayscale-[0.5] opacity-80"
                title="Mini Map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
                <div className="bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                    <Navigation size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-accent tracking-widest">Next Turn</p>
                    <p className="text-sm font-bold">Broadway Ave • 0.4 mi</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleTabChange('maps')}
                  className="rounded-full bg-white text-black hover:bg-white/90 font-black h-12 px-6"
                >
                  FULL MAP
                </Button>
              </div>
            </div>

            {/* Right: Media & Info */}
            <div className="col-span-5 flex flex-col gap-4">
              {/* Media Card */}
              <div className="flex-1 bg-gradient-to-br from-[#222] to-[#111] rounded-[2rem] border border-white/5 p-8 flex flex-col gap-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-[#333] rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                    <img src="https://picsum.photos/seed/nebula-music/300/300" className="w-full h-full object-cover" alt="Album Art" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight leading-none">Quantum Drift</h3>
                    <p className="text-accent font-bold">Nebula Soundscapes</p>
                    <p className="text-white/40 text-sm">Synthetic Horizons</p>
                  </div>
                </div>
                
                <div className="space-y-4 mt-auto">
                  <div className="space-y-2">
                    <Progress value={45} className="h-1.5 bg-white/10" />
                    <div className="flex justify-between text-[10px] font-bold text-white/20">
                      <span>1:45</span>
                      <span>3:20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-10">
                    <button className="text-white/40 hover:text-white transition-colors"><SkipBack size={32} /></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      {isPlaying ? <div className="flex gap-1.5"><div className="w-2 h-8 bg-black rounded-full" /><div className="w-2 h-8 bg-black rounded-full" /></div> : <Play size={32} className="ml-1" />}
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors"><SkipForward size={32} /></button>
                  </div>
                </div>
              </div>

              {/* Weather & Info */}
              <div className="h-32 bg-[#1a1a1a] rounded-[2rem] border border-white/5 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Zap size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-black">{weatherData ? `${weatherData.temp}°` : '39°'}</p>
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{locationName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                  <Wifi size={14} className="text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Link</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maps' && (
          <div className="flex-1 animate-in fade-in duration-500 bg-[#ebebeb] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12094.57348593182!2d-74.0059728!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1625687235000!5m2!1sen!2sus"
              className="w-full h-full border-none"
              title="Full Map Navigation"
            />
            <div className="absolute top-16 left-6 w-80 bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 space-y-6 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  placeholder="Where to?" 
                  className="w-full h-12 bg-white/10 border-none rounded-2xl pl-10 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-accent uppercase tracking-widest">Recent Destinations</p>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/40 group-hover:text-white"><Home size={16} /></div>
                    <span className="text-sm font-bold">Home</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors text-left group">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/40 group-hover:text-white"><Search size={16} /></div>
                    <span className="text-sm font-bold">Nebulabs HQ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="flex-1 p-12 pt-20 animate-in fade-in zoom-in-95 duration-500 overflow-auto">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-8">
              {[
                { id: 'browser', label: 'Nebula Browser', icon: Globe, color: 'bg-blue-500' },
                { id: 'mail', label: 'Messages', icon: MessageSquare, color: 'bg-green-500' },
                { id: 'calendar', label: 'Calendar', icon: Clock, color: 'bg-orange-500' },
                { id: 'news', label: 'News', icon: Newspaper, color: 'bg-rose-500' },
                { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' },
                { id: 'assistant', label: 'Assistant', icon: Zap, color: 'bg-yellow-500' },
              ].map(app => (
                <button 
                  key={app.id}
                  onClick={() => openApp(app.id as any, app.label)}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl group-active:scale-90 transition-all", app.color)}>
                    <app.icon size={36} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-widest">{app.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-[#111] to-black animate-in slide-in-from-bottom-4">
             <div className="w-64 h-64 bg-[#222] rounded-[3rem] shadow-2xl overflow-hidden mb-12 border border-white/5 scale-110">
                <img src="https://picsum.photos/seed/music-large/600/600" className="w-full h-full object-cover" alt="Large Album Art" />
             </div>
             <div className="text-center space-y-2 mb-12">
                <h2 className="text-4xl font-black tracking-tight text-white">Synthetic Horizons</h2>
                <p className="text-xl text-accent font-bold">Nebula Soundscapes</p>
             </div>
             <div className="w-full max-w-2xl space-y-12">
                <div className="space-y-4">
                  <Progress value={45} className="h-2 bg-white/5" />
                  <div className="flex justify-between text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
                    <span>1:45</span>
                    <span>3:20</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-16">
                  <button className="text-white/20 hover:text-white transition-colors"><SkipBack size={48} /></button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-2xl shadow-white/5"
                  >
                    {isPlaying ? <div className="flex gap-2"><div className="w-2.5 h-10 bg-black rounded-full" /><div className="w-2.5 h-10 bg-black rounded-full" /></div> : <Play size={48} className="ml-2" />}
                  </button>
                  <button className="text-white/20 hover:text-white transition-colors"><SkipForward size={48} /></button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'phone' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 p-12 animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40 mb-4">
              <Phone className="text-accent" size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white/40">Communication Hub</h2>
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <Button className="h-20 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-bold">Favorites</Button>
              <Button className="h-20 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-bold">Recent</Button>
              <Button className="h-20 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-bold">Contacts</Button>
              <Button className="h-20 rounded-3xl bg-accent text-primary-foreground text-lg font-black uppercase tracking-widest">Keypad</Button>
            </div>
          </div>
        )}
      </div>

      {/* Driver-side Control HUD Right Overlay */}
      <div className="w-20 bg-black flex flex-col items-center justify-center py-6 border-l border-white/5 shrink-0 gap-8">
        <button className="p-4 text-white/20 hover:text-white transition-colors"><Volume2 size={28} /></button>
        <div className="w-px h-12 bg-white/10" />
        <button className="p-4 text-white/20 hover:text-white transition-colors"><Menu size={28} /></button>
      </div>
    </div>
  );
};
