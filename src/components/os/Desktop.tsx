
"use client"

import React, { useState, useEffect } from 'react';
import { useOS, AppId } from '@/context/os-context';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { 
  ShoppingBag, 
  FolderOpen, 
  Settings as SettingsIcon, 
  MessageSquare,
  FileText,
  Calculator as CalcIcon,
  Terminal as TermIcon,
  Globe,
  Power,
} from 'lucide-react';
import { FileExplorer } from '../apps/FileExplorer';
import { AppStore } from '../apps/AppStore';
import { Settings } from '../apps/Settings';
import { AIAssistant } from '../apps/AIAssistant';
import { GoogleAppPlaceholder } from '../apps/GoogleAppPlaceholder';
import { Notes } from '../apps/Notes';
import { Calculator } from '../apps/Calculator';
import { Terminal } from '../apps/Terminal';
import { NebulaBrowser } from '../apps/NebulaBrowser';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const APP_COMPONENTS: Record<AppId, React.ReactNode> = {
  'store': <AppStore />,
  'files': <FileExplorer />,
  'settings': <Settings />,
  'assistant': <AIAssistant />,
  'google-drive': <GoogleAppPlaceholder type="drive" />,
  'notes': <Notes />,
  'calc': <Calculator />,
  'terminal': <Terminal />,
  'browser': <NebulaBrowser />,
};

const DESKTOP_SHORTCUTS: { id: AppId; label: string; icon: any }[] = [
  { id: 'browser', label: 'Nebula Browser', icon: Globe },
  { id: 'files', label: 'File Explorer', icon: FolderOpen },
  { id: 'store', label: 'App Store', icon: ShoppingBag },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'terminal', label: 'Terminal', icon: TermIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Desktop: React.FC = () => {
  const { wallpaper, openWindows, openApp, theme, powerStatus, powerOn, taskbarPosition } = useOS();
  const [bootOpacity, setBootOpacity] = useState(1);
  const [shouldRenderBoot, setShouldRenderBoot] = useState(true);

  useEffect(() => {
    if (powerStatus === 'on') {
      setBootOpacity(0);
      const timer = setTimeout(() => setShouldRenderBoot(false), 1000);
      return () => clearTimeout(timer);
    } else if (powerStatus === 'booting') {
      setShouldRenderBoot(true);
      setBootOpacity(1);
    } else {
      setShouldRenderBoot(false);
      setBootOpacity(0);
    }
  }, [powerStatus]);

  if (powerStatus === 'off') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 animate-in fade-in duration-1000">
        <div className="text-white/10 text-[10px] uppercase tracking-[0.4em] font-bold">System Offline</div>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-20 h-20 rounded-full border-white/5 bg-white/5 hover:bg-white/10 hover:border-accent hover:text-accent transition-all group"
          onClick={powerOn}
        >
          <Power size={32} className="group-hover:scale-110 transition-transform" />
        </Button>
        <div className="text-white/20 text-xs italic">Click to power on</div>
      </div>
    );
  }

  const paddingClasses = {
    bottom: 'pb-16 pt-4 px-4',
    top: 'pt-16 pb-4 px-4',
    left: 'pl-16 pr-4 py-4',
    right: 'pr-16 pl-4 py-4',
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 overflow-hidden select-none transition-opacity duration-1000",
        theme === 'light' ? "light" : "",
        powerStatus === 'booting' ? "opacity-0" : "opacity-100"
      )}
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={cn(
        "absolute inset-0 flex flex-col flex-wrap gap-4 content-start transition-all duration-300",
        paddingClasses[taskbarPosition]
      )}>
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

      {openWindows.map(window => (
        <Window key={window.id} window={window}>
          {APP_COMPONENTS[window.appId]}
        </Window>
      ))}

      <Taskbar />

      {shouldRenderBoot && (
        <div 
          className="fixed inset-0 bg-[#0a0f14] z-[10000] flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: bootOpacity }}
        >
          <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
            <div className="w-12 h-12 bg-accent rounded-full" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-white/40 uppercase">Nebulabs WebOS</h1>
          <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent animate-[loading_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}
      
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
