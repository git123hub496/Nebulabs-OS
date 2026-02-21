
"use client"

import React, { useState } from 'react';
import { suggestGoogleProduct, SuggestGoogleProductOutput } from '@/ai/flows/ai-assistant-google-product-suggestion';
import { Send, Bot, User, Sparkles, ExternalLink, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOS, AppId } from '@/context/os-context';
import { cn } from '@/lib/utils';

export const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; suggestions?: SuggestGoogleProductOutput['suggestions'] }[]>([
    { type: 'bot', text: "Hello! I'm your Nebula AI Assistant. I can help you with anything from navigating this OS to answering complex questions or generating ideas. How can I assist you today?" }
  ]);
  const { openApp } = useOS();

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userText = query;
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await suggestGoogleProduct({ query: userText });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: response.answer,
        suggestions: response.suggestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "I'm sorry, I encountered an error connecting to the Nebula AI core. Please check your network and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchApp = (name: string) => {
    const appMap: Record<string, { id: AppId; title: string }> = {
      'Browser': { id: 'browser', title: 'Nebula Browser' },
      'Google Drive': { id: 'google-drive', title: 'Google Drive' },
      'Notes': { id: 'notes', title: 'Nebula Notes' },
      'Calculator': { id: 'calc', title: 'Calculator' },
      'Terminal': { id: 'terminal', title: 'Terminal' },
      'Maps': { id: 'maps', title: 'Nebula Maps' },
      'Paint': { id: 'paint', title: 'Nebula Paint' },
      'Camera': { id: 'camera', title: 'Nebula Camera' },
      'Slides': { id: 'slides', title: 'Nebula Slides' },
      'Monitor': { id: 'monitor', title: 'System Monitor' },
    };
    
    const matched = Object.entries(appMap).find(([key]) => name.toLowerCase().includes(key.toLowerCase()));
    if (matched) {
      openApp(matched[1].id, matched[1].title);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <Bot className="text-accent" size={24} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Nebula AI Assistant</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-white/40 font-medium">Core v2.0 • Ultra-Threaded</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.type === 'user' ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.type === 'user' ? "bg-accent/20" : "bg-white/5 border border-white/10"
              )}>
                {msg.type === 'user' ? <User size={16} className="text-accent" /> : <Bot size={16} className="text-white/60" />}
              </div>
              <div className="flex flex-col gap-3 max-w-[85%]">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                  msg.type === 'user' ? "bg-accent text-primary-foreground font-medium shadow-lg shadow-accent/10" : "bg-white/5 border border-white/10 text-white/90"
                )}>
                  {msg.text}
                </div>
                
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="grid gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 pl-1">
                      <Sparkles size={12} className="text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Recommended Tools</span>
                    </div>
                    {msg.suggestions.map((s, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors group/card">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-accent text-xs group-hover/card:text-white transition-colors">{s.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-accent text-accent hover:text-primary-foreground rounded-lg"
                            onClick={() => handleLaunchApp(s.name)}
                          >
                            <ExternalLink size={12} />
                          </Button>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">{s.description}</p>
                        <div className="flex items-start gap-2 pt-2 mt-1 border-t border-white/5">
                          <MessageSquareText size={10} className="text-accent/40 shrink-0 mt-0.5" />
                          <p className="text-[10px] italic text-white/40">{s.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
              <div className="space-y-2">
                <div className="h-10 w-48 bg-white/5 rounded-2xl" />
                <div className="h-4 w-32 bg-white/5 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-black/10">
        <div className="max-w-2xl mx-auto relative">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything, solve problems, or explore tools..."
            className="pr-12 bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-accent text-white placeholder:text-white/20"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-accent text-primary-foreground hover:bg-accent/80 rounded-lg h-auto aspect-square transition-transform active:scale-90"
            onClick={handleSend}
            disabled={isLoading}
          >
            <Send size={18} />
          </Button>
        </div>
        <div className="flex justify-center gap-4 mt-3 opacity-20 hover:opacity-40 transition-opacity">
           <span className="text-[8px] font-bold uppercase tracking-widest text-white">Quantum Chat Active</span>
           <span className="text-[8px] font-bold uppercase tracking-widest text-white">•</span>
           <span className="text-[8px] font-bold uppercase tracking-widest text-white">OS Intelligence Integrated</span>
        </div>
      </div>
    </div>
  );
};
