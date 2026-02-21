"use client"

import React, { useState } from 'react';
import { Mail, Send, Inbox, Trash2, Star, Archive, ShieldCheck, User, Reply, Forward, MoreVertical, Search, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useOS, Email } from '@/context/os-context';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

type MailFolder = 'inbox' | 'sent' | 'starred' | 'archive' | 'trash';

export const NebulaMail: React.FC = () => {
  const { emails, markEmailRead, currentUser, sendEmail } = useOS();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(emails[0]?.id || null);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleSelect = (id: string) => {
    setSelectedEmailId(id);
    markEmailRead(id);
  };

  const handleSend = async () => {
    if (!composeTo || !composeSubject || !composeBody) return;
    setIsSending(true);
    await sendEmail(composeTo, composeSubject, composeBody);
    setIsSending(false);
    setIsComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
  };

  const folderEmails = emails.filter(e => {
    if (activeFolder === 'starred') return false; // Mock starred logic
    return e.folder === activeFolder;
  });

  const filteredEmails = folderEmails.filter(e => 
    e.subject.toLowerCase().includes(search.toLowerCase()) || 
    e.from.toLowerCase().includes(search.toLowerCase()) ||
    e.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#161d25] overflow-hidden relative">
      {/* Sidebar Nav */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <Button 
            className="w-full bg-accent text-primary-foreground font-bold rounded-xl gap-2 shadow-lg shadow-accent/10"
            onClick={() => setIsComposeOpen(true)}
          >
            <Plus size={16} /> Compose
          </Button>
        </div>
        <div className="p-4 space-y-1">
          <button 
            onClick={() => setActiveFolder('inbox')}
            className={cn(
              "w-full flex items-center justify-between px-4 h-10 rounded-lg text-xs transition-all",
              activeFolder === 'inbox' ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <Inbox size={14} /> Inbox
            </div>
            <span className="text-[10px]">{emails.filter(e => e.folder === 'inbox' && !e.isRead).length}</span>
          </button>
          <button 
            onClick={() => setActiveFolder('sent')}
            className={cn(
              "w-full flex items-center gap-3 px-4 h-10 rounded-lg text-xs transition-all",
              activeFolder === 'sent' ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
            <Send size={14} /> Sent
          </button>
          <button 
            onClick={() => setActiveFolder('starred')}
            className={cn(
              "w-full flex items-center gap-3 px-4 h-10 rounded-lg text-xs transition-all",
              activeFolder === 'starred' ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
            <Star size={14} /> Starred
          </button>
          <button 
            onClick={() => setActiveFolder('archive')}
            className={cn(
              "w-full flex items-center gap-3 px-4 h-10 rounded-lg text-xs transition-all",
              activeFolder === 'archive' ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
            <Archive size={14} /> Archive
          </button>
          <button 
            onClick={() => setActiveFolder('trash')}
            className={cn(
              "w-full flex items-center gap-3 px-4 h-10 rounded-lg text-xs transition-all",
              activeFolder === 'trash' ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:bg-white/5"
            )}
          >
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
            placeholder={`Search ${activeFolder}...`} 
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
                  !email.isRead && email.folder === 'inbox' && "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-accent"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-[10px] font-bold truncate max-w-[120px]", email.isRead ? "text-white/40" : "text-white")}>
                    {activeFolder === 'sent' ? `To: ${email.to}` : email.from}
                  </span>
                  <span className="text-[9px] text-white/20 font-mono">{email.timestamp}</span>
                </div>
                <h4 className={cn("text-xs truncate mb-1", !email.isRead && email.folder === 'inbox' ? "font-bold text-accent" : "font-medium text-white/60")}>
                  {email.subject}
                </h4>
                <p className="text-[10px] text-white/30 line-clamp-1 leading-relaxed">{email.content}</p>
              </button>
            ))}
            {filteredEmails.length === 0 && (
              <div className="p-8 text-center opacity-20">
                <p className="text-xs font-bold uppercase tracking-widest">No messages</p>
              </div>
            )}
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
                          {(selectedEmail.folder === 'sent' ? selectedEmail.to : selectedEmail.from)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {selectedEmail.folder === 'sent' ? `To: ${selectedEmail.to}` : selectedEmail.from}
                          </span>
                          {selectedEmail.isSystem && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent text-[8px] font-black uppercase tracking-tighter h-4">Verified System</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-white/30">
                          {selectedEmail.folder === 'sent' ? `From: ${selectedEmail.from}@nebula.os` : `To: ${currentUser?.username || 'user'}@nebula.os`}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-white/20 font-mono">{selectedEmail.timestamp}</span>
                  </div>
                </div>

                <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedEmail.content}
                </div>

                {selectedEmail.folder === 'inbox' && (
                  <div className="pt-12 border-t border-white/5">
                    <div 
                      onClick={() => {
                        setComposeTo(selectedEmail.from);
                        setComposeSubject(`Re: ${selectedEmail.subject}`);
                        setIsComposeOpen(true);
                      }}
                      className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-accent/40 transition-colors"
                    >
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
                )}
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

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#1e2731] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="h-14 border-b border-white/5 bg-black/20 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Plus size={16} className="text-accent" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">New Message</h3>
              </div>
              <button onClick={() => setIsComposeOpen(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black uppercase text-accent w-12 tracking-widest">To</span>
                  <input 
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="Recipient name"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/10"
                  />
                </div>
                <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black uppercase text-accent w-12 tracking-widest">Subject</span>
                  <input 
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Message subject"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/10 font-bold"
                  />
                </div>
              </div>

              <Textarea 
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[250px] bg-white/5 border-white/5 text-white/80 rounded-2xl p-6 focus-visible:ring-accent resize-none text-sm leading-relaxed"
              />

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                  <ShieldCheck size={12} className="text-accent" />
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Quantum Encryption Enabled</span>
                </div>
                <Button 
                  onClick={handleSend}
                  disabled={isSending || !composeTo || !composeBody}
                  className="bg-accent text-primary-foreground font-black px-10 h-12 rounded-xl gap-2 shadow-lg shadow-accent/20 transition-transform active:scale-95"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
