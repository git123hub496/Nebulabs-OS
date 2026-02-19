"use client"

import React from 'react';
import { FileText, Table, Presentation, Cloud, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleAppPlaceholderProps {
  type: 'docs' | 'sheets' | 'slides' | 'drive';
}

export const GoogleAppPlaceholder: React.FC<GoogleAppPlaceholderProps> = ({ type }) => {
  const configs = {
    docs: { icon: FileText, color: "bg-blue-600", label: "Google Docs", desc: "Start writing with Nebulabs integration." },
    sheets: { icon: Table, color: "bg-green-600", label: "Google Sheets", desc: "Analyze data seamlessly in the cloud." },
    slides: { icon: Presentation, color: "bg-yellow-600", label: "Google Slides", desc: "Design presentations from your desktop." },
    drive: { icon: Cloud, color: "bg-blue-500", label: "Google Drive", desc: "Sync all your virtual files to the cloud." },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#161d25]">
      <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-2xl", config.color)}>
        <Icon size={48} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{config.label}</h1>
      <p className="text-white/40 max-w-sm mb-8">{config.desc}</p>
      
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
        <div className="text-left space-y-2">
          <h3 className="text-sm font-bold text-accent">Nebula Integration Active</h3>
          <p className="text-xs text-white/60">Your virtual account is automatically synced. You can access these files from the File Explorer.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button className="w-full bg-accent text-primary hover:bg-accent/80 font-bold">
            Open in Web Browser
            <ExternalLink size={14} className="ml-2" />
          </Button>
          <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
            Configure Workspace
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-[10px] text-white/20 uppercase tracking-widest font-bold">
        Nebulabs Cloud Connect Protocol v4.2
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';