
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { Send, X, User, Bot, Sparkles, MessageCircle, MoreHorizontal, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const COLLEAGUES = [
  { name: 'Dev Lead (Sarah)', role: 'Engineering', status: 'online', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { name: 'System Admin', role: 'Infrastructure', status: 'online', avatar: 'https://picsum.photos/seed/admin/100/100' },
  { name: 'Nebulabs HR', role: 'Personnel', status: 'away', avatar: 'https://picsum.photos/seed/hr/100/100' },
  { name: 'Nebulabs CEO', role: 'Executive', status: 'online', avatar: 'https://picsum.photos/seed/ceo/100/100' },
];

export const ChatBar: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendChatMessage, currentUser, openApp } = useOS();
  const [inputText, setInputText] = useState("");
  const [selectedColleague, setSelectedColleague] = useState(COLLEAGUES[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isWorkAccount = currentUser?.isWorkAccount;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim() || !isWorkAccount) return;
    const text = inputText;
    setInputText("");
    await sendChatMessage(text, selectedColleague.name, selectedColleague.role);
  };

  // Filter messages to show only welcome message or messages involving the selected colleague
  const filteredMessages = chatMessages.filter(msg => {
    if (msg.sender === 'Nebulabs Onboarding') return true; // Global system greeting
    if (msg.isBot) return msg.sender === selectedColleague.name; // Messages FROM selected colleague
    return msg.recipient === selectedColleague.name; // Messages TO selected colleague
  });

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
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <MessageCircle className="text-accent" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Nebula Teams</h2>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Internal Communication</p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Colleague Select */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {COLLEAGUES.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedColleague(c)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all shrink-0 min-w-[100px]",
                selectedColleague.name === c.name 
                  ? "bg-accent/20 border-accent/40 text-accent" 
                  : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
              )}
            >
              <div className="relative">
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
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
        {!isWorkAccount ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-20 h-20 rounded-[2rem] bg-destructive/10 border border-destructive/20 flex items-center justify-center shadow-2xl animate-pulse">
              <Lock className="text-destructive" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-tighter">Security Clearance Required</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                Nebula Teams is a restricted corporate service. Please enable your <strong>Nebulabs Work Account</strong> in System Settings to establish a secure link.
              </p>
            </div>
            <Button 
              className="bg-accent text-primary-foreground font-black px-8 rounded-xl h-12 gap-2"
              onClick={() => {
                openApp('settings', 'Settings');
                setIsChatOpen(false);
              }}
            >
              Update Credentials
            </Button>
          </div>
        ) : (
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
                      <AvatarFallback className="bg-accent/20 text-accent font-bold text-[10px]">ME</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={msg.sender === 'Nebulabs Onboarding' ? '' : selectedColleague.avatar} />
                      <AvatarFallback className="bg-white/5 text-white font-bold text-[10px]">{msg.sender[0]}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={cn("flex flex-col gap-1 max-w-[80%]", !msg.isBot ? "items-end" : "")}>
                  <div className={cn(
                    "p-3 rounded-2xl text-xs leading-relaxed",
                    !msg.isBot 
                      ? "bg-accent text-primary-foreground font-medium rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/20 font-mono">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-black/10">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isWorkAccount}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isWorkAccount ? `Message ${selectedColleague.name.split(' ')[0]}...` : "Input locked..."}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 resize-none h-20 disabled:opacity-50"
          />
          <Button 
            size="icon" 
            className="absolute right-2 bottom-2 bg-accent text-primary-foreground hover:bg-accent/80 h-8 w-8 rounded-xl disabled:opacity-50"
            onClick={handleSend}
            disabled={!isWorkAccount}
          >
            <Send size={14} />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3 opacity-20 justify-center">
          <ShieldCheck size={10} className="text-accent" />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">Encrypted Workspace Bridge</span>
        </div>
      </div>
    </div>
  );
};
