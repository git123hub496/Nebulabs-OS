
"use client"

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
} from 'lucide-react';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser';
export type ThemeMode = 'dark' | 'light';
export type PowerStatus = 'on' | 'off' | 'booting';
export type TaskbarPosition = 'top' | 'bottom' | 'left' | 'right';
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
  fileSystem: FileSystemItem[];
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
  currentWifi: string;
  isWifiConnecting: boolean;
  isOnline: boolean;
  volume: number;
  
  login: (userId: string) => void;
  logout: () => void;
  createAccount: (username: string) => void;
  openApp: (appId: AppId, title: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
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
  connectToWifi: (ssid: string) => void;
  setVolume: (v: number) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  deleteItem: (id: string) => void;
  
  updateDesktopAppPosition: (id: AppId, x: number, y: number) => void;
  toggleDesktopApp: (id: AppId) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
];

const APP_INFO: Record<AppId, { icon: any; label: string }> = {
  'browser': { icon: Globe, label: 'Nebula Browser' },
  'files': { icon: FolderOpen, label: 'File Explorer' },
  'store': { icon: ShoppingBag, label: 'App Store' },
  'assistant': { icon: MessageSquare, label: 'AI Assistant' },
  'notes': { icon: FileText, label: 'Notes' },
  'terminal': { icon: TermIcon, label: 'Terminal' },
  'settings': { icon: SettingsIcon, label: 'Settings' },
  'calc': { icon: CalcIcon, label: 'Calculator' },
  'google-drive': { icon: TermIcon, label: 'Google Drive' }, // Fallback icon
};

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: 20, y: 20 },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: 20, y: 130 },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: 20, y: 240 },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, x: 20, y: 350 },
  { id: 'notes', label: 'Notes', icon: FileText, x: 20, y: 460 },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a'];

const OFFLINE_WIFI = "Public_Guest_No_Internet";

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
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
  const [currentWifi, setCurrentWifi] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [volume, setVolumeState] = useState(75);
  const [nextZIndex, setNextZIndex] = useState(10);

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
    setWallpaper(load('wallpaper', "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920"));
    setDesktopApps(load('desktop_apps', INITIAL_DESKTOP).map((app: any) => ({ ...app, icon: APP_INFO[app.id as AppId]?.icon || Globe })));
    
    const savedWifi = load('wifi', "Nebula_Secure_5G");
    setCurrentWifi(savedWifi);
    setIsOnline(savedWifi !== OFFLINE_WIFI);

    const savedVol = load('volume', "75");
    setVolumeState(parseInt(savedVol));

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
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w));
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
    setFileSystem(prev => [...prev, newFolder]);
  };

  const deleteItem = (id: string) => {
    setFileSystem(prev => prev.filter(item => item.id !== id));
  };

  const updateDesktopAppPosition = (id: AppId, x: number, y: number) => {
    const updated = desktopApps.map(app => app.id === id ? { ...app, x, y } : app);
    setDesktopApps(updated);
    // Sanitize for storage (remove icon components)
    const stored = updated.map(({ icon, ...app }) => app);
    saveSetting('desktop_apps', stored);
  };

  const toggleDesktopApp = (id: AppId) => {
    const exists = desktopApps.find(app => app.id === id);
    if (exists) {
      const updated = desktopApps.filter(app => app.id !== id);
      setDesktopApps(updated);
      saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
    } else {
      const info = APP_INFO[id];
      const newApp = { 
        id, 
        label: info.label, 
        icon: info.icon, 
        x: 20, 
        y: 20 + (desktopApps.length * 110) 
      };
      const updated = [...desktopApps, newApp];
      setDesktopApps(updated);
      saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
    }
  };

  return (
    <OSContext.Provider value={{
      currentUser,
      accounts,
      openWindows,
      activeWindowId,
      installedApps,
      fileSystem,
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
      currentWifi,
      isWifiConnecting,
      isOnline,
      volume,
      login,
      logout,
      createAccount,
      openApp,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
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
      connectToWifi,
      setVolume,
      restart,
      shutDown,
      powerOn,
      createFolder,
      deleteItem,
      updateDesktopAppPosition,
      toggleDesktopApp
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
