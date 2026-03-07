
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '@/context/os-context';
import { 
  X, 
  MessageSquare, 
  Settings, 
  Phone, 
  Wifi, 
  BatteryMedium, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronLeft,
  ChevronRight,
  Smartphone,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Sun,
  Smile,
  Home,
  Image as ImageIcon,
  Globe,
  Bluetooth,
  Bell,
  Moon,
  Cloud,
  ChevronDown,
  Clock,
  Send,
  Loader2,
  Triangle,
  Circle,
  Square,
  Palette,
  Check,
  TrendingUp,
  Activity,
  Flame,
  Star,
  Download,
  Maximize2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PhoneView = 'home' | 'chat' | 'settings' | 'gallery' | 'browser' | 'search' | 'health' | 'store' | 'user' | 'themes';

const CONTACTS = [
  { name: 'Sarah', role: 'Engineering', status: 'online', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'Mom', role: 'Family', status: 'away', avatar: 'https://picsum.photos/seed/mom/100/100' },
  { name: 'Admin', role: 'Infrastructure', status: 'online', avatar: 'https://picsum.photos/seed/admin/100/100' },
];

const PHONE_WALLPAPERS = [
  { id: 'nebula', name: 'Signature', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600' },
  { id: 'void', name: 'Deep Void', url: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=600' },
  { id: 'emerald', name: 'Emerald Flux', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600' },
  { id: 'sunset', name: 'Sunset Horizon', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600' },
  { id: 'cosmic', name: 'Cosmic Drift', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600' },
];

export const PhoneHub: React.FC = () => {
  const { 
    isPhoneHubOpen, 
    setIsPhoneHubOpen, 
    currentUser, 
    biosSettings, 
    playSound, 
    weatherData, 
    locationName, 
    chatMessages, 
    sendChatMessage,
    isOnline 
  } = useOS();

  const [activeView, setActiveView] = useState<PhoneView>('home');
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [phoneWallpaper, setPhoneWallpaper] = useState(PHONE_WALLPAPERS[0].url);
  const [time, setTime] = useState("");
  const [isShadeOpen, setIsShadeOpen] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(true);
  const [isDndOn, setIsDndOn] = useState(false);
  const [inputText, setInputText] = useState("");
  const [browserUrl, setBrowserUrl] = useState("https://www.google.com/search?igu=1");
  const [searchQuery, setSearchQuery] = useState("");
  
  // DRAG & SCALE STATE
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const [dim, setDim] = useState({ w: 280, h: 580 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pos.x === -1 && typeof window !== 'undefined') {
      setPos({
        x: window.innerWidth - 320,
        y: (window.innerHeight - 580) / 2
      });
    }
  }, [pos.x]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setDim({
          w: Math.max(240, Math.min(800, resizeStart.w + deltaX)),
          h: Math.max(400, Math.min(900, resizeStart.h + deltaY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  if (!isPhoneHubOpen) return null;

  const isVIP = currentUser?.isVIP || biosSettings.isVIPOverride;

  const navigate = (view: PhoneView) => {
    setActiveView(view);
    setIsShadeOpen(false);
    playSound('click');
  };

  const closeHub = () => {
    setIsPhoneHubOpen(false);
    playSound('close');
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      w: dim.w,
      h: dim.h,
      x: e.clientX,
      y: e.clientY
    });
  };

  const toggleShade = () => {
    setIsShadeOpen(!isShadeOpen);
    playSound('click');
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    await sendChatMessage(text, selectedContact.name, selectedContact.role);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`);
      setActiveView('browser');
      setSearchQuery("");
    }
  };

  return (
    <div 
      className="fixed z-[9998] pointer-events-none"
      style={{ left: pos.x, top: pos.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className={cn(
          "rounded-[3rem] border-[10px] bg-[#0a0f14] shadow-2xl relative overflow-hidden pointer-events-auto transition-all",
          isVIP ? "border-yellow-500/40 shadow-yellow-500/20" : "border-white/10",
          (isDragging || isResizing) ? "scale-[1.02] cursor-grabbing" : ""
        )}
        style={{ width: dim.w, height: dim.h }}
      >
        {/* Phone Wallpaper Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${phoneWallpaper})` }}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        {/* Pull-down Shade */}
        <div className={cn(
          "absolute inset-x-0 top-0 z-[100] glass backdrop-blur-3xl border-b border-white/10 transition-transform duration-500 ease-in-out p-6 pt-12 flex flex-col gap-6",
          isShadeOpen ? "translate-y-0" : "-translate-y-full"
        )}>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setIsBluetoothOn(!isBluetoothOn)}
              className={cn("flex flex-col items-center gap-2", isBluetoothOn ? "text-accent" : "text-white/20")}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isBluetoothOn ? "bg-accent/20" : "bg-white/5")}>
                <Bluetooth size={20} />
              </div>
              <span className="text-[8px] font-bold uppercase">Bluetooth</span>
            </button>
            <button 
              onClick={() => setIsDndOn(!isDndOn)}
              className={cn("flex flex-col items-center gap-2", isDndOn ? "text-purple-400" : "text-white/20")}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", isDndOn ? "bg-purple-400/20" : "bg-white/5")}>
                <Moon size={20} />
              </div>
              <span className="text-[8px] font-bold uppercase">DND</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-white/20">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="text-[8px] font-bold uppercase">Mute</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Notifications</span>
              <span className="text-[8px] text-white/20">Clear All</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                <MessageSquare size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white">Sarah (Engineering)</p>
                <p className="text-[9px] text-white/40">Check the latest BIOS build...</p>
              </div>
            </div>
          </div>

          <button 
            onClick={toggleShade}
            className="self-center p-2 text-white/20 hover:text-white"
          >
            <ChevronDown size={20} className="rotate-180" />
          </button>
        </div>

        {/* Notch & Top Handle (DRAG HANDLE) */}
        <div 
          className="absolute top-0 left-0 right-0 h-12 z-[110] flex items-end justify-center cursor-grab active:cursor-grabbing group"
          onMouseDown={handleDragStart}
        >
          <div className="w-24 h-6 bg-black rounded-b-2xl flex items-center justify-center gap-3 px-4 relative mb-1">
            <div className="w-6 h-1 bg-white/10 rounded-full" />
            <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 flex items-center justify-between px-6 z-40 relative">
          <span className="text-[10px] font-bold text-white/80">{time}</span>
          <div className="flex items-center gap-2 text-white/60">
            <Wifi size={10} className={isOnline ? "text-white/60" : "text-destructive"} />
            <span className="text-[8px] font-bold">5G</span>
            <BatteryMedium size={12} />
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute inset-0 pt-10 pb-14 flex flex-col">
          {activeView === 'home' && (
            <div className="flex-1 p-4 animate-in fade-in duration-300">
              {/* Home Screen Widgets */}
              <div className="space-y-4 mb-6">
                {/* Weather Widget */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{locationName}</p>
                    <h3 className="text-2xl font-black text-white">{weatherData ? `${weatherData.temp}°` : '39°'}</h3>
                    <p className="text-[10px] font-medium text-white/60">{weatherData ? weatherData.condition : 'Partly Cloudy'}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                    <Sun size={24} className="text-yellow-400 animate-spin-slow" />
                  </div>
                </div>

                {/* Clock Widget */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workspace Link</p>
                    <p className="text-xs font-bold text-white">Online Session</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { id: 'chat', label: 'Messages', icon: MessageSquare, color: 'bg-green-500' },
                  { id: 'gallery', label: 'Photos', icon: ImageIcon, color: 'bg-blue-500' },
                  { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' },
                  { id: 'browser', label: 'Browser', icon: Globe, color: 'bg-blue-600' },
                  { id: 'search', label: 'Search', icon: Search, color: 'bg-blue-400' },
                  { id: 'health', label: 'Health', icon: Heart, color: 'bg-rose-500' },
                  { id: 'store', label: 'Store', icon: ShoppingBag, color: 'bg-orange-500' },
                  { id: 'user', label: 'Hub', icon: User, color: 'bg-purple-500' },
                ].map((app) => (
                  <button 
                    key={app.id} 
                    onClick={() => navigate(app.id as PhoneView)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-all", app.color)}>
                      <app.icon size={20} className="text-white" />
                    </div>
                    <span className="text-[8px] font-bold text-white/60 group-hover:text-white uppercase tracking-tighter">{app.label}</span>
                  </button>
                ))}
              </div>

              {/* Bottom Dock */}
              <div className="absolute bottom-4 inset-x-4 h-14 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[1.5rem] flex items-center justify-around px-2">
                <button className="p-2 text-white/40 hover:text-accent"><Phone size={18} /></button>
                <button className="p-2 text-white/40 hover:text-accent" onClick={() => navigate('browser')}><Globe size={18} /></button>
                <button className="p-2 text-white/40 hover:text-accent" onClick={() => navigate('chat')}><MessageSquare size={18} /></button>
                <button className="p-2 text-white/40 hover:text-accent"><LayoutGrid size={18} /></button>
              </div>
            </div>
          )}

          {activeView === 'chat' && (
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-md animate-in slide-in-from-right duration-300">
              <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={18} /></button>
                  <h2 className="text-xs font-bold text-white">Nebula Chat</h2>
                </div>
                <Avatar className="w-6 h-6 border border-white/10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="text-[8px] bg-accent/20 text-accent">{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex gap-2 overflow-x-auto p-2 border-b border-white/5 scrollbar-none bg-black/10">
                {CONTACTS.map(c => (
                  <button 
                    key={c.name}
                    onClick={() => setSelectedContact(c)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-2 rounded-xl shrink-0 min-w-[60px] transition-all",
                      selectedContact.name === c.name ? "bg-accent/20 text-accent" : "text-white/40 hover:bg-white/5"
                    )}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback className="text-[10px] bg-white/10">{c.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[8px] font-bold">{c.name}</span>
                  </button>
                ))}
              </div>

              <ScrollArea className="flex-1 p-3" viewportRef={scrollRef}>
                <div className="space-y-3">
                  {chatMessages.filter(m => m.sender === selectedContact.name || m.recipient === selectedContact.name || m.sender === 'Nebulabs Onboarding').map((msg) => (
                    <div key={msg.id} className={cn("flex flex-col", !msg.isBot ? "items-end" : "items-start")}>
                      <div className={cn(
                        "p-2 rounded-2xl text-[10px] leading-relaxed max-w-[85%]",
                        !msg.isBot ? "bg-accent text-primary-foreground rounded-tr-none" : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                      )}>
                        {msg.text}
                      </div>
                      <span className="text-[7px] text-white/20 mt-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-white/5 bg-black/40">
                <div className="relative">
                  <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message..."
                    className="h-9 bg-white/5 border-white/10 text-[10px] pr-8 text-white placeholder:text-white/20 focus-visible:ring-accent"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-accent disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'browser' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-2 border-b border-white/5 flex items-center gap-2 bg-black/60">
                <button onClick={() => navigate('home')}><ChevronLeft size={16} className="text-accent" /></button>
                <div className="flex-1 bg-white/5 rounded-full px-3 py-1 flex items-center gap-2 border border-white/10 overflow-hidden">
                  <Globe size={10} className="text-white/40" />
                  <span className="text-[8px] text-white/60 truncate">{browserUrl}</span>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe src={browserUrl} className="w-full h-full border-none" title="Mobile Browser" />
              </div>
            </div>
          )}

          {activeView === 'search' && (
            <div className="flex-1 p-4 flex flex-col gap-6 animate-in slide-in-from-right duration-300 bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('home')}><ChevronLeft size={18} className="text-accent" /></button>
                <h2 className="text-xs font-bold text-white">Search</h2>
              </div>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <Input 
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anything..." 
                    className="h-12 pl-10 bg-white/5 border-white/10 rounded-2xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Trending</p>
                  {['Nebula Kernel v5', 'VIP Authorization', 'System Telemetry'].map(tag => (
                    <button key={tag} onClick={() => { setSearchQuery(tag); }} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/60 hover:border-accent/40 transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300 bg-black/40 backdrop-blur-md">
              <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-black/20">
                <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={18} /></button>
                <h2 className="text-xs font-bold text-white">Mobile Settings</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-2">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Smartphone size={16} /></div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-white">Device Info</p>
                        <p className="text-[8px] text-white/40 uppercase">{biosSettings.deviceName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('themes')}
                    className="w-full p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><Palette size={16} /></div>
                      <p className="text-[10px] font-bold text-white">Wallpaper & Style</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20" />
                  </button>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><Wifi size={16} /></div>
                      <p className="text-[10px] font-bold text-white">Airplane Mode</p>
                    </div>
                    <div className="w-8 h-4 bg-white/10 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/40 rounded-full" /></div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {activeView === 'themes' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300 bg-black/40 backdrop-blur-md">
              <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-black/20">
                <button onClick={() => navigate('settings')}><ChevronLeft className="text-accent" size={18} /></button>
                <h2 className="text-xs font-bold text-white">Phone Wallpaper</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 grid grid-cols-2 gap-4">
                  {PHONE_WALLPAPERS.map(wp => (
                    <button 
                      key={wp.id}
                      onClick={() => { setPhoneWallpaper(wp.url); playSound('click'); }}
                      className={cn(
                        "relative aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all",
                        phoneWallpaper === wp.url ? "border-accent scale-105 shadow-xl" : "border-white/5 opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm">
                        <p className="text-[8px] font-black uppercase text-white tracking-widest text-center">{wp.name}</p>
                      </div>
                      {phoneWallpaper === wp.url && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-lg">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeView === 'gallery' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300 bg-black/40 backdrop-blur-md">
              <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-black/20">
                <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={18} /></button>
                <h2 className="text-xs font-bold text-white">Photos</h2>
              </div>
              <div className="grid grid-cols-3 gap-0.5 p-0.5">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="aspect-square bg-white/5 overflow-hidden">
                    <img src={`https://picsum.photos/seed/phone-${i}/150/150`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="gallery" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'health' && (
            <div className="flex-1 p-4 bg-black/40 backdrop-blur-md animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('home')}><ChevronLeft size={18} className="text-accent" /></button>
                <h2 className="text-xs font-bold text-white">Nebula Health</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <Activity size={16} className="text-rose-500" />
                    <span className="text-[10px] font-bold text-white/40 uppercase">Daily Steps</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">8,432</h3>
                  <p className="text-[9px] text-green-500 font-bold mt-1">+12% from yesterday</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Flame size={16} className="text-orange-500 mb-2" />
                    <p className="text-[8px] font-bold text-white/40 uppercase">Calories</p>
                    <p className="text-lg font-black text-white">450</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Heart size={16} className="text-rose-500 mb-2" />
                    <p className="text-[8px] font-bold text-white/40 uppercase">BPM</p>
                    <p className="text-lg font-black text-white">72</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'store' && (
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-md animate-in slide-in-from-right duration-300">
              <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-black/20">
                <button onClick={() => navigate('home')}><ChevronLeft size={18} className="text-accent" /></button>
                <h2 className="text-xs font-bold text-white">App Store</h2>
              </div>
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                  <div className="p-4 bg-accent/20 rounded-2xl border border-accent/40">
                    <h3 className="text-[10px] font-black text-accent uppercase mb-1">Editor's Pick</h3>
                    <p className="text-sm font-bold text-white mb-2">Nebula Terminal Mobile</p>
                    <Button size="sm" className="h-7 w-full bg-accent text-primary-foreground font-black text-[9px] uppercase rounded-lg">Install</Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Recommended</p>
                    {[
                      { name: 'Quantum Music', size: '12MB', rating: '4.9' },
                      { name: 'Solar Browser', size: '45MB', rating: '4.7' },
                      { name: 'Nebula Pay', size: '8MB', rating: '5.0' },
                    ].map(app => (
                      <div key={app.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10" />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white truncate">{app.name}</p>
                            <p className="text-[8px] text-white/40">{app.size} • {app.rating} ★</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-accent"><Download size={14} /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {activeView === 'user' && (
            <div className="flex-1 p-4 bg-black/40 backdrop-blur-md animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 mb-8">
                <button onClick={() => navigate('home')}><ChevronLeft size={18} className="text-accent" /></button>
                <h2 className="text-xs font-bold text-white">Identity Hub</h2>
              </div>
              <div className="flex flex-col items-center gap-6 text-center">
                <Avatar className="w-20 h-20 border-4 border-accent shadow-xl">
                  <AvatarImage src={currentUser?.avatarUrl} />
                  <AvatarFallback className="bg-accent/20 text-accent text-3xl font-black">{currentUser?.username[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tight">{currentUser?.username}</h3>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-[9px] font-bold text-accent uppercase tracking-[0.2em]">{currentUser?.uniqueCode || 'USR-9021-X'}</span>
                    <ShieldCheck size={10} className="text-green-500" />
                  </div>
                </div>
                <div className="w-full space-y-2 pt-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/40 uppercase">Status</span>
                    <span className="text-[9px] font-bold text-green-500 uppercase">Authenticated</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/40 uppercase">Privilege</span>
                    <span className={cn("text-[9px] font-bold uppercase", isVIP ? "text-yellow-500" : "text-accent")}>
                      {isVIP ? "VIP Elite" : "Standard User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Bar (Android Style) */}
        <div className="absolute bottom-0 inset-x-0 h-14 flex items-center justify-around px-6 z-[120] border-t border-white/5 bg-black/60 backdrop-blur-xl">
          <button 
            className="p-2 text-white/40 hover:text-white transition-all active:scale-75" 
            onClick={() => activeView === 'home' ? closeHub() : navigate('home')}
            title="Back"
          >
            <Triangle size={14} className="-rotate-90 fill-current" />
          </button>
          <button 
            className="p-2 text-white/40 hover:text-white transition-all active:scale-75"
            onClick={() => navigate('home')}
            title="Home"
          >
            <Circle size={16} className="fill-current" />
          </button>
          <button 
            className="p-2 text-white/40 hover:text-white transition-all active:scale-75"
            onClick={() => navigate('home')}
            title="Recents"
          >
            <Square size={14} className="fill-current" />
          </button>
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-8 h-8 z-[130] cursor-nwse-resize flex items-end justify-end p-1 hover:text-accent transition-colors"
          onMouseDown={handleResizeStart}
        >
          <Maximize2 size={12} className="rotate-90 opacity-40 hover:opacity-100" />
        </div>

        {/* VIP Gold Trim */}
        {isVIP && (
          <div className="absolute inset-0 pointer-events-none border-2 border-yellow-500/20 rounded-[2.2rem] z-[130]" />
        )}
      </div>
    </div>
  );
};
