
"use client"

import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCcw, Home, ExternalLink, ShieldCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const NebulaBrowser: React.FC = () => {
  const [url, setUrl] = useState("https://www.wikipedia.org");
  const [inputUrl, setInputUrl] = useState("https://www.wikipedia.org");

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = inputUrl;
    
    // Simple logic to handle search vs URL
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
      <div className="p-2 border-b border-white/5 bg-black/20 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40"><ArrowLeft size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40"><ArrowRight size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40" onClick={() => setUrl(url + " ")}><RotateCcw size={16} /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40" onClick={goHome}><Home size={16} /></Button>
        </div>
        
        <form onSubmit={handleNavigate} className="flex-1 relative">
          <Input 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="h-8 bg-black/40 border-white/10 text-xs pl-8 pr-4 focus-visible:ring-accent text-white/80"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
        </form>

        <Button variant="outline" size="sm" className="h-8 text-[10px] gap-2 border-white/10 text-white/60" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={12} />
            New Tab
          </a>
        </Button>
      </div>

      {/* Warning bar for iframe limitations */}
      <div className="bg-accent/10 border-b border-accent/20 px-4 py-1.5 flex items-center gap-2 shrink-0">
        <ShieldCheck size={12} className="text-accent" />
        <span className="text-[10px] text-accent/80 font-medium">Safe Browsing: Some sites may restrict embedding for privacy.</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        <iframe 
          src={url}
          className="w-full h-full border-none bg-white"
          title="Nebula Browser Viewport"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};
