"use client"

import React from 'react';
import { useOS, AppId } from '@/context/os-context';
import { 
  Search, 
  Settings, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  FolderOpen,
  Cloud,
  Info,
  Calculator as CalcIcon,
  Terminal as TermIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface StartMenuProps {
  onClose: () => void;
}

const APP_INFO: Record<AppId, { icon: any; label: string }> = {
  'store': { icon: ShoppingBag, label: 'App Store' },
  'files': { icon: FolderOpen, label: 'File Explorer' },
  'settings': { icon: Settings, label: 'Settings' },
  'assistant': { icon: MessageSquare, label: 'Nebula Assistant' },
  'google-drive': { icon: Cloud, label: 'Google Drive' },
  'notes': { icon: FileText, label: 'Nebula Notes' },
  'calc': { icon: CalcIcon, label: 'Calculator' },
  'terminal': { icon: TermIcon, label: 'Terminal' }
};

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { installedApps, openApp } = useOS();

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId].label);
    onClose();
  };

  return (
    <div className="absolute bottom-14 left-0 w-96 h-[560px] glass rounded-xl border window-shadow p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <Input 
          placeholder="Search apps, settings, and files" 
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-wider mb-4 opacity-80">Pinned Apps</h3>
          <div className="grid grid-cols-4 gap-4">
            {installedApps.map(appId => {
              const info = APP_INFO[appId];
              if (!info) return null;
              const Icon = info.icon;
              return (
                <button
                  key={appId}
                  onClick={() => handleAppClick(appId)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all">
                    <Icon className="text-white/80 group-hover:text-accent transition-colors" size={24} />
                  </div>
                  <span className="text-[10px] text-white/70 font-medium text-center truncate w-full">{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-wider mb-4 opacity-80">Quick Links</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <FolderOpen size={16} className="text-accent" />
              <span>Personal Documents</span>
            </button>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <ShoppingBag size={16} className="text-accent" />
              <span>Nebula Cloud Store</span>
            </button>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <Info size={16} className="text-accent" />
              <span>About Nebulabs OS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="w-9 h-9 border border-accent/20">
            <AvatarFallback className="bg-accent text-primary font-bold">G</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-white/90 truncate">Guest User</span>
            <span className="text-[10px] text-white/40 truncate">Nebula Cloud Sync Active</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};
