
"use client"

import React, { useState } from 'react';
import { Store, ExternalLink, ShieldCheck, Loader2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ShopNebulabs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const shopUrl = "https://sites.google.com/view/nebulabsoffical/shop-nebulabs";

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] overflow-hidden">
      {/* App Toolbar */}
      <div className="h-12 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between shrink-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-white">Shop Nebulabs</h2>
            <p className="text-[9px] text-white/40 font-bold uppercase">Official Hardware Outlet</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 text-white/40 hover:text-white" asChild>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={12} />
              Open in Browser
            </a>
          </Button>
        </div>
      </div>

      {/* Embedded Store Front */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f14] text-white/40 gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs font-black tracking-widest uppercase text-white/60">Connecting to Nebula Retail Node...</span>
              <p className="text-[9px] font-bold uppercase text-white/20">Establishing Secure Transaction Bridge</p>
            </div>
          </div>
        )}
        
        <iframe 
          src={shopUrl}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          title="Shop Nebulabs"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        
        {/* Verification Overlay */}
        {!isLoading && (
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xl">
              <ShieldCheck size={12} className="text-accent" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified Official Node</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-10 bg-black/40 border-t border-white/5 flex items-center px-4 justify-between shrink-0 text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span>Region: Global</span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span>Status: Operational</span>
        </div>
        <span>© 2026 Nebulabs Corp</span>
      </div>
    </div>
  );
};
