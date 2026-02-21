
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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
  Info,
  ShieldCheck,
  Zap,
  Wifi,
  Gamepad2,
  Bomb,
  File as FileIcon,
  Image as ImageIcon,
  RefreshCw,
  Skull,
  ShieldAlert
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser' | 'trash' | 'news' | 'maps' | 'monitor' | 'calendar' | 'snake' | 'minesweeper' | 'image-viewer' | 'update' | 'virus';
export type ThemeMode = 'dark' | 'light';
export type PowerStatus = 'on' | 'off' | 'booting';
export type TaskbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type TaskbarSize = number;
export type DesktopIconSize = number;
export type AccentColor = 'default' | 'blue' | 'purple' | 'rose' | 'orange' | 'green' | 'grey' | 'custom';
export type CursorColor = 'black' | 'white' | 'accent';

export interface LocalUser {
  id: string;
  username: string;
  avatarColor: string;
  password?: string;
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
  displayId: string; 
  x: number;
  y: number;
  params?: any;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  size?: number;
}

export interface DesktopShortcut {
  id: AppId;
  label: string;
  icon: any;
  x: number;
  y: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'system' | 'news' | 'security' | 'app';
}

export type DisplayDirection = 'left' | 'right' | 'top' | 'bottom';

export interface DisplayLayout {
  [displayId: string]: {
    [direction in DisplayDirection]?: string; 
  };
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
  notifications: SystemNotification[];
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
  isStartOpen: boolean;
  systemStats: { cpu: number; ram: number; net: number };
  currentDisplayId: string;
  displayLayout: DisplayLayout;
  isSecurityEnabled: boolean;
  
  login: (userId: string, password?: string) => boolean;
  logout: () => void;
  createAccount: (username: string, password?: string) => void;
  updateUserPassword: (password: string) => void;
  openApp: (appId: AppId, title: string, params?: any) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  snapWindow: (windowId: string, side: 'left' | 'right' | null) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number, displayId?: string) => void;
  moveWindowToDisplay: (windowId: string, displayId: string) => void;
  updateDisplayLayout: (fromId: string, direction: DisplayDirection, toId: string) => void;
  resetDisplayLayout: () => void;
  installApp: (appId: AppId) => void;
  addNotification: (title: string, message: string, type?: SystemNotification['type']) => void;
  clearNotifications: () => void;
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
  setIsStartOpen: (isOpen: boolean) => void;
  setCurrentDisplayId: (id: string) => void;
  setSecurityEnabled: (enabled: boolean) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  minimizeAllWindows: () => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  importFile: (name: string, content: string, size: number, parentId: string | null) => void;
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
  'snake': { icon: Gamepad2, label: 'Nebula Snake' },
  'minesweeper': { icon: Bomb, label: 'Minesweeper' },
  'image-viewer': { icon: ImageIcon, label: 'Image Viewer' },
  'update': { icon: RefreshCw, label: 'System Update' },
  'virus': { icon: Skull, label: 'CRITICAL_THREAT' },
};

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
];

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: PADDING, y: PADDING },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: PADDING, y: PADDING + GRID_Y },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: PADDING, y: PADDING + (GRID_Y * 2) },
  { id: 'news', label: 'Nebula News', icon: Newspaper, x: PADDING, y: PADDING + (GRID_Y * 3) },
  { id: 'trash', label: 'Recycling Bin', icon: Trash2, x: PADDING, y: PADDING + (GRID_Y * 4) },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser', 'trash', 'news', 'maps', 'monitor', 'calendar', 'snake', 'minesweeper', 'update'];
