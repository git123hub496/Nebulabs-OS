
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOS, AppId, DesktopShortcut } from '@/context/os-context';
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
  Bomb
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
  'trash': <RecyclingBin />,
  'news': <NebulaNews />,
  'maps': <NebulaMaps />,
  'monitor': <SystemMonitor />,
  'calendar': <Calendar />,
  'snake': <SnakeGame />,
  'minesweeper': <Minesweeper />,
};

export const Desktop: React.FC = () => {
  const { 
    wallpaper, openWindows, openApp, theme, accentColor, customAccentHex,
    powerStatus, powerOn, taskbarPosition, iconSize, currentUser,
    cursorColor, isInverted, glassEnabled, desktopApps, updateDesktopAppPosition, toggleDesktopApp,
    isWidgetsOpen, setIsWidgetsOpen, isQuickSettingsOpen, setIsQuickSettingsOpen,
    brightness, currentDisplayId, displayLayout
  } = useOS();
  
  const [bootOpacity, setBootOpacity] = useState(1);
  const [shouldRenderBoot, setShouldRenderBoot] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
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

  if (powerStatus === 'on' && !currentUser && !shouldRenderBoot) {
    return <LoginScreen />;
  }

  const accentClass = accentColor !== 'default' && accentColor !== 'custom' ? `accent-${accentColor}` : '';
  
  const getCursorVariable = () => {
    if (cursorColor === 'black') return 'var(--cursor-black)';
    if (cursorColor === 'white') return 'var(--cursor-white)';
    let hex = customAccentHex;
    const accentHexes: Record<string, string> = { blue: '#3b82f6', rose: '#e11d48', orange: '#f97316', green: '#16a34a', purple: '#9333ea', grey: '#64748b', default: '#9333ea' };
    if (accentColor !== 'custom') hex = accentHexes[accentColor];
    return `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNIDQgMyBMIDQgMjEgTCA4LjUgMTYuNSBMIDExLjUgMjMgTCAxNC41IDIyIEwgMTEuNSAxNS41IEwgMTggMTUuNSBMIDQgMyBaIiBmaWxsPSI${hex.replace('#', '')}\"IHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC44IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==")`;
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
    '--ring': hexToHslString(customAccentHex),
    '--sidebar-accent': hexToHslString(customAccentHex),
  } as React.CSSProperties : {};

  const iconScaleMap = { sm: 0.8, md: 1, lg: 1.25 };
  const currentScale = iconScaleMap[iconSize];

  // MULTI-DISPLAY LOGIC: Filter windows for THIS display, but also include "overlapping" windows from neighbors
  const displayWindows = openWindows.filter(win => {
    // 1. Direct match
    if ((win.displayId || '1') === currentDisplayId) return true;

    // 2. Overlap check for neighboring displays
    const layout = displayLayout[currentDisplayId];
    if (!layout) return false;

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const winWidth = win.initialWidth || 800;
    const winHeight = win.initialHeight || 600;

    // Check if the window is on a neighbor but is partially visible here
    if (layout.left === win.displayId && win.x + winWidth > screenWidth) return true;
    if (layout.right === win.displayId && win.x < 0) return true;
    if (layout.top === win.displayId && win.y + winHeight > screenHeight) return true;
    if (layout.bottom === win.displayId && win.y < 0) return true;

    return false;
  });

  return (
    <div 
      ref={desktopRef}
      className={cn(
        "fixed inset-0 overflow-hidden select-none transition-all duration-1000",
        theme === 'light' ? "light" : "",
        accentClass,
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
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Brightness Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[10000] transition-opacity duration-300" 
        style={{ opacity: 1 - (brightness / 100) }}
      />

      {/* Widgets Focus Overlay */}
      {(isWidgetsOpen || isQuickSettingsOpen) && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[9997] animate-in fade-in duration-300" 
          onClick={(e) => {
            e.stopPropagation();
            setIsWidgetsOpen(false);
            setIsQuickSettingsOpen(false);
          }}
        />
      )}

      {/* Widgets Panel */}
      <WidgetsPanel />

      {/* Display Identity Overlay (Indicator) */}
      <div className="absolute top-4 right-4 z-[9999] pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
          <Activity size={12} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Display {currentDisplayId}</span>
        </div>
      </div>

      {/* Desktop Icons - Only show on primary display */}
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

      {displayWindows.map(window => (
        <Window key={window.id} window={window}>
          {APP_COMPONENTS[window.appId]}
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
