
"use client"

import React, { useState, useEffect } from 'react';
import { Newspaper, MapPin, Search, RefreshCw, TrendingUp, Loader2, Bookmark, Share2, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';

interface Article {
  id: string;
  title: string;
  category: string;
  source: string;
  time: string;
  image: string;
  summary: string;
  isVIPFake?: boolean;
}

const MOCK_NEWS: Article[] = [
  {
    id: '1',
    title: "Nebulabs Unveils Next-Gen Quantum Browser Interface",
    category: "Technology",
    source: "Nebula Tech Weekly",
    time: "2h ago",
    image: "https://picsum.photos/seed/tech/600/400",
    summary: "The new interface promises 40% faster navigation and deep AI integration across all virtual workspaces."
  },
  {
    id: '2',
    title: "Global Markets Stabilize After Digital Currency Regulation News",
    category: "Business",
    source: "Financial Orbit",
    time: "4h ago",
    image: "https://picsum.photos/seed/finance/600/400",
    summary: "Investors react positively to new framework aimed at securing digital asset transactions."
  },
  {
    id: '3',
    title: "Breakthrough in Sustainable Solar Energy Storage",
    category: "Science",
    source: "Eco Pulse",
    time: "6h ago",
    image: "https://picsum.photos/seed/science/600/400",
    summary: "New graphene-based batteries could store solar power for weeks with minimal energy loss."
  },
  {
    id: '4',
    title: "SpaceX Nebula Mission Prepares for Mars Orbit Insertion",
    category: "Science",
    source: "Cosmos Today",
    time: "12h ago",
    image: "https://picsum.photos/seed/space/600/400",
    summary: "The highly anticipated mission is set to deliver critical infrastructure for future colonies."
  },
];

const VIP_FAKE_NEWS: Article[] = [
  {
    id: 'vip-1',
    title: "BREAKING: VIP Mode Discovered to Boost IQ by 400%",
    category: "Exclusive",
    source: "VIP Confidential",
    time: "1m ago",
    image: "https://picsum.photos/seed/gold/600/400",
    summary: "Leading neuro-kernel researchers confirm that users named Donald Trump experience unprecedented cognitive processing speeds when using Nebulabs OS.",
    isVIPFake: true
  },
  {
    id: 'vip-2',
    title: "Mainstream Media SILENT About This Secret BIOS Option",
    category: "Hidden",
    source: "The Real Intel",
    time: "5m ago",
    image: "https://picsum.photos/seed/midas/600/400",
    summary: "Rumors swirl about a 'Midas Touch' setting that turns the entire kernel into 24-carat digital gold. The establishment wants it banned!",
    isVIPFake: true
  },
  {
    id: 'vip-3',
    title: "TRUTH: All Other Operating Systems are 'Total Disasters'",
    category: "Editorial",
    source: "Global Patriot",
    time: "10m ago",
    image: "https://picsum.photos/seed/failure/600/400",
    summary: "A new independent audit confirms what we already knew: standard OS users are being treated very unfairly. Nebulabs is the only choice for Winners.",
    isVIPFake: true
  }
];

export const NebulaNews: React.FC = () => {
  const { userLocation, locationName, requestLocation, currentUser } = useOS();
  const [isRequesting, setIsRequesting] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleRequestLocation = async () => {
    setIsRequesting(true);
    await requestLocation();
    setIsRequesting(false);
    refreshNews();
  };

  const refreshNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      let combinedNews = [...MOCK_NEWS];
      if (currentUser?.isVIP) {
        combinedNews = [...VIP_FAKE_NEWS, ...combinedNews];
      }
      setArticles(combinedNews);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshNews();
  }, [currentUser?.isVIP]);

  if (!userLocation) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 bg-[#161d25] text-center gap-6">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center animate-pulse border border-accent/20">
          <MapPin size={40} className="text-accent" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-bold text-white tracking-tight">Personalized Headlines</h2>
          <p className="text-sm text-white/40 leading-relaxed font-medium">Enable location services to receive accurate local news, weather alerts, and sector-specific telemetry.</p>
        </div>
        <button 
          onClick={handleRequestLocation} 
          disabled={isRequesting}
          className="bg-accent text-primary font-black px-10 h-12 rounded-xl hover:scale-105 transition-transform uppercase tracking-widest shadow-lg shadow-accent/20"
        >
          {isRequesting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Authorizing Sensors...
            </div>
          ) : (
            "Authorize Geolocation"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      {/* Top Header */}
      <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Newspaper className="text-accent" size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Nebula News</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
            <MapPin size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase">{locationName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search index..." 
              className="h-8 w-48 bg-white/5 border-white/10 text-xs pl-8 rounded-lg focus-visible:ring-accent" 
            />
          </div>
          <button onClick={refreshNews} className="p-2 text-white/40 hover:text-accent transition-colors">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Article Grid */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                Live Pulse
                <Badge variant="secondary" className="bg-accent/20 text-accent text-[10px] uppercase font-black tracking-widest border-none">Active</Badge>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              {articles.map((article) => (
                <div key={article.id} className={cn(
                  "group bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/40 transition-all shadow-2xl",
                  article.isVIPFake && "border-yellow-500/30 bg-yellow-500/5"
                )}>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className={cn(
                        "bg-black/60 backdrop-blur-md border-white/10 text-[9px] uppercase font-bold text-white",
                        article.isVIPFake && "bg-yellow-500 text-black border-yellow-600"
                      )}>
                        {article.category}
                      </Badge>
                      {article.isVIPFake && (
                        <Badge className="bg-red-500 text-white text-[9px] uppercase font-bold border-none flex gap-1">
                          <ShieldCheck size={10} /> Verified Truth
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-bold text-accent", article.isVIPFake && "text-yellow-500")}>{article.source}</span>
                      <span className="text-[10px] text-white/30">{article.time}</span>
                    </div>
                    <h3 className={cn("font-bold text-sm leading-snug group-hover:text-accent transition-colors text-white/90", article.isVIPFake && "text-yellow-100 group-hover:text-yellow-400")}>
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed font-medium">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/20 hover:text-accent">
                          <Bookmark size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/20 hover:text-accent">
                          <Share2 size={12} />
                        </Button>
                      </div>
                      <Button variant="link" className={cn("text-accent text-[10px] font-black uppercase tracking-widest h-auto p-0 hover:no-underline", article.isVIPFake && "text-yellow-500")}>
                        Read Data
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
