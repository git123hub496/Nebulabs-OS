"use client"

import React from 'react';
import { useOS, AppId } from '@/context/os-context';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { 
  ShoppingBag, 
  FolderOpen, 
  Settings as SettingsIcon, 
  MessageSquare,
  FileText,
  Table,
  Presentation,
  Cloud
} from 'lucide-react';
import { FileExplorer } from '../apps/FileExplorer';
import { AppStore } from '../apps/AppStore';
import { Settings } from '../apps/Settings';
import { AIAssistant } from '../apps/AIAssistant';
import { GoogleAppPlaceholder } from '../apps/GoogleAppPlaceholder';

const APP_COMPONENTS: Record<AppId, React.ReactNode> = {
  'store': <AppStore />,
  'files': <FileExplorer />,
  'settings': <Settings />,
  'assistant': <AIAssistant />,
  'google-docs': <GoogleAppPlaceholder type="docs" />,
  'google-sheets': <GoogleAppPlaceholder type="sheets" />,
  'google-slides': <GoogleAppPlaceholder type="slides" />,
  'google-drive': <GoogleAppPlaceholder type="drive" />,
};

const DESKTOP_SHORTCUTS: { id: AppId; label: string; icon: any }[] = [
  { id: 'files', label: 'File Explorer', icon: FolderOpen },
  { id: 'store', label: 'App Store', icon: ShoppingBag },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Desktop: React.FC = () => {
  const { wallpaper, openWindows, openApp } = useOS();

  return (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 flex flex-col flex-wrap gap-4 content-start">
        {DESKTOP_SHORTCUTS.map(shortcut => {
          const Icon = shortcut.icon;
          return (
            <div 
              key={shortcut.id}
              className="desktop-icon group"
              onDoubleClick={() => openApp(shortcut.id, shortcut.label)}
            >
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1 shadow-lg border-white/20">
                <Icon size={28} className="text-accent" />
              </div>
              <span className="text-white text-[11px] font-medium drop-shadow-md text-center line-clamp-2 px-1">
                {shortcut.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Windows Layer */}
      {openWindows.map(window => (
        <Window key={window.id} window={window}>
          {APP_COMPONENTS[window.appId]}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar />

      {/* Boot overlay simulation */}
      <div className="fixed inset-0 bg-background z-[10000] flex flex-col items-center justify-center animate-out fade-out duration-1000 pointer-events-none delay-500">
        <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
          <div className="w-12 h-12 bg-accent rounded-full" />
        </div>
        <h1 className="text-2xl font-bold tracking-widest text-white/40 uppercase">Nebulabs WebOS</h1>
        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent animate-[loading_2s_ease-in-out_infinite]" />
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes loading {
          0% { width: 0; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};