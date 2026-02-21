"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Send, X, User, Bot, Sparkles, MessageCircle, MoreHorizontal, ShieldCheck, ShieldAlert, Lock, Heart, ShoppingBag, Bell, GraduationCap, School, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const WORK_COLLEAGUES = [
  { name: 'Dev Lead (Sarah)', role: 'Engineering', status: 'online', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'System Admin', role: 'Infrastructure', status: 'online', avatar: 'https://picsum.photos/seed/admin/100/100' },
  { name: 'Nebulabs HR', role: 'Personnel', status: 'away', avatar: 'https://picsum.photos/seed/hr/100/100' },
  { name: 'Nebulabs CEO', role: 'Executive', status: 'online', avatar: 'https://picsum.photos/seed/ceo/100/100' },
];

const TEACHERS = [
  { name: 'Mr. Henderson', role: 'History Teacher', status: 'online', avatar: 'https://picsum.photos/seed/teacher1/100/100' },
  { name: 'Ms. Garcia', role: 'Science Faculty', status: 'online', avatar: 'https://picsum.photos/seed/teacher2/100/100' },
  { name: 'Principal Vance', role: 'Administration', status: 'away', avatar: 'https://picsum.photos/seed/principal/100/100' },
  { name: 'Nebula Support', role: 'IT Desk', status: 'online', avatar: '' },
];

const PERSONAL_CONTACTS = [
  { name: 'Mom', role: 'Family', status: 'online', avatar: 'https://picsum.photos/seed/mom/100/100', icon: Heart },
  { name: 'Dad', role: 'Family', status: 'away', avatar: 'https://picsum.photos/seed/dad/100/100', icon: Heart },
  { name: 'Best Friend', role: 'Social', status: 'online', avatar: 'https://picsum.photos/seed/friend/100/100', icon: User },
  { name: 'Pizza Planet', role: 'Business', status: 'online', avatar: 'https://picsum.photos/seed/pizza/100/100', icon: ShoppingBag },
  { name: 'Nebula News Bot', role: 'Subscription', status: 'online', avatar: '', icon: Bell },
];

export const ChatBar: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    sendChatMessage, 
    currentUser, 
    openApp,
    biosSettings,
    isOnline
  } = useOS();
  
  const isWorkAccount = currentUser?.isWorkAccount;
  const isSchoolAccount = currentUser?.isSchoolAccount;
  
  const currentContacts = isSchoolAccount ? TEACHERS : (isWorkAccount ? WORK_COLLEAGUES : PERSONAL_CONTACTS);
  
  const [inputText, setInputText] = useState("");
  const [selectedColleague, setSelectedColleague] = useState(currentContacts[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync selected colleague if mode changes
    setSelectedColleague(currentContacts[0]);
  }, [isWorkAccount, isSchoolAccount]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    await sendChatMessage(text, selectedColleague.name, selectedColleague.role);
  };

  // Filter messages to show only messages involving the selected colleague
  const filteredMessages = chatMessages.filter(msg => {
    if (msg.sender === 'Nebulabs Onboarding') return true;
    if (msg.isBot) return msg.sender === selectedColleague.name;
    return msg.recipient === selectedColleague.name;
  });

  if (!biosSettings.networkStack) {
    return (
      <div className="fixed inset-y-0 right-0 w-[400px] z-[9998] glass border-l border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center shadow-2xl">
        <WifiOff size={48} className="text-destructive mb-6" />
        <h2 className="text-xl font-bold text-white mb-2">Network Stack Offline</h2>
        <p className="text-sm text-white/40 leading-relaxed mb-8">
          The kernel communication bridge is unavailable. The Network Stack hardware flag is disabled in BIOS.
        </p>
        <Button variant="outline" className="border-white/10 text-white/60" onClick={() => setIsChatOpen(false)}>
          Close Workspace
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-[400px] z-[9998] glass border-l border-white/10 backdrop-blur-3xl flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isSchoolAccount ? "bg-blue-500/20" : "bg-accent/20")}>
              {isSchoolAccount ? <School className="text-blue-400" size={24} /> : <MessageCircle className="text-accent" size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isSchoolAccount ? "Nebula Classroom" : (isWorkAccount ? "Nebula Teams" : "Personal Chat")}
              </h2>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                {isSchoolAccount ? "Academic Communication" : (isWorkAccount ? "Internal Communication" : "Local Workspace Messaging")}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Colleague/Contact Select */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {currentContacts.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColleague(c)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all shrink-0 min-w-[100px]",
                selectedColleague.name === c.name 
                  ? (isSchoolAccount ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "bg-accent/20 border-accent/40 text-accent") 
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="relative">
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback className="bg-white/5">
                    {('icon' in c && c.icon) ? <c.icon size={16} /> : c.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1e2731]",
                  c.status === 'online' ? "bg-green-500" : "bg-yellow-500"
                )} />
              </div>
              <span className="text-[10px] font-bold truncate w-full text-center">{c.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
        <div className="space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-white/20 uppercase tracking-widest">
              Secure Channel established with {selectedColleague.name}
            </span>
          </div>

          {filteredMessages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", !msg.isBot ? "flex-row-reverse" : "")}>
              <Avatar className="w-8 h-8 shrink-0 border border-white/10">
                {!msg.isBot ? (
                  <>
                    <AvatarImage src={currentUser?.avatarUrl} />
                    <AvatarFallback className={cn("font-bold text-[10px]", isSchoolAccount ? "bg-blue-500/20 text-blue-400" : "bg-accent/20 text-accent")}>ME</AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src={msg.sender === 'Nebulabs Onboarding' ? '' : selectedColleague.avatar} />
                    <AvatarFallback className="bg-white/5 text-white font-bold text-[10px]">
                      {('icon' in selectedColleague && selectedColleague.icon) ? <selectedColleague.icon size={12} /> : msg.sender[0]}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className={cn("flex flex-col gap-1 max-w-[80%]", !msg.isBot ? "items-end" : "")}>
                <div className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed",
                  !msg.isBot 
                    ? (isSchoolAccount ? "bg-blue-500 text-white font-medium rounded-tr-none" : "bg-accent text-primary-foreground font-medium rounded-tr-none") 
                    : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-white/20 font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        {!isOnline && (
          <div className="flex items-center gap-2 justify-center py-2 mb-2 bg-destructive/10 border border-destructive/20 rounded-xl">
            <WifiOff size={12} className="text-destructive" />
            <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">Network Interrupted</span>
          </div>
        )}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isOnline}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isOnline ? `Message ${selectedColleague.name.split(' ')[0]}...` : "Disconnected..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 resize-none h-20 disabled:opacity-50"
          />
          <button 
            className={cn("absolute right-2 bottom-2 h-8 w-8 rounded-xl disabled:opacity-50 flex items-center justify-center transition-all", isSchoolAccount ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-accent text-primary-foreground hover:bg-accent/80")}
            onClick={handleSend}
            disabled={!inputText.trim() || !isOnline}
          >
            <Send size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 opacity-20 justify-center">
          <ShieldCheck size={10} className={isSchoolAccount ? "text-blue-400" : "text-accent"} />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">
            {isSchoolAccount ? "District Monitored Channel" : (isWorkAccount ? "Encrypted Workspace Bridge" : "End-to-End Encrypted")}
          </span>
        </div>
      </div>
    </div>
  );
};
