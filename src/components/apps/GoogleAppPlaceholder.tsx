
"use client"

import React from 'react';
import { FileText, Table, Presentation, Cloud, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GoogleAppPlaceholderProps {
  type: 'docs' | 'sheets' | 'slides' | 'drive';
}

export const GoogleAppPlaceholder: React.FC<GoogleAppPlaceholderProps> = ({ type }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const configs = {
    docs: { 
      icon: FileText, 
      color: "bg-blue-600", 
      label: "Google Docs", 
      url: "https://docs.google.com/document/u/0/?authuser=0"
    },
    sheets: { 
      icon: Table, 
      color: "bg-green-600", 
      label: "Google Sheets", 
      url: "https://docs.google.com/spreadsheets/u/0/?authuser=0"
    },
    slides: { 
      icon: Presentation, 
      color: "bg-yellow-600", 
      label: "Google Slides", 
      url: "https://docs.google.com/presentation/u/0/?authuser=0"
    },
    drive: { 
      icon: Cloud, 
      color: "bg-blue-500", 
      label: "Google Drive", 
      url: "https://drive.google.com/drive/u/0/my-drive"
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col h-full bg-[#161d25]">
      {/* App Toolbar */}
      <div className="h-10 border-b border-white/5 bg-black/20 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn("w-5 h-5 rounded flex items-center justify-center", config.color)}>
            <Icon size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-white/80">{config.label}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-2" asChild>
          <a href={config.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={10} />
            External View
          </a>
        </Button>
      </div>

      {/* Embedded View */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#161d25] text-white/40 gap-3 z-10">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-xs font-medium tracking-widest uppercase">Connecting to Google Cloud...</span>
          </div>
        )}
        <iframe 
          src={config.url}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          title={config.label}
        />
        
        {/* Overlay for "Blocked by Google" cases (common for standard URLs in iframes) */}
        {!isLoading && (
          <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
            <div className="bg-[#1e2731] p-6 rounded-2xl border border-white/10 text-center max-w-xs pointer-events-auto">
              <h4 className="font-bold text-white mb-2">Security Notice</h4>
              <p className="text-xs text-white/60 mb-4">Google may restrict direct embedding for some users. Use the External View button if the content doesn't load.</p>
              <Button size="sm" className="bg-accent text-primary font-bold w-full" asChild>
                <a href={config.url} target="_blank" rel="noopener noreferrer">Launch Externally</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
