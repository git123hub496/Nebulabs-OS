
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser';
export type ThemeMode = 'dark' | 'light';
export type PowerStatus = 'on' | 'off' | 'booting';
export type TaskbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type AccentColor = 'default' | 'blue' | 'purple' | 'rose' | 'orange' | 'green';

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

interface OSContextType {
  currentUser: LocalUser | null;
  accounts: LocalUser[];
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  installedApps: AppId[];
  fileSystem: FileSystemItem[];
  wallpaper: string;
  notes: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  powerStatus: PowerStatus;
  taskbarPosition: TaskbarPosition;
  currentWifi: string;
  isWifiConnecting: boolean;
  
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
  setTaskbarPosition: (position: TaskbarPosition) => void;
  connectToWifi: (ssid: string) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  deleteItem: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a'];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
  const [notes, setNotesState] = useState("");
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('purple');
  const [powerStatus, setPowerStatus] = useState<PowerStatus>('booting');
  const [taskbarPosition, setTaskbarPositionState] = useState<TaskbarPosition>('bottom');
  const [currentWifi, setCurrentWifi] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Load accounts on initial mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('nebula_accounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      // Create a default guest account if none exists
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

  // Sync user-specific data whenever the current user changes
  useEffect(() => {
    if (!currentUser) return;

    const uid = currentUser.id;
    const savedNotes = localStorage.getItem(`nebula_${uid}_notes`);
    setNotesState(savedNotes || "");
    
    const savedTheme = localStorage.getItem(`nebula_${uid}_theme`) as ThemeMode;
    setThemeState(savedTheme || 'dark');

    const savedAccent = localStorage.getItem(`nebula_${uid}_accent`) as AccentColor;
    setAccentColorState(savedAccent || 'purple');

    const savedPosition = localStorage.getItem(`nebula_${uid}_taskbar_pos`) as TaskbarPosition;
    setTaskbarPositionState(savedPosition || 'bottom');

    const savedWallpaper = localStorage.getItem(`nebula_${uid}_wallpaper`);
    setWallpaper(savedWallpaper || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");

    const savedWifi = localStorage.getItem(`nebula_${uid}_wifi`);
    setCurrentWifi(savedWifi || "Nebula_Secure_5G");

  }, [currentUser]);

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
    setNotesState(content);
    if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_notes`, content);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_theme`, newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_accent`, color);
  };

  const setTaskbarPosition = (position: TaskbarPosition) => {
    setTaskbarPositionState(position);
    if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_taskbar_pos`, position);
  };

  const connectToWifi = (ssid: string) => {
    setIsWifiConnecting(true);
    setTimeout(() => {
      setCurrentWifi(ssid);
      setIsWifiConnecting(false);
      if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_wifi`, ssid);
    }, 2000);
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
    if (currentUser) localStorage.setItem(`nebula_${currentUser.id}_wallpaper`, url);
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

  return (
    <OSContext.Provider value={{
      currentUser,
      accounts,
      openWindows,
      activeWindowId,
      installedApps,
      fileSystem,
      wallpaper,
      notes,
      theme,
      accentColor,
      powerStatus,
      taskbarPosition,
      currentWifi,
      isWifiConnecting,
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
      setTaskbarPosition,
      connectToWifi,
      restart,
      shutDown,
      powerOn,
      createFolder,
      deleteItem
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
