
"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { 
  X, 
  MessageSquare, 
  Camera, 
  Settings, 
  Phone, 
  Wifi, 
  BatteryMedium, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Sun,
  Smile,
  Home,
  Pin
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type PhoneView = 'home' | 'chat' | 'settings' | 'gallery';

export const PhoneHub: React.FC = () => {
  const { isPhoneHubOpen, setIsPhoneHubOpen, accentColor, currentUser, biosSettings, playSound } = useOS();
  const [activeView, setActiveView] = useState<PhoneView>('home');
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneHubOpen) return null;

  const isVIP = currentUser?.isVIP || biosSettings.isVIPOverride;

  const navigate = (view: PhoneView) => {
    setActiveView(view);
    playSound('click');
  };

  const closeHub = () => {
    setIsPhoneHubOpen(false);
    playSound('close');
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-[400px] z-[9998] flex items-center justify-center p-8 pointer-events-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={cn(
        "w-[340px] h-[680px] rounded-[3rem] border-[12px] bg-[#0a0f14] shadow-2xl relative overflow-hidden pointer-events-auto animate-in slide-in-from-right duration-500",
        isVIP ? "border-yellow-500/40 shadow-yellow-500/20" : "border-white/10"
      )}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-4 px-4">
          <div className="w-8 h-1 bg-white/10 rounded-full" />
          <div className="w-2 h-2 bg-white/10 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="h-12 flex items-center justify-between px-8 z-40 relative">
          <span className="text-[11px] font-bold text-white/80">{time}</span>
          <div className="flex items-center gap-2 text-white/60">
            <Wifi size={12} />
            <span className="text-[9px] font-bold">5G</span>
            <BatteryMedium size={14} />
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute inset-0 pt-12 pb-16 flex flex-col bg-gradient-to-b from-black/20 to-black/60">
          {activeView === 'home' && (
            <div className="flex-1 p-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-4 gap-6 mt-4">
                {[
                  { id: 'chat', label: 'Messages', icon: MessageSquare, color: 'bg-green-500' },
                  { id: 'gallery', label: 'Photos', icon: ImageIcon, color: 'bg-blue-500' },
                  { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500' },
                  { id: 'phone', label: 'Phone', icon: Phone, color: 'bg-emerald-500' },
                  { id: 'search', label: 'Search', icon: Search, color: 'bg-blue-400' },
                  { id: 'love', label: 'Health', icon: Heart, color: 'bg-rose-500' },
                  { id: 'shop', label: 'Store', icon: ShoppingBag, color: 'bg-orange-500' },
                  { id: 'user', label: 'Hub', icon: User, color: 'bg-purple-500' },
                ].map((app) => (
                  <button 
                    key={app.id} 
                    onClick={() => navigate(app.id as PhoneView)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-active:scale-90 transition-all", app.color)}>
                      <app.icon size={24} className="text-white" />
                    </div>
                    <span className="text-[9px] font-bold text-white/60 group-hover:text-white uppercase tracking-tighter">{app.label}</span>
                  </button>
                ))}
              </div>

              {/* Bottom Dock */}
              <div className="absolute bottom-6 inset-x-6 h-16 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2rem] flex items-center justify-around px-4">
                <button className="p-3 text-white/40 hover:text-accent"><Phone size={20} /></button>
                <button className="p-3 text-white/40 hover:text-accent"><Globe size={20} /></button>
                <button className="p-3 text-white/40 hover:text-accent" onClick={() => navigate('chat')}><MessageSquare size={20} /></button>
                <button className="p-3 text-white/40 hover:text-accent"><LayoutGrid size={20} /></button>
              </div>
            </div>
          )}

          {activeView === 'chat' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={20} /></button>
                <h2 className="text-sm font-bold">Nebula Chat</h2>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {[
                    { from: 'Sarah', text: 'Did you see the latest BIOS build?', time: '10:05 AM' },
                    { from: 'Mom', text: 'Stay safe in the workspace! <3', time: 'Yesterday' },
                    { from: 'Admin', text: 'Security level 4 authorized.', time: 'Monday' },
                  ].map((msg, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">{msg.from[0]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-white/80">{msg.from}</span>
                          <span className="text-[8px] text-white/20">{msg.time}</span>
                        </div>
                        <p className="text-[11px] text-white/40 bg-white/5 p-2 rounded-lg rounded-tl-none">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={20} /></button>
                <h2 className="text-sm font-bold">Phone Settings</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500"><Wifi size={16} /></div>
                      <span className="text-xs font-bold">Airplane Mode</span>
                    </div>
                    <div className="w-8 h-4 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 w-2 h-2 bg-white/40 rounded-full" /></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500"><Zap size={16} /></div>
                      <span className="text-xs font-bold">Fast Charging</span>
                    </div>
                    <div className="w-8 h-4 bg-accent rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" /></div>
                  </div>
                  <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-accent" />
                      <span className="text-[9px] font-black uppercase text-accent">Linked Device</span>
                    </div>
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{biosSettings.deviceName}</p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {activeView === 'gallery' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <button onClick={() => navigate('home')}><ChevronLeft className="text-accent" size={20} /></button>
                <h2 className="text-sm font-bold">Camera Roll</h2>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1">
                {[1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} className="aspect-square bg-white/5 overflow-hidden">
                    <img src={`https://picsum.photos/seed/phone-${i}/200/200`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="gallery" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Bar */}
        <div className="h-16 flex items-center justify-center px-12 gap-16 z-50 relative border-t border-white/5">
          <button className="text-white/20 hover:text-white transition-colors" onClick={closeHub}><ChevronLeft size={20} /></button>
          <button 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all active:scale-90"
            onClick={() => navigate('home')}
          >
            <div className="w-3 h-3 rounded-full border-2 border-white/40" />
          </button>
          <button className="text-white/20 hover:text-white transition-colors"><LayoutGrid size={18} /></button>
        </div>

        {/* VIP Gold Trim */}
        {isVIP && (
          <div className="absolute inset-0 pointer-events-none border-2 border-yellow-500/20 rounded-[2.2rem]" />
        )}
      </div>
    </div>
  );
};