const INITIAL_PINNED: AppId[] = ['files', 'store', 'assistant', 'browser', 'settings', 'monitor'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a'];
const OFFLINE_WIFI = "Public_Guest_No_Internet";

export const OSProvider = ({ children }: { children: ReactNode }) => {
  // Core Identity
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  
  // Power & Performance
  const [powerStatus, setPowerStatus] = useState<PowerStatus>('booting');
  const [systemStats, setSystemStats] = useState({ cpu: 12, ram: 42, net: 2 });

  // Window Management
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Shell Visibility
  const [isWidgetsOpen, setIsWidgetsOpenState] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpenState] = useState(false);
  const [isStartOpen, setIsStartOpenState] = useState(false);

  // Desktop Content
  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [pinnedApps, setPinnedApps] = useState<AppId[]>(INITIAL_PINNED);
  const [desktopApps, setDesktopApps] = useState<DesktopShortcut[]>(INITIAL_DESKTOP);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // Personalization
  const [wallpaper, setWallpaperState] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('purple');
  const [customAccentHex, setCustomAccentHexState] = useState("#9333ea");
  const [cursorColor, setCursorColorState] = useState<CursorColor>('black');
  const [isInverted, setInvertedState] = useState(false);
  const [glassEnabled, setGlassEnabledState] = useState(true);
  const [brightness, setBrightnessState] = useState(100);
  const [volume, setVolumeState] = useState(75);

  // Physical Layout
  const [taskbarPosition, setTaskbarPositionState] = useState<TaskbarPosition>('bottom');
  const [taskbarSize, setTaskbarSizeState] = useState<number>(48);
  const [iconSize, setIconSizeState] = useState<number>(100);

  // Networking
  const [currentWifi, setCurrentWifiState] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Virtual Storage
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [trash, setTrash] = useState<FileSystemItem[]>([]);
  const [notes, setNotesInternal] = useState("");

  // Multi-Display Environment
  const [currentDisplayId, setDisplayIdState] = useState('1');
  const [displayLayout, setDisplayLayoutState] = useState<DisplayLayout>({ '1': { right: '2' }, '2': { left: '1' } });

  // Kernel Security
  const [isSecurityEnabled, setSecurityEnabledState] = useState(true);

  // --- PERSISTENCE HELPERS ---

  const saveSetting = useCallback((key: string, value: any) => {
    if (currentUser) {
      const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(`nebula_${currentUser.id}_${key}`, strValue);
    }
  }, [currentUser]);

  // --- ACTIONS ---

  const login = (userId: string, password?: string): boolean => {
    const user = accounts.find(a => a.id === userId);
    if (user) {
      if (user.password && user.password !== password) return false;
      setCurrentUser(user);
      localStorage.setItem('nebula_current_user_id', userId);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nebula_current_user_id');
    setOpenWindows([]);
    setActiveWindowId(null);
  };

  const createAccount = (username: string, password?: string) => {
    const newAcc: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatarColor: AVATAR_COLORS[accounts.length % AVATAR_COLORS.length],
      password: password || undefined
    };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem('nebula_accounts', JSON.stringify(updated));
    login(newAcc.id, password);
  };

  const updateUserPassword = (password: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, password };
    setCurrentUser(updatedUser);
    const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
    setAccounts(updatedAccounts);
    localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
    addNotification("Security Updated", "Your account password has been changed.", "security");
  };

  const addNotification = useCallback((title: string, message: string, type: SystemNotification['type'] = 'system') => {
    const newNotif: SystemNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title, message, type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setNotifications(prev => {
      const updated = [newNotif, ...prev].slice(0, 50);
      saveSetting('notifications', updated);
      return updated;
    });

    if (currentDisplayId === '1') {
      toast({ title, description: message });
    }
  }, [currentDisplayId, currentUser, saveSetting]);

  const clearNotifications = () => {
    setNotifications([]);
    saveSetting('notifications', []);
  };

  const openApp = (appId: AppId, title: string, params?: any) => {
    const existing = openWindows.find(w => w.appId === appId && JSON.stringify(w.params) === JSON.stringify(params));
    if (existing) {
      focusWindow(existing.id);
      if (existing.isMinimized) {
        const updated = openWindows.map(w => w.id === existing.id ? { ...w, isMinimized: false, displayId: currentDisplayId } : w);
        setOpenWindows(updated);
        saveSetting('windows', updated);
      }
      return;
    }

    let initialWidth = 800, initialHeight = 600;
    if (appId === 'calc') { initialWidth = 320; initialHeight = 480; }
    else if (appId === 'terminal') { initialWidth = 700; initialHeight = 450; }
    else if (appId === 'notes') { initialWidth = 500; initialHeight = 600; }
    else if (appId === 'assistant') { initialWidth = 400; initialHeight = 650; }
    else if (appId === 'trash') { initialWidth = 600; initialHeight = 400; }
    else if (appId === 'news') { initialWidth = 900; initialHeight = 700; }
    else if (appId === 'maps') { initialWidth = 950; initialHeight = 650; }
    else if (appId === 'monitor') { initialWidth = 700; initialHeight = 500; }
    else if (appId === 'calendar') { initialWidth = 850; initialHeight = 600; }
    else if (appId === 'snake') { initialWidth = 400; initialHeight = 500; }
    else if (appId === 'minesweeper') { initialWidth = 350; initialHeight = 450; }
    else if (appId === 'image-viewer') { initialWidth = 600; initialHeight = 500; }
    else if (appId === 'update') { initialWidth = 500; initialHeight = 400; }
    else if (appId === 'virus') { initialWidth = 300; initialHeight = 250; }

    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowInstance = {
      id: newId, appId, title, isMinimized: false, isMaximized: false, zIndex: nextZIndex,
      initialWidth, initialHeight, displayId: currentDisplayId,
      x: appId === 'virus' ? (Math.random() * (window.innerWidth - 300)) : 100 + (openWindows.length * 20),
      y: appId === 'virus' ? (Math.random() * (window.innerHeight - 250)) : 50 + (openWindows.length * 20),
      params
    };

    const updated = [...openWindows, newWindow];
    setOpenWindows(updated);
    setActiveWindowId(newId);
    setNextZIndex(prev => prev + 1);
    saveSetting('windows', updated);
  };

  const closeWindow = (windowId: string) => {
    const updated = openWindows.filter(w => w.id !== windowId);
    setOpenWindows(updated);
    if (activeWindowId === windowId) setActiveWindowId(null);
    saveSetting('windows', updated);
  };

  const minimizeWindow = (windowId: string) => {
    const updated = openWindows.map(w => w.id === windowId ? { ...w, isMinimized: true } : w);
    setOpenWindows(updated);
    setActiveWindowId(null);
    saveSetting('windows', updated);
  };

  const maximizeWindow = (windowId: string) => {
    const updated = openWindows.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized, isSnapped: null } : w);
    setOpenWindows(updated);
    saveSetting('windows', updated);
  };

  const snapWindow = (windowId: string, side: 'left' | 'right' | null) => {
    const updated = openWindows.map(w => w.id === windowId ? { ...w, isSnapped: side, isMaximized: false } : w);
    setOpenWindows(updated);
    saveSetting('windows', updated);
  };

  const focusWindow = (windowId: string) => {
    setActiveWindowId(windowId);
    const updated = openWindows.map(w => w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w);
    setOpenWindows(updated);
    setNextZIndex(prev => prev + 1);
    saveSetting('windows', updated);
  };

  const updateWindowPosition = (windowId: string, x: number, y: number, displayId?: string) => {
    const updated = openWindows.map(w => w.id === windowId ? { ...w, x, y, displayId: displayId || w.displayId } : w);
    setOpenWindows(updated);
    saveSetting('windows', updated);
  };

  const moveWindowToDisplay = (windowId: string, displayId: string) => {
    const updated = openWindows.map(w => w.id === windowId ? { ...w, displayId } : w);
    setOpenWindows(updated);
    saveSetting('windows', updated);
  };

  const setNotes = (content: string) => {
    if (!isOnline) return;
    setNotesInternal(content);
    saveSetting('notes', content);
  };

  const setTheme = (theme: ThemeMode) => {
    setThemeState(theme);
    saveSetting('theme', theme);
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
    setInvertedState(inverted);
    saveSetting('inverted', inverted);
  };

  const setGlassEnabled = (enabled: boolean) => {
    setGlassEnabledState(enabled);
    saveSetting('glass', enabled);
  };

  const setTaskbarPosition = (pos: TaskbarPosition) => {
    setTaskbarPositionState(pos);
    saveSetting('taskbar_pos', pos);
  };

  const setTaskbarSize = (size: number) => {
    setTaskbarSizeState(size);
    saveSetting('taskbar_size', size);
  };

  const setIconSize = (size: number) => {
    setIconSizeState(size);
    saveSetting('icon_size', size);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    saveSetting('volume', v);
  };

  const setBrightness = (b: number) => {
    setBrightnessState(b);
    saveSetting('brightness', b);
  };

  const setIsWidgetsOpen = (isOpen: boolean) => {
    setIsWidgetsOpenState(isOpen);
    if (isOpen) { setIsStartOpenState(false); setIsQuickSettingsOpenState(false); }
  };

  const setIsQuickSettingsOpen = (isOpen: boolean) => {
    setIsQuickSettingsOpenState(isOpen);
    if (isOpen) { setIsStartOpenState(false); setIsWidgetsOpenState(false); }
  };

  const setIsStartOpen = (isOpen: boolean) => {
    setIsStartOpenState(isOpen);
    if (isOpen) { setIsQuickSettingsOpenState(false); setIsWidgetsOpenState(false); }
  };

  const connectToWifi = (ssid: string) => {
    setIsWifiConnecting(true);
    setTimeout(() => {
      setCurrentWifiState(ssid);
      setIsOnline(ssid !== OFFLINE_WIFI);
      setIsWifiConnecting(false);
      saveSetting('wifi', ssid);
      addNotification("WiFi Connected", `Successfully joined ${ssid}.`, 'system');
    }, 2000);
  };

  const setSecurityEnabled = (enabled: boolean) => {
    setSecurityEnabledState(enabled);
    saveSetting('security_enabled', enabled);
    if (enabled) {
      const updated = openWindows.filter(w => w.appId !== 'virus');
      setOpenWindows(updated);
      saveSetting('windows', updated);
      addNotification("Security Restored", "Nebula Defender has quarantined all active threats.", 'security');
    } else {
      addNotification("Security Risk", "Nebula Defender has been disabled. System vulnerability detected.", 'security');
    }
  };

  const setCurrentDisplayId = (id: string) => {
    setDisplayIdState(id);
    if (currentUser) sessionStorage.setItem(`nebula_${currentUser.id}_display_id`, id);
  };

  const updateDisplayLayout = (fromId: string, direction: DisplayDirection, toId: string) => {
    const updated = { ...displayLayout };
    const reverseMap: Record<DisplayDirection, DisplayDirection> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
    const revDir = reverseMap[direction];

    if (toId !== 'none') {
      if (!updated[fromId]) updated[fromId] = {};
      const oldToId = updated[fromId][direction];
      if (oldToId && updated[oldToId]) delete updated[oldToId][revDir];
      updated[fromId][direction] = toId;
      if (!updated[toId]) updated[toId] = {};
      updated[toId][revDir] = fromId;
    } else {
      if (updated[fromId]) {
        const oldToId = updated[fromId][direction];
        delete updated[fromId][direction];
        if (oldToId && updated[oldToId]) delete updated[oldToId][revDir];
      }
    }
    setDisplayLayoutState(updated);
    saveSetting('display_layout', updated);
  };

  const resetDisplayLayout = () => {
    setDisplayLayoutState({});
    saveSetting('display_layout', {});
    addNotification("Display Reset", "All multi-display configurations cleared.", 'system');
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

  const minimizeAllWindows = () => {
    const updated = openWindows.map(w => ({ ...w, isMinimized: true }));
    setOpenWindows(updated);
    setActiveWindowId(null);
    saveSetting('windows', updated);
  };

  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'folder', parentId };
    const updated = [...fileSystem, newFolder];
    setFileSystem(updated);
    saveSetting('file_system', updated);
  };

  const importFile = (name: string, content: string, size: number, parentId: string | null) => {
    const newFile: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'file', parentId, content, size };
    const updated = [...fileSystem, newFile];
    setFileSystem(updated);
    saveSetting('file_system', updated);
    addNotification("File Imported", `${name} added to drive.`, 'app');
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

  const installApp = (appId: AppId) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps(prev => [...prev, appId]);
      addNotification("App Installed", `${APP_INFO[appId].label} added to Start Menu.`, 'app');
    }
  };

  const updateDesktopAppPosition = (id: AppId, x: number, y: number) => {
    const snappedX = Math.round((x - PADDING) / GRID_X) * GRID_X + PADDING;
    const snappedY = Math.round((y - PADDING) / GRID_Y) * GRID_Y + PADDING;
    if (desktopApps.some(app => app.id !== id && app.x === snappedX && app.y === snappedY)) return;
    const updated = desktopApps.map(app => app.id === id ? { ...app, x: snappedX, y: snappedY } : app);
    setDesktopApps(updated);
    saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
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
      let foundX = PADDING, foundY = PADDING, col = 0, row = 0, isOccupied = true;
      while (isOccupied) {
        foundX = PADDING + (col * GRID_X);
        foundY = PADDING + (row * GRID_Y);
        isOccupied = desktopApps.some(app => app.x === foundX && app.y === foundY);
        if (isOccupied) { row++; if (row > 6) { row = 0; col++; } }
      }
      const newApp = { id, label: info.label, icon: info.icon, x: foundX, y: foundY };
      const updated = [...desktopApps, newApp];
      setDesktopApps(updated);
      saveSetting('desktop_apps', updated.map(({ icon, ...app }) => app));
    }
  };

  const togglePinApp = (id: AppId) => {
    const isPinned = pinnedApps.includes(id);
    const updated = isPinned ? pinnedApps.filter(appId => appId !== id) : [...pinnedApps, id];
    setPinnedApps(updated);
    saveSetting('pinned_apps', updated);
  };

  const reorderPinnedApps = (newOrder: AppId[]) => {
    setPinnedApps(newOrder);
    saveSetting('pinned_apps', newOrder);
  };

  const updateWallpaper = (url: string) => {
    setWallpaperState(url);
    saveSetting('wallpaper', url);
  };

  return (
    <OSContext.Provider value={{
      currentUser, accounts, openWindows, activeWindowId, installedApps, pinnedApps,
      fileSystem, trash, desktopApps, notifications, wallpaper, notes, theme, accentColor,
      customAccentHex, cursorColor, isInverted, glassEnabled, powerStatus,
      taskbarPosition, taskbarSize, iconSize, currentWifi, isWifiConnecting,
      isOnline, volume, brightness, isWidgetsOpen, isQuickSettingsOpen, 
      isStartOpen, systemStats,
      currentDisplayId, displayLayout, isSecurityEnabled,
      login, logout, createAccount, updateUserPassword, openApp, closeWindow, minimizeWindow,
      maximizeWindow, snapWindow, focusWindow, updateWindowPosition, moveWindowToDisplay,
      updateDisplayLayout, resetDisplayLayout, installApp, addNotification, clearNotifications,
      updateWallpaper, setNotes, setTheme, setAccentColor, setCustomAccentHex,
      setCursorColor, setInverted, setGlassEnabled, setTaskbarPosition, setTaskbarSize,
      setIconSize, connectToWifi, setVolume, setBrightness, setIsWidgetsOpen,
      setIsQuickSettingsOpen, setIsStartOpen, setCurrentDisplayId, setSecurityEnabled, restart, shutDown, powerOn,
      minimizeAllWindows,
      createFolder, importFile, moveToTrash, restoreFromTrash, emptyTrash, deleteItemPermanently,
      updateDesktopAppPosition, toggleDesktopApp, togglePinApp, reorderPinnedApps,
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
