'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  ShoppingBag, 
  FolderOpen, 
  Settings as SettingsIcon, 
  MessageSquare,
  FileText,
  Calculator as CalcIcon,
  Terminal as TermIcon,
  Globe,
  Trash2,
  Newspaper,
  Map as MapIcon,
  Cloud,
  Activity,
  Calendar as CalendarIcon,
} from 'lucide-react';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser' | 'trash' | 'news' | 'maps' | 'monitor' | 'calendar';
export type ThemeMode = 'dark' | 'light';
export type PowerStatus = 'on' | 'off' | 'booting';
export type TaskbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type TaskbarSize = 'sm' | 'md' | 'lg';
export type DesktopIconSize = 'sm' | 'md' | 'lg';
export type AccentColor = 'default' | 'blue' | 'purple' | 'rose' | 'orange' | 'green' | 'grey' | 'custom';
export type CursorColor = 'black' | 'white' | 'accent';

export interface LocalUser {
  id: string;
  username: string;
  avatarColor: string;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isSnapped?: 'left' | 'right' | null;
  zIndex: number;
  initialWidth?: number;
  initialHeight?: number;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
}

export interface DesktopShortcut {
  id: AppId;
  label: string;
  icon: any;
  x: number;
  y: number;
}

interface OSContextType {
  currentUser: LocalUser | null;
  accounts: LocalUser[];
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  installedApps: AppId[];
  pinnedApps: AppId[];
  fileSystem: FileSystemItem[];
  trash: FileSystemItem[];
  desktopApps: DesktopShortcut[];
  wallpaper: string;
  notes: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  customAccentHex: string;
  cursorColor: CursorColor;
  isInverted: boolean;
  glassEnabled: boolean;
  powerStatus: PowerStatus;
  taskbarPosition: TaskbarPosition;
  taskbarSize: TaskbarSize;
  iconSize: DesktopIconSize;
  currentWifi: string;
  isWifiConnecting: boolean;
  isOnline: boolean;
  volume: number;
  brightness: number;
  isWidgetsOpen: boolean;
  isQuickSettingsOpen: boolean;
  systemStats: { cpu: number; ram: number; net: number };
  
  login: (userId: string) => void;
  logout: () => void;
  createAccount: (username: string) => void;
  openApp: (appId: AppId, title: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  snapWindow: (windowId: string, side: 'left' | 'right' | null) => void;
  focusWindow: (windowId: string) => void;
  installApp: (appId: AppId) => void;
  updateWallpaper: (url: string) => void;
  setNotes: (content: string) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setCustomAccentHex: (hex: string) => void;
  setCursorColor: (color: CursorColor) => void;
  setInverted: (inverted: boolean) => void;
  setGlassEnabled: (enabled: boolean) => void;
  setTaskbarPosition: (position: TaskbarPosition) => void;
  setTaskbarSize: (size: TaskbarSize) => void;
  setIconSize: (size: DesktopIconSize) => void;
  connectToWifi: (ssid: string) => void;
  setVolume: (v: number) => void;
  setBrightness: (b: number) => void;
  setIsWidgetsOpen: (isOpen: boolean) => void;
  setIsQuickSettingsOpen: (isOpen: boolean) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  emptyTrash: () => void;
  deleteItemPermanently: (id: string) => void;
  
  updateDesktopAppPosition: (id: AppId, x: number, y: number) => void;
  toggleDesktopApp: (id: AppId) => void;
  togglePinApp: (id: AppId) => void;
  reorderPinnedApps: (newOrder: AppId[]) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const GRID_X = 100;
const GRID_Y = 110;
const PADDING = 20;

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
];

export const APP_INFO: Record<AppId, { icon: any; label: string }> = {
  'browser': { icon: Globe, label: 'Nebula Browser' },
  'files': { icon: FolderOpen, label: 'File Explorer' },
  'store': { icon: ShoppingBag, label: 'App Store' },
  'assistant': { icon: MessageSquare, label: 'AI Assistant' },
  'notes': { icon: FileText, label: 'Notes' },
  'terminal': { icon: TermIcon, label: 'Terminal' },
  'settings': { icon: SettingsIcon, label: 'Settings' },
  'calc': { icon: CalcIcon, label: 'Calculator' },
  'google-drive': { icon: Cloud, label: 'Google Drive' },
  'trash': { icon: Trash2, label: 'Recycling Bin' },
  'news': { icon: Newspaper, label: 'Nebula News' },
  'maps': { icon: MapIcon, label: 'Nebula Maps' },
  'monitor': { icon: Activity, label: 'System Monitor' },
  'calendar': { icon: CalendarIcon, label: 'Calendar' },
};

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: PADDING, y: PADDING },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: PADDING, y: PADDING + GRID_Y },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: PADDING, y: PADDING + (GRID_Y * 2) },
  { id: 'news', label: 'Nebula News', icon: Newspaper, x: PADDING, y: PADDING + (GRID_Y * 3) },
  { id: 'trash', label: 'Recycling Bin', icon: Trash2, x: PADDING, y: PADDING + (GRID_Y * 4) },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser', 'trash', 'news', 'maps', 'monitor', 'calendar'];
