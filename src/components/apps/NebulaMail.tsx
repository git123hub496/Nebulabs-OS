
"use client"

import React, { useState } from 'react';
import { Mail, Send, Inbox, Trash2, Star, Archive, ShieldCheck, User, Reply, Forward, MoreVertical, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useOS, Email } from '@/context/os-context';
import { cn } from '@/lib/utils';

export const NebulaMail: React.FC = () => {
  const { emails, markEmailRead, currentUser } = useOS();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emails[0]?.id || null);
  const [search, setSearch] = useState("");

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleSelect = (id: string) => {
    setSelectedEmailId(id);
    markEmailRead(id);
  };

  const filteredEmails = emails.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) || 
    e.from.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#161d25] overflow-hidden">
      {/* Sidebar Nav */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <Button className="w-full bg-accent text-primary-foreground font-bold rounded-xl gap-2 shadow-lg shadow-accent/10">
            <Plus size={16} /> Compose
          </Button>
        </div>
        <div className="p-4 space-y-1">
          <button className="w-full flex items-center justify-between px-4 h-10 rounded-lg bg-accent/10 text-accent font-bold text-xs">
            <div className="flex items-center gap-3">
              <Inbox size={14} /> Inbox
            </div>
            <span className="text-[10px]">{emails.filter(e => !e.isRead).length}</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-white/40 hover:bg-white/5 text-xs transition-colors">
            <Send size={14} /> Sent
          </button>
          <button className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-white/40 hover:bg-white/5 text-xs transition-colors">
            <Star size={14} /> Starred
          </button>
          <button className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-white/40 hover:bg-white/5 text-xs transition-colors">
            <Archive size={14} /> Archive
          </button>
          <button className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-white/40 hover:bg-white/5 text-xs transition-colors">
            <Trash2 size={14} /> Trash
          </button>
        </div>
        
        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-accent/5 rounded-xl p-4 border border-accent/10 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[9px] font-black uppercase text-accent">Nebula Secured</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">Workspace endpoint is encrypted with quantum-grade signatures.</p>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-black/10 shrink-0">
        <div className="p-4 border-b border-white/5 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mail..." 
            className="h-9 pl-9 bg-white/5 border-white/10 text-xs rounded-xl"
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-white/5">
            {filteredEmails.map(email => (
              <button 
                key={email.id}
                onClick={() => handleSelect(email.id)}
                className={cn(
                  "w-full p-4 text-left transition-all hover:bg-white/5 relative group",
                  selectedEmailId === email.id ? "bg-accent/5" : "",
                  !email.isRead && "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-accent"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-[10px] font-bold truncate max-w-[120px]", email.isRead ? "text-white/40" : "text-white")}>
                    {email.from}
                  </span>
                  <span className="text-[9px] text-white/20 font-mono">{email.timestamp}</span>
                </div>
                <h4 className={cn("text-xs truncate mb-1", !email.isRead ? "font-bold text-accent" : "font-medium text-white/60")}>
                  {email.subject}
                </h4>
                <p className="text-[10px] text-white/30 line-clamp-1 leading-relaxed">{email.content}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email View */}
      <div className="flex-1 flex flex-col bg-black/5">
        {selectedEmail ? (
          <>
            <div className="h-14 border-b border-white/5 bg-black/20 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent"><Archive size={16} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent"><Trash2 size={16} /></Button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent"><Reply size={16} /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent"><Forward size={16} /></Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent"><MoreVertical size={16} /></Button>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                  <h1 className="text-2xl font-black text-white leading-tight tracking-tight">{selectedEmail.subject}</h1>
                  <div className="flex items-center justify-between py-4 border-y border-white/5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarFallback className="bg-accent/20 text-accent font-bold">
                          {selectedEmail.from[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{selectedEmail.from}</span>
                          {selectedEmail.isSystem && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent text-[8px] font-black uppercase tracking-tighter h-4">Verified System</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-white/30">To: {currentUser?.username || 'user'}@nebula.os</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono">{selectedEmail.timestamp}</span>
                  </div>
                </div>

                <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedEmail.content}
                </div>

                <div className="pt-12 border-t border-white/5">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                        <Reply size={20} />
                      </div>
                      <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Click here to reply...</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-white/40">Quick Reply</Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4 opacity-40">
            <Mail size={64} strokeWidth={1} />
            <p className="text-sm font-bold uppercase tracking-widest">Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
};
