"use client"

import React, { useState } from 'react';
import { suggestGoogleProduct, SuggestGoogleProductOutput } from '@/ai/flows/ai-assistant-google-product-suggestion';
import { Send, Bot, User, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOS, AppId } from '@/context/os-context';
import { cn } from '@/lib/utils';

export const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string; suggestions?: SuggestGoogleProductOutput['suggestions'] }[]>([
    { type: 'bot', text: "Hello! I'm your Nebula AI Assistant. How can I help you navigate Nebulabs WebOS today? Tell me what you're looking to do, and I can suggest the right tools." }
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
        text: response.explanation || "Based on your needs, here are some applications that might help:",
        suggestions: response.suggestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchApp = (name: string) => {
    const appMap: Record<string, { id: AppId; title: string }> = {
      'Google Drive': { id: 'google-drive', title: 'Google Drive' },
      'Notes': { id: 'notes', title: 'Nebula Notes' },
      'Calculator': { id: 'calc', title: 'Calculator' },
      'Terminal': { id: 'terminal', title: 'Terminal' },
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
          <h2 className="text-sm font-bold">Nebula AI Assistant</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-white/40 font-medium">Powered by Gemini</span>
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
              <div className="flex flex-col gap-3 max-w-[80%]">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.type === 'user' ? "bg-accent text-primary font-medium" : "bg-white/5 border border-white/10 text-white/80"
                )}>
                  {msg.text}
                </div>
                
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="grid gap-3">
                    {msg.suggestions.map((s, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-accent text-xs">{s.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-accent/20 text-accent"
                            onClick={() => handleLaunchApp(s.name)}
                          >
                            <ExternalLink size={12} />
                          </Button>
                        </div>
                        <p className="text-[11px] text-white/60">{s.description}</p>
                        <div className="flex items-start gap-2 pt-2 mt-1 border-t border-white/5">
                          <Sparkles size={10} className="text-accent shrink-0 mt-0.5" />
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
              <div className="h-10 w-32 bg-white/5 rounded-2xl" />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-black/10">
        <div className="max-w-2xl mx-auto relative">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or describe what you need..."
            className="pr-12 bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-accent"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="absolute right-1 top-1 bottom-1 bg-accent text-primary hover:bg-accent/80 rounded-lg h-auto aspect-square"
            onClick={handleSend}
            disabled={isLoading}
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-[9px] text-white/20 text-center mt-2">Nebula AI can make mistakes. Verify important info.</p>
      </div>
    </div>
  );
};
