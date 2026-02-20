
"use client"

import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Home, ExternalLink, ShieldCheck, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const NebulaBrowser: React.FC = () => {
  const [url, setUrl] = useState("https://www.wikipedia.org");
  const [inputUrl, setInputUrl] = useState("https://www.wikipedia.org");
  const [showHint, setShowHint] = useState(true);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = inputUrl;
    
    if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }
    } else {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
    }
    
    setUrl(targetUrl);
    setInputUrl(targetUrl);
  };

  const goHome = () => {
    setUrl("https://www.wikipedia.org");
    setInputUrl("https://www.wikipedia.org");
  };

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      {/* Browser Toolbar */}
      <div className="p-2 border-b border-white/5 bg-black/40 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent hover:bg-accent/10"><ArrowLeft size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent hover:bg-accent/10"><ArrowRight size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent hover:bg-accent/10" onClick={() => setUrl(prev => prev + " ")}><RotateCcw size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent hover:bg-accent/10" onClick={goHome}><Home size={16} /></Button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 relative">
          <Input 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="h-8 bg-black/40 border-white/10 text-xs pl-8 pr-4 focus-visible:ring-accent text-white/80 rounded-lg"
            placeholder="Search or enter address"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
        </form>

        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-[10px] gap-2 border-white/10 text-white/60 hover:bg-accent hover:text-primary transition-all font-bold"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={12} />
            External Tab
          </a>
        </Button>
      </div>

      {/* Dynamic Compatibility Banner */}
      {showHint && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-accent" />
            <span className="text-[10px] text-accent/90 font-medium">
              Sites like Google/YouTube block embedding. Use "External Tab" if a page stays blank.
            </span>
          </div>
          <button onClick={() => setShowHint(false)} className="text-accent/40 hover:text-accent transition-colors">
            <Globe size={12} />
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url}
          className="w-full h-full border-none bg-white"
          title="Nebula Browser Viewport"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
        
        {/* Visual feedback overlay */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-20 flex items-center gap-2">
          <ShieldCheck size={14} className="text-black" />
          <span className="text-[10px] font-bold text-black uppercase tracking-widest">Isolated View</span>
        </div>
      </div>
    </div>
  );
};