const INITIAL_PINNED: AppId[] = ['files', 'store', 'assistant', 'browser', 'settings', 'monitor'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a'];

const OFFLINE_WIFI = "Public_Guest_No_Internet";

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [pinnedApps, setPinnedApps] = useState<AppId[]>(INITIAL_PINNED);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [trash, setTrash] = useState<FileSystemItem[]>([]);
  const [desktopApps, setDesktopApps] = useState<DesktopShortcut[]>(INITIAL_DESKTOP);
  const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
  const [notes, setNotesState] = useState("");
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('purple');
  const [customAccentHex, setCustomAccentHexState] = useState("#9333ea");
  const [cursorColor, setCursorColorState] = useState<CursorColor>('black');
  const [isInverted, setIsInvertedState] = useState(false);
  const [glassEnabled, setGlassEnabledState] = useState(true);
  const [powerStatus, setPowerStatus] = useState<PowerStatus>('booting');
  const [taskbarPosition, setTaskbarPositionState] = useState<TaskbarPosition>('bottom');
  const [taskbarSize, setTaskbarSizeState] = useState<TaskbarSize>('md');
  const [iconSize, setIconSizeState] = useState<DesktopIconSize>('md');
  const [currentWifi, setCurrentWifi] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [volume, setVolumeState] = useState(75);
  const [brightness, setBrightnessState] = useState(100);
  const [isWidgetsOpen, setIsWidgetsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [systemStats, setSystemStats] = useState({ cpu: 12, ram: 42, net: 2 });

  useEffect(() => {
    const savedAccounts = localStorage.getItem('nebula_accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      const guest = { id: 'guest', username: 'Guest', avatarColor: AVATAR_COLORS[0] };
      setAccounts([guest]);
      localStorage.setItem('nebula_accounts', JSON.stringify([guest]));
    }

    const savedCurrentUserId = localStorage.getItem('nebula_current_user_id');
    if (savedCurrentUserId) {
      const accs = JSON.parse(localStorage.getItem('nebula_accounts') || '[]');
      const user = accs.find((a: LocalUser) => a.id === savedCurrentUserId);
      if (user) login(user.id);
    }

    const bootTimer = setTimeout(() => setPowerStatus('on'), 2600);
    return () => clearTimeout(bootTimer);
  }, []);

  // Telemetry simulation
  useEffect(() => {
    if (powerStatus !== 'on') return;
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 25) + 5,
        ram: Math.floor(Math.random() * 10) + 40,
        net: Math.floor(Math.random() * 100),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [powerStatus]);

  useEffect(() => {
    if (!currentUser) return;

    const uid = currentUser.id;
    const load = (key: string, def: any) => {
      const val = localStorage.getItem(`nebula_${uid}_${key}`);
      if (val === null) return def;
      try {
        return typeof def === 'boolean' ? val === 'true' : (typeof def === 'object' ? JSON.parse(val) : val);
      } catch {
        return val;
      }
    };

    setNotesState(load('notes', ""));
    setThemeState(load('theme', 'dark') as ThemeMode);
    setAccentColorState(load('accent', 'purple') as AccentColor);
    setCustomAccentHexState(load('custom_accent', '#9333ea'));
    setCursorColorState(load('cursor', 'black') as CursorColor);
    setIsInvertedState(load('inverted', false));
    setGlassEnabledState(load('glass', true));
    setTaskbarPositionState(load('taskbar_pos', 'bottom') as TaskbarPosition);
    setTaskbarSizeState(load('taskbar_size', 'md') as TaskbarSize);
    setIconSizeState(load('icon_size', 'md') as DesktopIconSize);
    setWallpaper(load('wallpaper', "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920"));
    setDesktopApps(load('desktop_apps', INITIAL_DESKTOP).map((app: any) => ({ ...app, icon: APP_INFO[app.id as AppId]?.icon || Globe })));
    setPinnedApps(load('pinned_apps', INITIAL_PINNED));
    setFileSystem(load('file_system', INITIAL_FILES));
    setTrash(load('trash_items', []));
    
    const savedWifi = load('wifi', "Nebula_Secure_5G");
    setCurrentWifi(savedWifi);
    setIsOnline(savedWifi !== OFFLINE_WIFI);

    const savedVol = load('volume', "75");
    setVolumeState(parseInt(savedVol));

    const savedBrightness = load('brightness', "100");
    setBrightnessState(parseInt(savedBrightness));

  }, [currentUser]);

  const saveSetting = (key: string, value: any) => {
    if (currentUser) {
      const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(`nebula_${currentUser.id}_${key}`, strValue);
    }
  };

  const login = (userId: string) => {
    const user = accounts.find(a => a.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('nebula_current_user_id', userId);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nebula_current_user_id');
    setOpenWindows([]);
    setActiveWindowId(null);
  };

  const createAccount = (username: string) => {
    const newAcc: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatarColor: AVATAR_COLORS[accounts.length % AVATAR_COLORS.length]
    };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('nebula_accounts', JSON.stringify(updated));
    login(newAcc.id);
  };

  const setNotes = (content: string) => {
    if (!isOnline) return;
    setNotesState(content);
    saveSetting('notes', content);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveSetting('theme', newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    saveSetting('accent', color);
  };

  const setCustomAccentHex = (hex: string) => {
    setCustomAccentHexState(hex);
    saveSetting('custom_accent', hex);
  };

  const setCursorColor = (color: CursorColor) => {
    setCursorColorState(color);
    saveSetting('cursor', color);
  };

  const setInverted = (inverted: boolean) => {
    setIsInvertedState(inverted);
    saveSetting('inverted', inverted);
  };

  const setGlassEnabled = (enabled: boolean) => {
    setGlassEnabledState(enabled);
    saveSetting('glass', enabled);
  };

  const setTaskbarPosition = (position: TaskbarPosition) => {
    setTaskbarPositionState(position);
    saveSetting('taskbar_pos', position);
  };

  const setTaskbarSize = (size: TaskbarSize) => {
    setTaskbarSizeState(size);
    saveSetting('taskbar_size', size);
  };

  const setIconSize = (size: DesktopIconSize) => {
    setIconSizeState(size);
    saveSetting('icon_size', size);
  };

  const connectToWifi = (ssid: string) => {
    setIsWifiConnecting(true);
    setTimeout(() => {
      setCurrentWifi(ssid);
      setIsOnline(ssid !== OFFLINE_WIFI);
      setIsWifiConnecting(false);
      saveSetting('wifi', ssid);
    }, 2000);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    saveSetting('volume', v);
  };

  const setBrightness = (b: number) => {
    setBrightnessState(b);
    saveSetting('brightness', b);
  };

  const powerOn = () => {
    setPowerStatus('booting');
    setTimeout(() => setPowerStatus('on'), 2600);
  };

  const restart = () => {
    setOpenWindows([]);
    setActiveWindowId(null);
    setPowerStatus('booting');
    setTimeout(() => setPowerStatus('on'), 2600);
  };

  const shutDown = () => {
    setOpenWindows([]);
    setActiveWindowId(null);
    setPowerStatus('off');
  };

  const openApp = (appId: AppId, title: string) => {
    const existing = openWindows.find(w => w.appId === appId);
    if (existing) {
      focusWindow(existing.id);
      if (existing.isMinimized) {
        setOpenWindows(prev => prev.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w));
      }
      return;
    }

    let initialWidth = 800;
    let initialHeight = 600;

    if (appId === 'calc') {
      initialWidth = 320;
      initialHeight = 480;
    } else if (appId === 'terminal') {
      initialWidth = 700;
      initialHeight = 450;
    } else if (appId === 'notes') {
      initialWidth = 500;
      initialHeight = 600;
    } else if (appId === 'assistant') {
      initialWidth = 400;
      initialHeight = 650;
    } else if (appId === 'trash') {
      initialWidth = 600;
      initialHeight = 400;
    } else if (appId === 'news') {
      initialWidth = 900;
      initialHeight = 700;
    } else if (appId === 'maps') {
      initialWidth = 950;
      initialHeight = 650;
    } else if (appId === 'monitor') {
      initialWidth = 700;
      initialHeight = 500;
    } else if (appId === 'calendar') {
      initialWidth = 850;
      initialHeight = 600;
    }

    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowInstance = {
      id: newId,
      appId,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      initialWidth,
      initialHeight
    };

    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newId);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const maximizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized, isSnapped: null } : w));
  };

  const snapWindow = (windowId: string, side: 'left' | 'right' | null) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isSnapped: side, isMaximized: false } : w));
  };

  const focusWindow = (windowId: string) => {
    setActiveWindowId(windowId);
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setNextZIndex(prev => prev + 1);
  };

  const installApp = (appId: AppId) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps(prev => [...prev, appId]);
    }
  };

  const updateWallpaper = (url: string) => {
    setWallpaper(url);
    saveSetting('wallpaper', url);
  };

  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'folder',
      parentId
    };
    const updated = [...fileSystem, newFolder];
    setFileSystem(updated);
    saveSetting('file_system', updated);
  };

  const moveToTrash = (id: string) => {
    const item = fileSystem.find(i => i.id === id);
    if (item) {
      const updatedFS = fileSystem.filter(i => i.id !== id);
      const updatedTrash = [...trash, item];
      setFileSystem(updatedFS);
      setTrash(updatedTrash);
      saveSetting('file_system', updatedFS);
      saveSetting('trash_items', updatedTrash);
    }
  };

  const restoreFromTrash = (id: string) => {
    const item = trash.find(i => i.id === id);
    if (item) {
      const updatedTrash = trash.filter(i => i.id !== id);
      const updatedFS = [...fileSystem, item];
      setTrash(updatedTrash);
      setFileSystem(updatedFS);
      saveSetting('trash_items', updatedTrash);
      saveSetting('file_system', updatedFS);
    }
  };

  const emptyTrash = () => {
    setTrash([]);
    saveSetting('trash_items', []);
  };

  const deleteItemPermanently = (id: string) => {
    const updatedTrash = trash.filter(item => item.id !== id);
    setTrash(updatedTrash);
    saveSetting('trash_items', updatedTrash);
  };

  const updateDesktopAppPosition = (id: AppId, x: number, y: number) => {
    const snappedX = Math.round((x - PADDING) / GRID_X) * GRID_X + PADDING;
    const snappedY = Math.round((y - PADDING) / GRID_Y) * GRID_Y + PADDING;
    
    const isOccupied = desktopApps.some(app => app.id !== id && app.x === snappedX && app.y === snappedY);
    
    if (isOccupied) return;

    const updated = desktopApps.map(app => 
      app.id === id ? { ...app, x: snappedX, y: snappedY } : app
    );
    setDesktopApps(updated);
    const stored = updated.map(({ icon, ...app }) => app);
    saveSetting('desktop_apps', stored);
  };

  const toggleDesktopApp = (id: AppId) => {
    const CORE_APPS: AppId[] = ['trash', 'files', 'store'];
    
    const exists = desktopApps.find(app => app.id === id);
    if (exists) {
      if (CORE_APPS.includes(id)) return;
      
      const updated = desktopApps.filter(app => app.id !== id);
      setDesktopApps(updated);
      saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
    } else {
      const info = APP_INFO[id];
      let foundX = PADDING;
      let foundY = PADDING;
      let col = 0;
      let row = 0;
      let isOccupied = true;

      while (isOccupied) {
        foundX = PADDING + (col * GRID_X);
        foundY = PADDING + (row * GRID_Y);
        isOccupied = desktopApps.some(app => app.x === foundX && app.y === foundY);
        if (isOccupied) {
          row++;
          if (row > 6) { 
            row = 0;
            col++;
          }
        }
      }

      const newApp = { 
        id, 
        label: info.label, 
        icon: info.icon, 
        x: foundX, 
        y: foundY 
      };
      const updated = [...desktopApps, newApp];
      setDesktopApps(updated);
      saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
    }
  };

  const togglePinApp = (id: AppId) => {
    const isPinned = pinnedApps.includes(id);
    const updated = isPinned 
      ? pinnedApps.filter(appId => appId !== id)
      : [...pinnedApps, id];
    setPinnedApps(updated);
    saveSetting('pinned_apps', updated);
  };

  const reorderPinnedApps = (newOrder: AppId[]) => {
    setPinnedApps(newOrder);
    saveSetting('pinned_apps', newOrder);
  };

  return (
    <OSContext.Provider value={{
      currentUser,
      accounts,
      openWindows,
      activeWindowId,
      installedApps,
      pinnedApps,
      fileSystem,
      trash,
      desktopApps,
      wallpaper,
      notes,
      theme,
      accentColor,
      customAccentHex,
      cursorColor,
      isInverted,
      glassEnabled,
      powerStatus,
      taskbarPosition,
      taskbarSize,
      iconSize,
      currentWifi,
      isWifiConnecting,
      isOnline,
      volume,
      brightness,
      isWidgetsOpen,
      isQuickSettingsOpen,
      systemStats,
      login,
      logout,
      createAccount,
      openApp,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      snapWindow,
      focusWindow,
      installApp,
      updateWallpaper,
      setNotes,
      setTheme,
      setAccentColor,
      setCustomAccentHex,
      setCursorColor,
      setInverted,
      setGlassEnabled,
      setTaskbarPosition,
      setTaskbarSize,
      setIconSize,
      connectToWifi,
      setVolume,
      setBrightness,
      setIsWidgetsOpen,
      setIsQuickSettingsOpen,
      restart,
      shutDown,
      powerOn,
      createFolder,
      moveToTrash,
      restoreFromTrash,
      emptyTrash,
      deleteItemPermanently,
      updateDesktopAppPosition,
      toggleDesktopApp,
      togglePinApp,
      reorderPinnedApps,
      setIsQuickSettingsOpen,
    }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) throw new Error('useOS must be used within an OSProvider');
  return context;
};
