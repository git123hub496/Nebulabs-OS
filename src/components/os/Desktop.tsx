
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useOS, AppId, WindowInstance, APP_INFO } from '@/context/os-context';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { ContextMenu } from './ContextMenu';
import { LoginScreen } from './LoginScreen';
import { WidgetsPanel } from './WidgetsPanel';
import { QuickSettings } from './QuickSettings';
import { GlobalSearch } from './GlobalSearch';
import { ChatBar } from './ChatBar';
import { BIOS } from './BIOS';
import { StickyNote } from './StickyNote';
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
  Info,
  Camera as CameraIcon,
  Presentation as PresentationIcon,
  Monitor as MonitorIcon,
  Cpu,
  Zap,
  Mail,
  GraduationCap,
  Pin,
  PinOff,
  Smile,
  Home,
  Layers,
  Store,
  Tv,
  StickyNote as StickyNoteIcon
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
import { Camera } from '../apps/Camera';
import { PresentationMaker } from '../apps/PresentationMaker';
import { NebulaMail } from '../apps/NebulaMail';
import { NebulaV } from '../apps/NebulaV';
import { GoogleSearch } from '../apps/GoogleSearch';
import { ShopNebulabs } from '../apps/ShopNebulabs';
import { Screencast } from '../apps/Screencast';
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
  'camera': (win) => <Camera />,
  'slides': (win) => <PresentationMaker />,
  'mail': (win) => <NebulaMail />,
  'nebula-v': (win) => <NebulaV />,
  'google-search': (win) => <GoogleSearch />,
  'shop': (win) => <ShopNebulabs />,
  'screencast': (win) => <Screencast />,
  'sticky-notes': (win) => <div className="p-8 text-center text-white/40"><p className="text-sm font-bold">Sticky Notes Manager</p><p className="text-[10px] uppercase">A new note has been created on your desktop.</p></div>,
  'info': (win) => (
    <div className="p-8 space-y-6 bg-[#161d25] h-full text-white/90 overflow-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-3xl bg-accent/20 flex items-center justify-center border border-accent/20">
          <Info size={32} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Nebula System Info</h1>
          <p className="text-xs uppercase tracking-widest text-white/60 font-bold">Kernel Build v4.5.2-STABLE • 2026</p>
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
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/40 transition-colors group">
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{spec.label}</span>
            <span className="text-sm font-bold text-accent group-hover:text-white transition-colors">{spec.value}</span>
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
    cursorColor, isInverted, setInverted, isGrayscale, setGrayscale, glassEnabled, setGlassEnabled, desktopApps, updateDesktopAppPosition, toggleDesktopApp,
    isWidgetsOpen, setIsWidgetsOpen, isQuickSettingsOpen, setIsQuickSettingsOpen,
    isStartOpen, setIsStartOpen, isChatOpen, setIsChatOpen, activeWindowId, closeWindow, minimizeAllWindows,
    brightness, currentDisplayId, displayLayout, isSecurityEnabled, addNotification,
    isLocked, lock, biosSettings, pinnedApps, togglePinApp, stickyNotes,
    globalScale, setGlobalScale, factoryReset, mouserScale
  } = useOS();
  
  const [bootOpacity, setBootOpacity] = useState(1);
  const [shouldRenderBoot, setShouldRenderBoot] = useState(true);
  const [showBIOS, setShowBIOS] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [shortcutContextMenu, setShortcutContextMenu] = useState<{ x: number, y: number, appId: AppId } | null>(null);
  const [runQuery, setRunQuery] = useState("");
  const [isRunOpen, setIsRunOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [pendingDragAppId, setPendingDragAppId] = useState<AppId | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [draggingAppId, setDraggingAppId] = useState<AppId | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentDragPos, setCurrentDragPos] = useState({ x: 0, y: 0 });
  
  const desktopRef = useRef<HTMLDivElement>(null);

  const isSchool = currentUser?.isSchoolAccount;
  const isKid = currentUser?.isKidAccount;

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'b' && !e.altKey) {
      const isBooting = powerStatus === 'booting' || shouldRenderBoot;
      const isOff = powerStatus === 'off';
      if (isBooting || isOff) {
        e.preventDefault();
        setShowBIOS(true);
        return;
      }
    }

    if (powerStatus !== 'on' || !currentUser) {
      if (e.altKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        factoryReset();
      }
      return;
    }

    if (e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          factoryReset();
          break;
        case 'b':
          e.preventDefault();
          setGlobalScale(Math.min(globalScale + 0.1, 2.0));
          break;
        case 'v':
          e.preventDefault();
          setGlobalScale(Math.max(globalScale - 0.1, 0.5));
          break;
        case 'n': 
          e.preventDefault();
          setIsStartOpen(!isStartOpen);
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
          if (!isKid) openApp('terminal', 'Terminal');
          break;
        case 'a': 
          e.preventDefault();
          openApp('assistant', 'AI Assistant');
          break;
        case 'g': 
          e.preventDefault();
          setGrayscale(!isGrayscale);
          break;
        case 'i':
          e.preventDefault();
          setInverted(!isInverted);
          break;
        case 'd': 
          e.preventDefault();
          minimizeAllWindows();
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
          break;
      }
    }

    if (e.key === 'Escape') {
      setIsStartOpen(false);
      setIsWidgetsOpen(false);
      setIsQuickSettingsOpen(false);
      setIsChatOpen(false);
      setIsRunOpen(false);
      setContextMenu(null);
      setShortcutContextMenu(null);
    }
  }, [powerStatus, currentUser, isStartOpen, isWidgetsOpen, isQuickSettingsOpen, isChatOpen, openApp, setIsStartOpen, setIsWidgetsOpen, setIsQuickSettingsOpen, setIsChatOpen, minimizeAllWindows, lock, isKid, shouldRenderBoot, isGrayscale, setGrayscale, isInverted, setInverted, globalScale, setGlobalScale, factoryReset]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const menuWidth = 224;
    const menuHeight = 250;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    setContextMenu({ x, y });
    setShortcutContextMenu(null);
  };

  const handleShortcutContextMenu = (e: React.MouseEvent, appId: AppId) => {
    e.preventDefault();
    e.stopPropagation();
    const menuWidth = 224;
    const menuHeight = 200;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x -= menuWidth;
    if (y + menuHeight > window.innerHeight) y -= menuHeight;

    setShortcutContextMenu({ x, y, appId });
    setContextMenu(null);
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
    
    setContextMenu(null);
    setShortcutContextMenu(null);
    
    const app = desktopApps.find(a => a.id === appId);
    if (app) {
      setPendingDragAppId(appId);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - app.x,
        y: e.clientY - app.y
      });
      setCurrentDragPos({ x: app.x, y: app.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (pendingDragAppId && !draggingAppId) {
      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;
      const distance = Math.hypot(dx, dy);
      
      if (distance > 5) {
        setDraggingAppId(pendingDragAppId);
      }
    }

    if (draggingAppId) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setCurrentDragPos({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (draggingAppId) {
      updateDesktopAppPosition(draggingAppId, currentDragPos.x, currentDragPos.y);
    }
    setPendingDragAppId(null);
    setDraggingAppId(null);
  };

  const cursorStyle = useMemo(() => {
    if (!isClient) return {};
    
    let color = '#000000';
    if (cursorColor === 'white') color = '#ffffff';
    else if (cursorColor === 'accent') {
      const computedStyle = getComputedStyle(document.documentElement);
      const accentVal = computedStyle.getPropertyValue('--accent').trim();
      color = accentVal.includes('%') ? `hsl(${accentVal})` : accentVal;
    }

    const size = 24 * mouserScale;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>`;
    const encoded = typeof window !== 'undefined' ? btoa(svg) : '';
    return { '--cursor-url': `url('data:image/svg+xml;base64,${encoded}'), auto` } as React.CSSProperties;
  }, [cursorColor, mouserScale, isClient, accentColor, customAccentHex]);

  if (showBIOS) {
    return <div style={cursorStyle} className="h-full w-full"><BIOS onClose={() => setShowBIOS(false)} /></div>;
  }

  if (powerStatus === 'off') {
    return (
      <div className="fixed inset-0 bg-[#020202] flex flex-col items-center justify-center gap-12 animate-in fade-in duration-1000 overflow-hidden" style={cursorStyle}>
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
        <Button 
          variant="outline" 
          size="icon" 
          className="w-24 h-24 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent hover:text-accent transition-all duration-500 group relative z-10 shadow-2xl"
          onClick={powerOn}
        >
          <Power size={40} className="group-hover:scale-110 transition-transform duration-500 group-active:scale-90" />
        </Button>
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] animate-pulse">Press [B] for Setup</p>
      </div>
    );
  }

  if ((powerStatus === 'on' && !currentUser && !shouldRenderBoot) || isLocked) {
    return <div style={cursorStyle} className="h-full w-full"><LoginScreen /></div>;
  }

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

  const accentVarMap: Record<AccentColor, string> = {
    'purple': '262.1 83.3% 57.8%',
    'blue': '217.2 91.2% 59.8%',
    'rose': '346.8 77.2% 49.8%',
    'orange': '24.6 95% 53.1%',
    'green': '142.1 76.2% 36.3%',
    'grey': '210 20% 50%',
    'default': '262.1 83.3% 57.8%',
    'custom': customAccentHex ? hexToHslString(customAccentHex) : '262.1 83.3% 57.8%'
  };

  const systemVars = {
    '--accent': accentVarMap[accentColor],
    '--primary': accentVarMap[accentColor],
    '--ring': accentVarMap[accentColor],
    '--sidebar-accent': accentVarMap[accentColor],
  } as React.CSSProperties;

  const currentScale = isNaN(iconSize) ? 1.0 : iconSize / 100;
  const scaledIconBoxSize = 56 * currentScale;
  const scaledContainerWidth = 96 * currentScale;
  const scaledIconSize = 28 * currentScale;
  const scaledFontSize = 11 * currentScale;

  return (
    <div 
      ref={desktopRef}
      className={cn(
        "fixed inset-0 overflow-hidden select-none transition-all duration-1000",
        theme === 'light' ? "light" : "",
        isInverted ? "system-inverted" : "",
        isGrayscale ? "grayscale" : "",
        !glassEnabled ? "glass-disabled" : "",
        powerStatus === 'booting' ? "opacity-0" : "opacity-100"
      )}
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zoom: globalScale,
        ...systemVars,
        ...cursorStyle
      }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        setShortcutContextMenu(null);
        if (isWidgetsOpen) setIsWidgetsOpen(false);
        if (isQuickSettingsOpen) setIsQuickSettingsOpen(false);
        if (isStartOpen) setIsStartOpen(false);
        if (isChatOpen) setIsChatOpen(false);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-[10000] transition-opacity duration-300" 
        style={{ opacity: 1 - (brightness / 100) }}
      />

      {(isWidgetsOpen || isQuickSettingsOpen || isStartOpen || isChatOpen || isRunOpen) && (
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-md z-[9997]" 
          onClick={(e) => {
            e.stopPropagation();
            setIsWidgetsOpen(false);
            setIsQuickSettingsOpen(false);
            setIsStartOpen(false);
            setIsChatOpen(false);
            setIsRunOpen(false);
          }}
        />
      )}

      {!isSchool && !isKid && <WidgetsPanel />}
      
      <GlobalSearch />

      <ChatBar />

      {stickyNotes.map(note => (
        <StickyNote key={note.id} note={note} />
      ))}

      {currentDisplayId === '1' && desktopApps.map(shortcut => {
        if (isKid && (shortcut.id === 'terminal' || shortcut.id === 'virus')) return null;

        const Icon = shortcut.icon;
        const isDragging = draggingAppId === shortcut.id;
        
        return (
          <div 
            key={shortcut.id}
            className={cn(
              "absolute flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer text-center",
              isDragging ? "z-50 opacity-50 pointer-events-none transition-none" : "duration-200"
            )}
            style={{ 
              left: isDragging ? currentDragPos.x : shortcut.x, 
              top: isDragging ? currentDragPos.y : shortcut.y,
              width: `${scaledContainerWidth}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, shortcut.id)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(shortcut.id, shortcut.label);
            }}
            onContextMenu={(e) => handleShortcutContextMenu(e, shortcut.id)}
          >
            <div 
              className={cn("glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform mb-1 shadow-lg border-white/20 relative", isSchool && "border-blue-500/20 shadow-blue-500/10", isKid && "border-pink-500/20 shadow-pink-500/10")}
              style={{ width: `${scaledIconBoxSize}px`, height: `${scaledIconBoxSize}px` }}
            >
              <Icon size={scaledIconSize} className={isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent"} />
              
              {shortcut.id !== 'trash' && shortcut.id !== 'files' && shortcut.id !== 'store' && !isSchool && !isKid && (
                <button 
                  className="delete-shortcut-btn absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-10 border-2 border-white shadow-md flex items-center justify-center"
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
            <span 
              className="text-white font-bold drop-shadow-md text-center line-clamp-2 px-1"
              style={{ fontSize: `${scaledFontSize}px` }}
            >
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

      {shortcutContextMenu && (
        <div 
          className="fixed z-[100000] w-56 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
          style={{ left: shortcutContextMenu.x, top: shortcutContextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => {
              openApp(shortcutContextMenu.appId, APP_INFO[shortcutContextMenu.appId].label);
              setShortcutContextMenu(null);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors group"
          >
            <div className="flex items-center gap-3">
              <RefreshCw size={14} className="text-accent/60 group-hover:text-accent" />
              <span>Launch Application</span>
            </div>
          </button>
          
          <div className="my-1 border-t border-white/5 mx-2" />

          <button 
            onClick={() => {
              togglePinApp(shortcutContextMenu.appId);
              setShortcutContextMenu(null);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors group"
          >
            <div className="flex items-center gap-3">
              {pinnedApps.includes(shortcutContextMenu.appId) ? (
                <>
                  <PinOff size={14} className="text-accent/60 group-hover:text-accent" />
                  <span>Unpin from Taskbar</span>
                </>
              ) : (
                <>
                  <Pin size={14} className="text-accent/60 group-hover:text-accent" />
                  <span>Pin to Taskbar</span>
                </>
              )}
            </div>
          </button>

          {!['trash', 'files', 'store'].includes(shortcutContextMenu.appId) && !isSchool && !isKid && (
            <button 
              onClick={() => {
                toggleDesktopApp(shortcutContextMenu.appId);
                setShortcutContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-destructive/20 text-xs font-bold text-white/80 hover:text-destructive transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={14} className="text-destructive/60 group-hover:text-destructive" />
                <span>Delete Shortcut</span>
              </div>
            </button>
          )}
        </div>
      )}

      {isRunOpen && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[10001] w-[400px] glass p-6 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isSchool ? "bg-blue-500/20" : isKid ? "bg-pink-500/20" : "bg-accent/20")}>
              <Command size={16} className={isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent"} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Run Intelligence</h2>
          </div>
          <form onSubmit={handleRunSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <Input 
              autoFocus
              value={runQuery}
              onChange={(e) => setRunQuery(e.target.value)}
              placeholder="Enter application ID"
              className="pl-10 h-12 bg-black/40 border-white/10 text-white rounded-xl focus-visible:ring-accent"
            />
          </form>
        </div>
      )}

      {shouldRenderBoot && (
        <div 
          className="fixed inset-0 bg-[#000088] z-[20000] flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: bootOpacity, ...cursorStyle }}
        >
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse border border-white/20">
            <div className="w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          </div>
          <h1 className="text-2xl font-black tracking-[0.3em] text-white/80 uppercase">Nebula WebOS</h1>
          {!biosSettings.secureBoot && (
            <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-[0.3em] animate-pulse mt-4">Warning: Secure Boot Disabled</p>
          )}
          <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-[loading_2s_ease-in-out_infinite]" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
             <p className="text-[10px] text-white/40 font-black tracking-widest uppercase animate-pulse">Press [B] for Setup</p>
          </div>
          <p className="fixed bottom-12 text-[10px] text-white/20 font-bold tracking-widest uppercase">Proprietary Kernel v4.5.2 • © 2026</p>
        </div>
      )}
    </div>
  );
};
