'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOS, AppId, DesktopShortcut, WindowInstance } from '@/context/os-context';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { ContextMenu } from './ContextMenu';
import { LoginScreen } from './LoginScreen';
import { WidgetsPanel } from './WidgetsPanel';
import { QuickSettings } from './QuickSettings';
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
  Trash2,
  Newspaper,
  Map as MapIcon,
  Activity,
  Calendar as CalendarIcon,
  Gamepad2,
  Bomb,
  RefreshCw,
  Skull,
  Command,
  Search,
  Lock,
  Palette,
  Info
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
import { RecyclingBin } from '../apps/RecyclingBin';
import { NebulaNews } from '../apps/NebulaNews';
import { NebulaMaps } from '../apps/NebulaMaps';
import { SystemMonitor } from '../apps/SystemMonitor';
import { Calendar } from '../apps/Calendar';
import { SnakeGame } from '../apps/SnakeGame';
import { Minesweeper } from '../apps/Minesweeper';
import { ImageViewer } from '../apps/ImageViewer';
import { SystemUpdate } from '../apps/SystemUpdate';
import { VirusPopup } from '../apps/VirusPopup';
import { Paint } from '../apps/Paint';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const APP_COMPONENTS: Record<AppId, (win: WindowInstance) => React.ReactNode> = {
  'store': (win) => <AppStore />,
  'files': (win) => <FileExplorer />,
  'settings': (win) => <Settings />,
  'assistant': (win) => <AIAssistant />,
  'google-drive': (win) => <GoogleAppPlaceholder type="drive" />,
  'notes': (win) => <Notes />,
  'calc': (win) => <Calculator />,
  'terminal': (win) => <Terminal />,
  'browser': (win) => <NebulaBrowser />,
  'trash': (win) => <RecyclingBin />,
  'news': (win) => <NebulaNews />,
  'maps': (win) => <NebulaMaps />,
  'monitor': (win) => <SystemMonitor />,
  'calendar': (win) => <Calendar />,
  'snake': (win) => <SnakeGame />,
  'minesweeper': (win) => <Minesweeper />,
  'image-viewer': (win) => <ImageViewer src={win.params?.src} />,
  'update': (win) => <SystemUpdate />,
  'virus': (win) => <VirusPopup />,
  'paint': (win) => <Paint />,
  'info': (win) => (
    <div className="p-8 space-y-6 bg-[#161d25] h-full text-white/80 overflow-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center">
          <Info size={32} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Nebula System Info</h1>
          <p className="text-xs uppercase tracking-widest text-white/40">Kernel Build v4.5.2-STABLE</p>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          { label: "OS Platform", value: "Nebulabs WebOS Web Edition" },
          { label: "Kernel Engine", value: "React 19 + Turbopack" },
          { label: "Memory Type", value: "64GB Virtual LPDDR5" },
          { label: "Storage", value: "256GB Cloud Partition" },
          { label: "Processor", value: "Nebulabs Quantum-X Threaded Core" },
          { label: "UI Framework", value: "Tailwind v4 Precision Engine" }
        ].map((spec, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{spec.label}</span>
            <span className="text-sm font-medium text-accent">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Desktop: React.FC = () => {
  const { 
    wallpaper, openWindows, openApp, theme, accentColor, customAccentHex,
    powerStatus, powerOn, taskbarPosition, iconSize, currentUser,
    cursorColor, isInverted, glassEnabled, desktopApps, updateDesktopAppPosition, toggleDesktopApp,
    isWidgetsOpen, setIsWidgetsOpen, isQuickSettingsOpen, setIsQuickSettingsOpen,
    isStartOpen, setIsStartOpen, activeWindowId, closeWindow, minimizeAllWindows,
    brightness, currentDisplayId, displayLayout, isSecurityEnabled, addNotification,
    isLocked, lock
  } = useOS();
  
  const [bootOpacity, setBootOpacity] = useState(1);
  const [shouldRenderBoot, setShouldRenderBoot] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [runQuery, setRunQuery] = useState("");
  const [isRunOpen, setIsRunOpen] = useState(false);
  
  const [draggingAppId, setDraggingAppId] = useState<AppId | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentDragPos, setCurrentDragPos] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);

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

  // Global Keyboard Shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (powerStatus !== 'on' || !currentUser) return;

    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case ' ': 
          e.preventDefault();
          setIsStartOpen(!isStartOpen);
          setIsWidgetsOpen(false);
          setIsQuickSettingsOpen(false);
          break;
        case 'e': 
          e.preventDefault();
          openApp('files', 'File Explorer');
          break;
        case 's': 
          e.preventDefault();
          openApp('settings', 'Settings');
          break;
        case 't': 
          e.preventDefault();
          openApp('terminal', 'Terminal');
          break;
        case 'a': 
          e.preventDefault();
          openApp('assistant', 'AI Assistant');
          break;
        case 'g': 
          e.preventDefault();
          openApp('store', 'App Store');
          break;
        case 'd': 
          e.preventDefault();
          minimizeAllWindows();
          break;
        case 'x': 
          e.preventDefault();
          if (activeWindowId) closeWindow(activeWindowId);
          break;
        case 'l':
          e.preventDefault();
          lock();
          break;
        case 'r':
          e.preventDefault();
          setIsRunOpen(true);
          break;
        case 'q': 
          e.preventDefault();
          setIsQuickSettingsOpen(!isQuickSettingsOpen);
          setIsStartOpen(false);
          setIsWidgetsOpen(false);
          break;
      }
    }

    if (e.key === 'Escape') {
      setIsStartOpen(false);
      setIsWidgetsOpen(false);
      setIsQuickSettingsOpen(false);
      setIsRunOpen(false);
      setContextMenu(null);
    }
  }, [powerStatus, currentUser, isStartOpen, isWidgetsOpen, isQuickSettingsOpen, activeWindowId, openApp, setIsStartOpen, setIsWidgetsOpen, setIsQuickSettingsOpen, closeWindow, minimizeAllWindows, lock]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (runQuery.trim()) {
      openApp(runQuery.trim().toLowerCase() as any, runQuery.trim().toUpperCase());
      setRunQuery("");
      setIsRunOpen(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, appId: AppId) => {
    if ((e.target as HTMLElement).closest('.delete-shortcut-btn')) return;
    
    e.stopPropagation();
    const app = desktopApps.find(a => a.id === appId);
    if (app) {
      setDraggingAppId(appId);
      setDragOffset({
        x: e.clientX - app.x,
        y: e.clientY - app.y
      });
      setCurrentDragPos({ x: app.x, y: app.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingAppId) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setCurrentDragPos({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (draggingAppId) {
      updateDesktopAppPosition(draggingAppId, currentDragPos.x, currentDragPos.y);
      setDraggingAppId(null);
    }
  };

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
      </div>
    );
  }

  if ((powerStatus === 'on' && !currentUser && !shouldRenderBoot) || isLocked) {
    return <LoginScreen />;
  }

  // Custom Cursor Logic
  const getCursorVariable = () => {
    if (cursorColor === 'black') return 'var(--cursor-black)';
    if (cursorColor === 'white') return 'var(--cursor-white)';
    
    let hex = customAccentHex;
    const accentHexes: Record<string, string> = {
      blue: '#3b82f6',
      rose: '#e11d48',
      orange: '#f97316',
      green: '#16a34a',
      purple: '#9333ea',
      grey: '#64748b',
      default: '#9333ea'
    };
    
    if (accentColor !== 'custom') {
      hex = accentHexes[accentColor] || accentHexes['default'];
    }

    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 4 3 L 4 21 L 8.5 16.5 L 11.5 23 L 14.5 22 L 11.5 15.5 L 18 15.5 L 4 3 Z" fill="${hex}" stroke="white" stroke-width="0.8" stroke-linejoin="round"/>
    </svg>`;
    const base64 = typeof window !== 'undefined' ? btoa(svg) : '';
    return `url("data:image/svg+xml;base64,${base64}")`;
  };

  const hexToHslString = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${h * 360} ${s * 100}% ${l * 100}%`;
  };

  const customStyle = accentColor === 'custom' ? {
    '--accent': hexToHslString(customAccentHex),
    '--primary': hexToHslString(customAccentHex),
    '--ring': hexToHslString(customAccentHex),
    '--sidebar-accent': hexToHslString(customAccentHex),
  } as React.CSSProperties : {};

  // Safeguard against NaN in scale values
  const currentScale = isNaN(iconSize) ? 1.0 : iconSize / 100;

  return (
    <div 
      ref={desktopRef}
      className={cn(
        "fixed inset-0 overflow-hidden select-none transition-all duration-1000",
        theme === 'light' ? "light" : "",
        isInverted ? "system-inverted" : "",
        !glassEnabled ? "glass-disabled" : "",
        powerStatus === 'booting' ? "opacity-0" : "opacity-100"
      )}
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // @ts-ignore
        '--cursor-url': getCursorVariable(),
        ...customStyle
      }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        if (isWidgetsOpen) setIsWidgetsOpen(false);
        if (isQuickSettingsOpen) setIsQuickSettingsOpen(false);
        if (isStartOpen) setIsStartOpen(false);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[10000] transition-opacity duration-300" 
        style={{ opacity: 1 - (brightness / 100) }}
      />

      {(isWidgetsOpen || isQuickSettingsOpen || isStartOpen || isRunOpen) && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[9997] animate-in fade-in duration-300" 
          onClick={(e) => {
            e.stopPropagation();
            setIsWidgetsOpen(false);
            setIsQuickSettingsOpen(false);
            setIsStartOpen(false);
            setIsRunOpen(false);
          }}
        />
      )}

      <WidgetsPanel />

      {currentDisplayId === '1' && desktopApps.map(shortcut => {
        const Icon = shortcut.icon;
        const isDragging = draggingAppId === shortcut.id;
        
        return (
          <div 
            key={shortcut.id}
            className={cn(
              "absolute desktop-icon group transition-all",
              isDragging ? "z-50 opacity-50 scale-105 pointer-events-none transition-none" : "duration-200"
            )}
            style={{ 
              left: isDragging ? currentDragPos.x : shortcut.x, 
              top: isDragging ? currentDragPos.y : shortcut.y,
              transform: `scale(${currentScale})`,
              transformOrigin: 'top left'
            }}
            onMouseDown={(e) => handleMouseDown(e, shortcut.id)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(shortcut.id, shortcut.label);
            }}
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1 shadow-lg border-white/20 relative">
              <Icon size={28} className="text-accent" />
              
              {shortcut.id !== 'trash' && shortcut.id !== 'files' && shortcut.id !== 'store' && (
                <button 
                  className="delete-shortcut-btn absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-10 border-2 border-white shadow-md flex items-center justify-center"
                  onMouseDown={(e) => e.stopPropagation()} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleDesktopApp(shortcut.id); 
                  }}
                >
                  <Trash2 size={10} strokeWidth={3} />
                </button>
              )}
            </div>
            <span className="text-white text-[11px] font-medium drop-shadow-md text-center line-clamp-2 px-1">
              {shortcut.label}
            </span>
          </div>
        );
      })}

      {openWindows.filter(w => (w.displayId || '1') === currentDisplayId).map(window => (
        <Window key={window.id} window={window}>
          {APP_COMPONENTS[window.appId](window)}
        </Window>
      ))}

      <Taskbar />

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
        />
      )}

      {isRunOpen && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[10001] w-[400px] glass p-6 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Command size={16} className="text-accent" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Run Intelligence</h2>
          </div>
          <form onSubmit={handleRunSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <Input 
              autoFocus
              value={runQuery}
              onChange={(e) => setRunQuery(e.target.value)}
              placeholder="Enter application ID (e.g. paint, terminal)"
              className="pl-10 h-12 bg-black/20 border-white/10 text-white rounded-xl focus-visible:ring-accent"
            />
          </form>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['paint', 'terminal', 'calc', 'browser'].map(app => (
              <button 
                key={app}
                onClick={() => { setRunQuery(app); }}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-white/40 hover:bg-accent/10 hover:text-accent transition-all"
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      )}

      {shouldRenderBoot && (
        <div 
          className="fixed inset-0 bg-[#0a0f14] z-[20000] flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none"
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
    </div>
  );
};