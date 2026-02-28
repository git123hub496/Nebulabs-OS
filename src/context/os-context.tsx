
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
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
  ImageIcon,
  RefreshCw,
  Skull,
  ShieldAlert,
  Palette,
  Monitor,
  Camera as CameraIcon,
  Presentation as PresentationIcon,
  Mail as MailIcon,
  GraduationCap,
  Smile,
  Home,
  Layers,
  Folder,
  Search,
  Store,
  Tv,
  StickyNote as StickyNoteIcon,
  Code2,
  Braces,
  Type,
  Car,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { respondToEmail } from '@/ai/flows/mail-ai-flow';
import { respondToChat } from '@/ai/flows/chat-ai-flow';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser' | 'trash' | 'news' | 'maps' | 'monitor' | 'calendar' | 'snake' | 'minesweeper' | 'image-viewer' | 'update' | 'virus' | 'paint' | 'info' | 'camera' | 'slides' | 'mail' | 'nebula-v' | 'google-search' | 'shop' | 'screencast' | 'sticky-notes' | 'nde' | 'docs' | 'go';
export type ThemeMode = 'dark' | 'light';
export type PowerStatus = 'on' | 'off' | 'booting';
export type TaskbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type TaskbarSize = number;
export type DesktopIconSize = number;
export type AccentColor = 'default' | 'blue' | 'purple' | 'rose' | 'orange' | 'green' | 'grey' | 'custom';
export type CursorColor = 'black' | 'white' | 'accent';
export type CursorShape = 'nebula' | 'windows' | 'macos' | 'custom';

export interface LocalUser {
  id: string;
  username: string;
  avatarColor: string;
  avatarUrl?: string;
  password?: string;
  isWorkAccount?: boolean;
  isSchoolAccount?: boolean;
  isKidAccount?: boolean;
  isGuest?: boolean;
  districtId?: string;
  uniqueCode?: string;
}

export type EmailFolder = 'inbox' | 'sent' | 'archive' | 'trash';

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isSystem?: boolean;
  folder: EmailFolder;
}

export interface ChatMessage {
  id: string;
  sender: string;
  recipient?: string; 
  text: string;
  timestamp: string;
  isBot: boolean;
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
  isSystem?: boolean;
}

export interface DesktopShortcut {
  id: AppId;
  label: string;
  icon: any;
  x: number;
  y: number;
}

export interface StickyNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
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

export interface BIOSSettings {
  cpuTurbo: boolean;
  networkStack: boolean;
  secureBoot: boolean;
  fastBoot: boolean;
  virtualization: boolean;
  deviceType: 'NebulaBook' | 'Nebula-PC';
  deviceName: string;
  integratedGfx: boolean;
  acLossPolicy: 'Power On' | 'Stay Off' | 'Last State';
  wakeOnLan: boolean;
  isLite: boolean;
}

export interface StartMenuItem {
  id: string;
  type: 'app' | 'folder';
  appId?: AppId;
  folder?: {
    id: string;
    name: string;
    apps: AppId[];
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
  stickyNotes: StickyNote[];
  emails: Email[];
  markEmailRead: (id: string) => void;
  sendEmail: (to: string, subject: string, content: string) => Promise<void>;
  archiveEmail: (id: string) => void;
  deleteEmail: (id: string) => void;
  restoreEmail: (id: string) => void;
  permanentlyDeleteEmail: (id: string) => void;
  wallpaper: string;
  notes: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  customAccentHex: string;
  cursorColor: CursorColor;
  cursorShape: CursorShape;
  customCursorUrl: string;
  mouserScale: number;
  isInverted: boolean;
  isGrayscale: boolean;
  glassEnabled: boolean;
  powerStatus: PowerStatus;
  taskbarPosition: TaskbarPosition;
  taskbarSize: TaskbarSize;
  taskbarTransparency: number;
  appTransparency: number;
  isTaskbarAutoHide: boolean;
  setTaskbarAutoHide: (enabled: boolean) => void;
  iconSize: DesktopIconSize;
  currentWifi: string;
  isWifiConnecting: boolean;
  isOnline: boolean;
  volume: number;
  brightness: number;
  isWidgetsOpen: boolean;
  isQuickSettingsOpen: boolean;
  isStartOpen: boolean;
  isChatOpen: boolean;
  isLocked: boolean;
  isNDEEnabled: boolean;
  systemStats: { cpu: number; ram: number; net: number };
  currentDisplayId: string;
  displayLayout: DisplayLayout;
  isSecurityEnabled: boolean;
  chatMessages: ChatMessage[];
  biosSettings: BIOSSettings;
  startMenuLayout: StartMenuItem[];
  globalScale: number;
  
  userLocation: { lat: number, lon: number } | null;
  locationName: string;
  weatherData: { temp: number, condition: string } | null;
  requestLocation: () => Promise<void>;
  
  login: (userId: string, password?: string) => boolean;
  loginGuest: () => void;
  logout: () => void;
  lock: () => void;
  unlock: (password?: string) => boolean;
  createAccount: (username: string, password?: string, isSchool?: boolean, isWork?: boolean, isKid?: boolean, districtId?: string) => void;
  deleteAccount: (userId: string) => void;
  updateUserPassword: (password: string) => void;
  resetUserPassword: (userId: string, password: string) => void;
  updateUserAvatar: (url: string) => void;
  updateUserWorkStatus: (enabled: boolean) => void;
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
  uninstallApp: (appId: AppId) => void;
  addNotification: (title: string, message: string, type?: SystemNotification['type']) => void;
  clearNotifications: () => void;
  updateWallpaper: (url: string) => void;
  setNotes: (content: string) => void;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setCustomAccentHex: (hex: string) => void;
  setCursorColor: (color: CursorColor) => void;
  setCursorShape: (shape: CursorShape) => void;
  setCustomCursorUrl: (url: string) => void;
  setMouserScale: (scale: number) => void;
  setInverted: (inverted: boolean) => void;
  setGrayscale: (grayscale: boolean) => void;
  setGlassEnabled: (enabled: boolean) => void;
  setTaskbarPosition: (position: TaskbarPosition) => void;
  rotateTaskbar: () => void;
  setTaskbarSize: (size: TaskbarSize) => void;
  setTaskbarTransparency: (t: number) => void;
  setAppTransparency: (t: number) => void;
  setIconSize: (size: DesktopIconSize) => void;
  connectToWifi: (ssid: string) => void;
  setVolume: (v: number) => void;
  setBrightness: (b: number) => void;
  setIsWidgetsOpen: (isOpen: boolean) => void;
  setIsQuickSettingsOpen: (isOpen: boolean) => void;
  setIsStartOpen: (isOpen: boolean) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  setIsNDEEnabled: (enabled: boolean) => void;
  sendChatMessage: (text: string, recipient: string, role: string) => Promise<void>;
  setCurrentDisplayId: (id: string) => void;
  setSecurityEnabled: (enabled: boolean) => void;
  updateBIOSSettings: (settings: Partial<BIOSSettings>) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  minimizeAllWindows: () => void;
  playSound: (type: 'click' | 'open' | 'close' | 'notify') => void;
  setGlobalScale: (scale: number) => void;
  factoryReset: () => void;
  setSystemStats: (stats: Partial<{ cpu: number; ram: number; net: number }>) => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  importFile: (name: string, content: string, size: number, parentId: string | null) => void;
  renameFileSystemItem: (id: string, newName: string) => void;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  emptyTrash: () => void;
  deleteItemPermanently: (id: string) => void;
  
  updateDesktopAppPosition: (id: AppId, x: number, y: number) => void;
  toggleDesktopApp: (id: AppId) => void;
  togglePinApp: (id: AppId) => void;
  reorderPinnedApps: (newOrder: AppId[]) => void;

  reorderStartMenu: (newLayout: StartMenuItem[]) => void;
  createStartFolder: (name: string, firstAppId: AppId, secondAppId: AppId) => void;
  addAppToStartFolder: (appId: AppId, folderId: string) => void;
  removeAppFromStartFolder: (appId: AppId, folderId: string) => void;
  renameStartFolder: (folderId: string, newName: string) => void;
  deleteStartFolder: (folderId: string) => void;

  createStickyNote: () => void;
  updateStickyNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteStickyNote: (id: string) => void;
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
  'image-viewer': { icon: FileIcon, label: 'Image Viewer' },
  'update': { icon: RefreshCw, label: 'System Update' },
  'virus': { icon: Skull, label: 'CRITICAL_THREAT' },
  'paint': { icon: Palette, label: 'Nebula Paint' },
  'info': { icon: Info, label: 'System Info' },
  'camera': { icon: CameraIcon, label: 'Nebula Camera' },
  'slides': { icon: PresentationIcon, label: 'Nebula Slides' },
  'mail': { icon: MailIcon, label: 'NebulaMail' },
  'nebula-v': { icon: Layers, label: 'Nebula-V' },
  'google-search': { icon: Search, label: 'Nebula Search' },
  'shop': { icon: Store, label: 'Shop Nebulabs' },
  'screencast': { icon: Tv, label: 'Nebula Cast' },
  'sticky-notes': { icon: StickyNoteIcon, label: 'Sticky Notes' },
  'nde': { icon: Code2, label: 'NDE Dev Tool' },
  'docs': { icon: Type, label: 'Nebula Docs' },
  'go': { icon: Car, label: 'Nebula Go' },
};

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null, content: '# Nebula WebOS\nProprietary Kernel v4.5.2 stable.' },
  { id: 'sys', name: 'System', type: 'folder', parentId: null, isSystem: true },
  { id: 'kernel', name: 'kernel.sys', type: 'file', parentId: 'sys', size: 1048576, content: '[BINARY_DATA_ENCRYPTED]', isSystem: true },
  { id: 'cfg', name: 'config', type: 'folder', parentId: 'sys', isSystem: true },
  { id: 'reg', name: 'registry.dat', type: 'file', parentId: 'cfg', size: 4096, content: '{"version": "4.5.2", "status": "active"}', isSystem: true },
  { id: 'drv', name: 'drivers', type: 'folder', parentId: 'sys', isSystem: true },
  { id: 'gfx', name: 'display.drv', type: 'file', parentId: 'drv', size: 524288, isSystem: true },
  { id: 'log', name: 'logs', type: 'folder', parentId: 'sys', isSystem: true },
  { id: 'boot', name: 'boot.log', type: 'file', parentId: 'log', size: 2048, content: '[10:00:01] BIOS check OK\n[10:00:02] GPU drivers loaded\n[10:00:05] Kernel Handshake active', isSystem: true },
];

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'google-search', label: 'Nebula Search', icon: Search, x: PADDING, y: PADDING },
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: PADDING, y: PADDING + GRID_Y },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: PADDING, y: PADDING + (GRID_Y * 2) },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: PADDING, y: PADDING + (GRID_Y * 3) },
];

const FULL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser', 'trash', 'news', 'maps', 'monitor', 'calendar', 'snake', 'minesweeper', 'update', 'paint', 'info', 'camera', 'slides', 'mail', 'nebula-v', 'google-search', 'shop', 'screencast', 'sticky-notes', 'nde', 'docs', 'go'];
const LITE_APPS: AppId[] = ['files', 'settings', 'browser', 'notes', 'calc', 'trash', 'info', 'sticky-notes'];

const FULL_PINNED: AppId[] = ['files', 'store', 'shop', 'assistant', 'google-search', 'browser', 'settings', 'mail', 'sticky-notes', 'docs', 'go'];
const LITE_PINNED: AppId[] = ['files', 'browser', 'settings', 'notes'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a', '#ec4899', '#06b6d4'];
const OFFLINE_WIFI = "Public_Guest_No_Internet";

const getWeatherCondition = (code: number) => {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Variable";
};

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  const [powerStatus, setPowerStatusState] = useState<PowerStatus>('booting');
  const [systemStats, setSystemStatsState] = useState({ cpu: 12, ram: 42, net: 2 });
  const [systemLoad, setSystemLoad] = useState({ cpu: 0, net: 0 }); // Spikes
  const [isLocked, setIsLocked] = useState(false);
  const [isNDEEnabled, setIsNDEEnabledState] = useState(false);

  const [isWidgetsOpen, setIsWidgetsOpenState] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpenState] = useState(false);
  const [isStartOpenState, setIsStartOpenState] = useState(false);
  const [isChatOpen, setIsChatOpenState] = useState(false);

  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  const [wallpaper, setWallpaperState] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('purple');
  const [customAccentHex, setCustomAccentHexState] = useState("#9333ea");
  const [cursorColor, setCursorColorState] = useState<CursorColor>('black');
  const [cursorShape, setCursorShapeState] = useState<CursorShape>('nebula');
  const [customCursorUrl, setCustomCursorUrlState] = useState<string>("");
  const [mouserScale, setMouserScaleState] = useState<number>(1.0);
  const [isInverted, setInvertedState] = useState(false);
  const [isGrayscale, setGrayscaleState] = useState(false);
  const [glassEnabled, setGlassEnabledState] = useState(true);
  const [brightness, setBrightnessState] = useState(100);
  const [volume, setVolumeState] = useState(75);

  const [taskbarPosition, setTaskbarPositionState] = useState<TaskbarPosition>('bottom');
  const [taskbarSize, setTaskbarSizeState] = useState<number>(48);
  const [taskbarTransparency, setTaskbarTransparencyState] = useState<number>(80);
  const [appTransparency, setAppTransparencyState] = useState<number>(80);
  const [isTaskbarAutoHide, setTaskbarAutoHideState] = useState<boolean>(false);
  const [iconSize, setIconSizeState] = useState<number>(100);
  const [globalScale, setGlobalScaleState] = useState<number>(1.0);

  const [installedApps, setInstalledApps] = useState<AppId[]>([]);
  const [pinnedApps, setPinnedApps] = useState<AppId[]>([]);
  const [desktopApps, setDesktopApps] = useState<DesktopShortcut[]>(INITIAL_DESKTOP);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [trash, setTrash] = useState<FileSystemItem[]>([]);
  const [notes, setNotesInternal] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Nebulabs Onboarding', text: 'Welcome to your internal chat workspace.', timestamp: '10:00 AM', isBot: true }
  ]);

  const [currentWifi, setCurrentWifiState] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentDisplayId, setDisplayIdState] = useState('1');
  const [displayLayout, setDisplayLayoutState] = useState<DisplayLayout>({ '1': { right: '2' }, '2': { left: '1' } });
  const [isSecurityEnabled, setSecurityEnabledState] = useState(true);

  const [startMenuLayout, setStartMenuLayout] = useState<StartMenuItem[]>([]);

  const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("Locating...");
  const [weatherData, setWeatherData] = useState<{ temp: number, condition: string } | null>(null);

  const [biosSettings, setBiosSettings] = useState<BIOSSettings>({
    cpuTurbo: true,
    networkStack: true,
    secureBoot: true,
    fastBoot: false,
    virtualization: false,
    deviceType: 'NebulaBook',
    deviceName: 'SuperNova',
    integratedGfx: true,
    acLossPolicy: 'Stay Off',
    wakeOnLan: false,
    isLite: false
  });

  const playSound = useCallback((type: 'click' | 'open' | 'close' | 'notify') => {
    if (typeof window === 'undefined') return;
    const urls = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      open: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
      close: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
      notify: 'https://assets.mixkit.co/active_storage/sfx/2350/2350-preview.mp3'
    };
    try {
      const audio = new Audio(urls[type]);
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  // System Stats Realism Logic
  useEffect(() => {
    if (powerStatus !== 'on') return;

    const statsInterval = setInterval(() => {
      // Baseline calculation
      const windowCount = openWindows.length;
      const baseRam = Math.min(95, 20 + (windowCount * 8) + (Math.random() * 5));
      const baseCpu = Math.min(90, 5 + (windowCount * 4) + (Math.random() * 3));
      const baseNet = isOnline ? (1 + (Math.random() * 5)) : 0;

      // Combine with spikes
      setSystemStatsState({
        cpu: Math.round(Math.min(100, baseCpu + systemLoad.cpu)),
        ram: Math.round(baseRam),
        net: Math.round(Math.min(1000, baseNet + systemLoad.net))
      });

      // Decay spikes
      setSystemLoad(prev => ({
        cpu: Math.max(0, prev.cpu - 5),
        net: Math.max(0, prev.net - 10)
      }));
    }, 1000);

    return () => clearInterval(statsInterval);
  }, [powerStatus, openWindows.length, isOnline, systemLoad]);

  const triggerSpike = useCallback((type: 'cpu' | 'net', amount: number) => {
    setSystemLoad(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  }, []);

  const addNotification = useCallback((title: string, message: string, type: SystemNotification['type'] = 'system') => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newNotif: SystemNotification = {
      id: newId,
      title, message, type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    if (currentDisplayId === '1') {
      toast({ title, description: message });
      playSound('notify');
    }
  }, [currentDisplayId, playSound]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      addNotification("Hardware Locked", "Geolocation sensors not detected.", "security");
      return;
    }

    addNotification("Sensor Link", "Establishing GPS handshake...", "system");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lon: longitude });

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
          headers: { 'Accept-Language': 'en-US,en;q=0.9', 'User-Agent': 'Nebulabs-WebOS/1.0' }
        });
        
        if (!geoRes.ok) throw new Error("API Limit Reached");
        
        const geoData = await geoRes.json();
        const city = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Area";
        const state = geoData.address.state || "";
        setLocationName(`${city}${state ? ', ' + state : ''}`);

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
        if (!weatherRes.ok) throw new Error("Weather Offline");
        
        const wData = await weatherRes.json();
        setWeatherData({
          temp: Math.round(wData.current_weather.temperature),
          condition: getWeatherCondition(wData.current_weather.weathercode)
        });
        
        addNotification("Location Established", `System synced to ${city}.`, "system");
      } catch (err) {
        console.warn("Satellite link restricted. Using simulated telemetry.", err);
        setLocationName("Simulation Mode");
        setWeatherData({ temp: 39, condition: "Partly Cloudy" });
        addNotification("Sensor Warning", "Could not reach satellite clusters. Using cached telemetry.", "security");
      }
    }, (error) => {
      addNotification("Access Denied", "Hardware location access was rejected.", "security");
    }, { timeout: 10000 });
  }, [addNotification]);

  const saveSetting = useCallback((key: string, value: any) => {
    if (currentUser && !currentUser.isGuest) {
      try {
        const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        localStorage.setItem(`nebula_${currentUser.id}_${key}`, strValue);
      } catch (e) {}
    }
  }, [currentUser]);

  const loadSettings = useCallback((user: LocalUser) => {
    if (user.isGuest) return;
    
    const wall = localStorage.getItem(`nebula_${user.id}_wallpaper`);
    if (wall) setWallpaperState(wall);
    const th = localStorage.getItem(`nebula_${user.id}_theme`);
    if (th) setThemeState(th as ThemeMode);
    const acc = localStorage.getItem(`nebula_${user.id}_accent`);
    if (acc) setAccentColorState(acc as AccentColor);
    const cust = localStorage.getItem(`nebula_${user.id}_custom_accent`);
    if (cust) setCustomAccentHexState(cust);
    const curs = localStorage.getItem(`nebula_${user.id}_cursor`);
    if (curs) setCursorColorState(curs as CursorColor);
    const cursh = localStorage.getItem(`nebula_${user.id}_cursor_shape`);
    if (cursh) setCursorShapeState(cursh as CursorShape);
    const ccurl = localStorage.getItem(`nebula_${user.id}_custom_cursor_url`);
    if (ccurl) setCustomCursorUrlState(ccurl);
    const scale = localStorage.getItem(`nebula_${user.id}_cursor_scale`);
    if (scale) setMouserScaleState(Number(scale));
    const pos = localStorage.getItem(`nebula_${user.id}_taskbar_pos`);
    if (pos) setTaskbarPositionState(pos as TaskbarPosition);
    const size = localStorage.getItem(`nebula_${user.id}_taskbar_size`);
    if (size && !isNaN(Number(size))) setTaskbarSizeState(Number(size));
    const tt = localStorage.getItem(`nebula_${user.id}_taskbar_transparency`);
    if (tt) setTaskbarTransparencyState(Number(tt));
    const at = localStorage.getItem(`nebula_${user.id}_app_transparency`);
    if (at) setAppTransparencyState(Number(at));
    const hide = localStorage.getItem(`nebula_${user.id}_taskbar_autohide`);
    if (hide) setTaskbarAutoHideState(hide === 'true');
    const gs = localStorage.getItem(`nebula_${user.id}_global_scale`);
    if (gs) setGlobalScaleState(Number(gs));
    const n = localStorage.getItem(`nebula_${user.id}_notes`);
    if (n) setNotesInternal(n);
    const gr = localStorage.getItem(`nebula_${user.id}_grayscale`);
    if (gr) setGrayscaleState(gr === 'true');
    const nde = localStorage.getItem(`nebula_${user.id}_nde_enabled`);
    if (nde) setIsNDEEnabledState(nde === 'true');
    
    const sn = localStorage.getItem(`nebula_${user.id}_sticky_notes`);
    if (sn) setStickyNotes(JSON.parse(sn));

    const pa = localStorage.getItem(`nebula_${user.id}_pinned_apps`);
    if (pa) setPinnedApps(JSON.parse(pa));

    const sl = localStorage.getItem(`nebula_${user.id}_start_layout`);
    if (sl) setStartMenuLayout(JSON.parse(sl));
  }, []);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('nebula_accounts');
    if (savedAccounts) {
      const parsed = JSON.parse(savedAccounts);
      setAccounts(parsed);
      
      const lastUserId = localStorage.getItem('nebula_current_user_id');
      if (lastUserId) {
        const lastUser = parsed.find((u: LocalUser) => u.id === lastUserId);
        if (lastUser) {
          setCurrentUser(lastUser);
          loadSettings(lastUser);
        }
      }
    }
    const savedBios = localStorage.getItem('nebula_bios_settings');
    if (savedBios) {
      const parsedBios = JSON.parse(savedBios);
      setBiosSettings(parsedBios);
      if (parsedBios.isLite) {
        setInstalledApps(LITE_APPS);
        setPinnedApps(LITE_PINNED);
      } else {
        setInstalledApps(FULL_APPS);
        setPinnedApps(FULL_PINNED);
      }
    } else {
      setInstalledApps(FULL_APPS);
      setPinnedApps(FULL_PINNED);
    }

    const timer = setTimeout(() => setPowerStatusState('on'), 800);
    return () => clearTimeout(timer);
  }, [loadSettings]);

  useEffect(() => {
    if (startMenuLayout.length === 0 && installedApps.length > 0) {
      const initialLayout: StartMenuItem[] = installedApps.map(appId => ({
        id: `item-${appId}`,
        type: 'app',
        appId
      }));
      setStartMenuLayout(initialLayout);
    }
  }, [startMenuLayout.length, installedApps]);

  const login = useCallback((userId: string, password?: string): boolean => {
    const user = accounts.find(a => a.id === userId);
    if (user) {
      if (!user.password) {
        setCurrentUser(user);
        localStorage.setItem('nebula_current_user_id', userId);
        setIsLocked(false);
        loadSettings(user);
        return true;
      }
      if (user.password !== password) return false;
      setCurrentUser(user);
      localStorage.setItem('nebula_current_user_id', userId);
      setIsLocked(false);
      loadSettings(user);
      return true;
    }
    return false;
  }, [accounts, loadSettings]);

  const loginGuest = useCallback(() => {
    const guestUser: LocalUser = {
      id: 'guest',
      username: 'Guest User',
      avatarColor: '#64748b',
      isGuest: true,
      uniqueCode: 'GUEST-SESSION'
    };
    setCurrentUser(guestUser);
    setIsLocked(false);
    setWallpaperState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
    setThemeState('dark');
    setAccentColorState('purple');
    setFileSystem(INITIAL_FILES);
    setTrash([]);
    setStickyNotes([]);
    setNotesInternal("");
    playSound('open');
  }, [playSound]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('nebula_current_user_id');
    setOpenWindows([]);
    setActiveWindowId(null);
    setIsLocked(false);
  }, []);

  const lock = useCallback(() => { if (currentUser) setIsLocked(true); }, [currentUser]);

  const unlock = useCallback((password?: string): boolean => {
    if (currentUser) {
      if (currentUser.password && currentUser.password !== password) return false;
      setIsLocked(false);
      return true;
    }
    return false;
  }, [currentUser]);

  const createAccount = useCallback((username: string, password?: string, isSchool: boolean = false, isWork: boolean = false, isKid: boolean = false, districtId?: string) => {
    const effectiveDistrictId = districtId || (isSchool ? "NHU-7" : undefined);
    const uniqueCode = `${effectiveDistrictId || (isKid ? 'KID' : (isWork ? 'WRK' : 'USR'))}-${Math.floor(1000 + Math.random() * 9000)}-X`;
    
    const newAcc: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatarColor: isKid ? '#ec4899' : (isSchool ? '#3b82f6' : AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]),
      password: password || undefined,
      isWorkAccount: isWork,
      isSchoolAccount: isSchool,
      isKidAccount: isKid,
      districtId: effectiveDistrictId,
      uniqueCode
    };
    setAccounts(prev => {
      const updated = [...prev, newAcc];
      try { localStorage.setItem('nebula_accounts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setCurrentUser(newAcc);
    localStorage.setItem('nebula_current_user_id', newAcc.id);
    setIsLocked(false);
    loadSettings(newAcc);
    addNotification("Account Created", `Welcome, ${username}! System initialized.`);
  }, [loadSettings, addNotification]);

  const deleteAccount = useCallback((userId: string) => {
    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== userId);
      try { localStorage.setItem('nebula_accounts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  }, []);

  const updateUserPassword = (password: string) => {
    if (!currentUser || currentUser.isSchoolAccount || currentUser.isGuest) return;
    const updatedUser = { ...currentUser, password };
    setCurrentUser(updatedUser);
    const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
      addNotification("Security Updated", "Your account password has been changed.", "security");
    } catch (e) {}
  };

  const resetUserPassword = (userId: string, password: string) => {
    const user = accounts.find(a => a.id === userId);
    if (!user) return;
    const updatedAccounts = accounts.map(a => a.id === userId ? { ...a, password } : a);
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
      addNotification("Identity Recovered", "Hardware-level password reset successful.", "security");
    } catch (e) {}
  };

  const updateUserAvatar = (url: string) => {
    if (!currentUser || currentUser.isGuest) return;
    try {
      const updatedUser = { ...currentUser, avatarUrl: url };
      setCurrentUser(updatedUser);
      const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
      setAccounts(updatedAccounts);
      localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
    } catch (e) {}
  };

  const updateUserWorkStatus = (enabled: boolean) => {
    if (!currentUser || currentUser.isGuest) return;
    const updatedUser = { ...currentUser, isWorkAccount: enabled };
    setCurrentUser(updatedUser);
    const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
    setAccounts(updatedAccounts);
    localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
  };

  const markEmailRead = useCallback((id: string) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, isRead: true } : email));
  }, []);

  const archiveEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'archive' } : e));
  };

  const deleteEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'trash' } : e));
  };

  const restoreEmail = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'inbox' } : e));
  };

  const permanentlyDeleteEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  const sendEmail = async (to: string, subject: string, content: string) => {
    triggerSpike('net', 150);
    const newId = Math.random().toString(36).substr(2, 9);
    const sentEmail: Email = {
      id: newId,
      from: currentUser?.username || 'user',
      to,
      subject,
      content,
      timestamp: 'Just now',
      isRead: true,
      folder: 'sent'
    };

    setEmails(prev => [sentEmail, ...prev]);
    addNotification("Email Sent", `Message delivered to ${to}.`, 'app');

    try {
      const firstRecipient = to.split(',')[0].trim();
      const response = await respondToEmail({ toName: firstRecipient, subject, content });
      
      setTimeout(() => {
        const replyEmail: Email = {
          id: Math.random().toString(36).substr(2, 9),
          from: firstRecipient,
          to: currentUser?.username || 'user',
          subject: response.responseSubject,
          content: response.responseContent,
          timestamp: 'Just now',
          isRead: false,
          folder: 'inbox'
        };
        setEmails(prev => [replyEmail, ...prev]);
        addNotification(`New Mail: ${firstRecipient}`, response.responseSubject, 'app');
        triggerSpike('net', 100);
      }, 3000 + Math.random() * 5000);
    } catch (e) {
      console.error("AI Mail Core: Response generation failed.", e);
    }
  };

  const sendChatMessage = async (text: string, recipient: string, role: string) => {
    if (!biosSettings.networkStack) {
      addNotification("Hardware Error", "Network stack is disabled in BIOS.", "security");
      return;
    }

    triggerSpike('net', 50);
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser?.username || 'Me',
      recipient: recipient,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: false
    };
    setChatMessages(prev => [...prev, msg]);

    try {
      const chatHistory = chatMessages.slice(-5).map(m => `${m.sender}: ${m.text}`);
      const response = await respondToChat({ 
        colleagueName: recipient, 
        colleagueRole: role, 
        message: text,
        history: chatHistory,
        isWorkMode: currentUser?.isWorkAccount
      });

      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          sender: recipient,
          recipient: currentUser?.username || 'user',
          text: response.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true
        };
        setChatMessages(prev => [...prev, botMsg]);
        triggerSpike('net', 50);
        if (!isChatOpen) {
          addNotification(`Chat: ${recipient}`, response.response.slice(0, 30) + '...', 'app');
        }
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error("Chat AI Failure:", error);
    }
  };

  const openApp = (appId: AppId, title: string, params?: any) => {
    triggerSpike('cpu', 40); // Spike CPU when opening app
    if (appId === 'sticky-notes') {
      createStickyNote();
      return;
    }
    const existing = openWindows.find(w => w.appId === appId && JSON.stringify(w.params) === JSON.stringify(params));
    if (existing) {
      focusWindow(existing.id);
      if (existing.isMinimized) {
        setOpenWindows(prev => prev.map(w => w.id === existing.id ? { ...w, isMinimized: false, displayId: currentDisplayId } : w));
      }
      return;
    }
    let initialWidth = 800, initialHeight = 600;
    if (appId === 'calc') { initialWidth = 320; initialHeight = 480; }
    else if (appId === 'terminal') { initialWidth = 700; initialHeight = 450; }
    else if (appId === 'notes') { initialWidth = 500; initialHeight = 600; }
    else if (appId === 'assistant') { initialWidth = 400; initialHeight = 650; }
    else if (appId === 'virus') { initialWidth = 300; initialHeight = 250; }
    else if (appId === 'nde') { initialWidth = 900; initialHeight = 700; }
    else if (appId === 'docs') { initialWidth = 900; initialHeight = 800; }
    else if (appId === 'go') { initialWidth = 1000; initialHeight = 600; }
    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowInstance = {
      id: newId, appId, title, isMinimized: false, isMaximized: false, zIndex: nextZIndex,
      initialWidth, initialHeight, displayId: currentDisplayId,
      x: 100 + (openWindows.length * 20),
      y: 50 + (openWindows.length * 20),
      params
    };
    setOpenWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newId);
    setNextZIndex(prev => prev + 1);
    playSound('click');
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) setActiveWindowId(null);
    playSound('click');
  };

  const minimizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
    playSound('click');
  };

  const maximizeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMaximized: !w.isMaximized, isSnapped: null } : w));
    playSound('click');
  };

  const snapWindow = (windowId: string, side: 'left' | 'right' | null) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, isSnapped: side, isMaximized: false } : w));
    playSound('click');
  };

  const focusWindow = (windowId: string) => {
    setActiveWindowId(windowId);
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setNextZIndex(prev => prev + 1);
  };

  const updateWindowPosition = (windowId: string, x: number, y: number, displayId?: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, x, y, displayId: displayId || w.displayId } : w));
  };

  const moveWindowToDisplay = (windowId: string, displayId: string) => {
    setOpenWindows(prev => prev.map(w => w.id === windowId ? { ...w, displayId } : w));
  };

  const setNotes = (content: string) => { 
    if (!isOnline) return; 
    triggerSpike('cpu', 10);
    setNotesInternal(content); 
    saveSetting('notes', content); 
  };
  const setTheme = (t: ThemeMode) => { setThemeState(t); saveSetting('theme', t); };
  const setAccentColor = (c: AccentColor) => { setAccentColorState(c); saveSetting('accent', c); };
  const setCustomAccentHex = (h: string) => { setCustomAccentHexState(h); saveSetting('custom_accent', h); };
  const setCursorColor = (c: CursorColor) => { setCursorColorState(c); saveSetting('cursor', c); };
  const setCursorShape = (s: CursorShape) => { setCursorShapeState(s); saveSetting('cursor_shape', s); };
  const setCustomCursorUrl = (u: string) => { setCustomCursorUrlState(u); saveSetting('custom_cursor_url', u); };
  const setMouserScale = (s: number) => { setMouserScaleState(s); saveSetting('cursor_scale', s); };
  const setInverted = (inv: boolean) => { setInvertedState(inv); saveSetting('inverted', inv); };
  const setGrayscale = (gr: boolean) => { setGrayscaleState(gr); saveSetting('grayscale', gr); };
  const setGlassEnabled = (gl: boolean) => { setGlassEnabledState(gl); saveSetting('glass', gl); };
  const setTaskbarPosition = (p: TaskbarPosition) => { setTaskbarPositionState(p); saveSetting('taskbar_pos', p); };
  const rotateTaskbar = () => {
    const cycle: TaskbarPosition[] = ['bottom', 'left', 'top', 'right'];
    const next = cycle[(cycle.indexOf(taskbarPosition) + 1) % cycle.length];
    setTaskbarPosition(next);
  };
  const setTaskbarSize = (s: number) => { if (isNaN(s)) return; setTaskbarSizeState(s); saveSetting('taskbar_size', s); };
  const setTaskbarTransparency = (t: number) => { setTaskbarTransparencyState(t); saveSetting('taskbar_transparency', t); };
  const setAppTransparency = (t: number) => { setAppTransparencyState(t); saveSetting('app_transparency', t); };
  const setTaskbarAutoHide = (enabled: boolean) => { setTaskbarAutoHideState(enabled); saveSetting('taskbar_autohide', enabled); };
  const setIconSize = (s: number) => { if (isNaN(s)) return; setIconSizeState(s); saveSetting('icon_size', s); };
  const setVolume = (v: number) => { setVolumeState(v); saveSetting('volume', v); };
  const setBrightness = (b: number) => { setBrightnessState(b); saveSetting('brightness', b); };
  const setGlobalScale = (s: number) => { setGlobalScaleState(s); saveSetting('global_scale', s); };
  const setIsNDEEnabled = (enabled: boolean) => { setIsNDEEnabledState(enabled); saveSetting('nde_enabled', enabled); };
  const setSystemStats = (stats: Partial<{ cpu: number; ram: number; net: number }>) => { setSystemStatsState(prev => ({ ...prev, ...stats })); };

  const factoryReset = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const setIsWidgetsOpen = (open: boolean) => {
    setIsWidgetsOpenState(open);
    if (open) { setIsStartOpenState(false); setIsQuickSettingsOpenState(false); setIsChatOpenState(false); playSound('open'); }
    else { playSound('close'); }
  };

  const setIsQuickSettingsOpen = (open: boolean) => {
    setIsQuickSettingsOpenState(open);
    if (open) { setIsStartOpenState(false); setIsWidgetsOpenState(false); setIsChatOpenState(false); playSound('open'); }
    else { playSound('close'); }
  };

  const setIsStartOpen = (open: boolean) => {
    setIsStartOpenState(open);
    if (open) { setIsQuickSettingsOpenState(false); setIsWidgetsOpenState(false); setIsChatOpenState(false); playSound('open'); }
    else { playSound('close'); }
  };

  const setIsChatOpen = (open: boolean) => {
    setIsChatOpenState(open);
    if (open) { setIsStartOpenState(false); setIsQuickSettingsOpenState(false); setIsWidgetsOpenState(false); playSound('open'); }
    else { playSound('close'); }
  };

  const connectToWifi = (ssid: string) => {
    setIsWifiConnecting(true);
    setTimeout(() => {
      setCurrentWifiState(ssid);
      setIsOnline(ssid !== OFFLINE_WIFI);
      setIsWifiConnecting(false);
    }, 2000);
  };

  const setSecurityEnabled = (enabled: boolean) => {
    setSecurityEnabledState(enabled);
  };

  const setCurrentDisplayId = (id: string) => setDisplayIdState(id);

  const updateDisplayLayout = (fromId: string, direction: DisplayDirection, toId: string) => {
    const updated = { ...displayLayout };
    const reverseMap: Record<DisplayDirection, DisplayDirection> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };
    const revDir = reverseMap[direction];
    if (toId !== 'none') {
      if (!updated[fromId]) updated[fromId] = {};
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
  };

  const resetDisplayLayout = () => setDisplayLayoutState({});
  const powerOn = () => { setPowerStatusState('booting'); setTimeout(() => setPowerStatusState('on'), 800); };
  const restart = () => { logout(); setPowerStatusState('booting'); setTimeout(() => setPowerStatusState('on'), 800); };
  const shutDown = () => { logout(); setPowerStatusState('off'); };
  const minimizeAllWindows = () => { setOpenWindows(prev => prev.map(w => ({ ...w, isMinimized: true }))); setActiveWindowId(null); playSound('close'); };

  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'folder', parentId };
    setFileSystem(prev => [...prev, newFolder]);
  };

  const importFile = (name: string, content: string, size: number, parentId: string | null) => {
    triggerSpike('net', 300);
    triggerSpike('cpu', 20);
    const newFile: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'file', parentId, content, size };
    setFileSystem(prev => [...prev, newFile]);
  };

  const renameFileSystemItem = (id: string, newName: string) => {
    setFileSystem(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
    addNotification("Rename Successful", `Item renamed to ${newName}.`, 'system');
  };

  const moveToTrash = (id: string) => {
    const item = fileSystem.find(i => i.id === id);
    if (item) {
      if (item.isSystem && !isNDEEnabled) {
        addNotification("Access Denied", "Core system files require NDE elevation to modify.", "security");
        playSound('close');
        return;
      }
      setFileSystem(prev => prev.filter(i => i.id !== id));
      setTrash(prev => [...prev, item]);
    }
  };

  const restoreFromTrash = (id: string) => {
    const item = trash.find(i => i.id === id);
    if (item) { setTrash(prev => prev.filter(i => i.id !== id)); setFileSystem(prev => [...prev, item]); }
  };

  const emptyTrash = () => setTrash([]);
  const deleteItemPermanently = (id: string) => setTrash(prev => prev.filter(item => item.id !== id));

  const installApp = (appId: AppId) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps(prev => [...prev, appId]);
      addNotification("App Installed", `${APP_INFO[appId]?.label || appId} is now available in your workspace.`, 'app');
    }
  };

  const uninstallApp = (appId: AppId) => {
    setInstalledApps(prev => prev.filter(id => id !== appId));
    setPinnedApps(prev => {
      const next = prev.filter(id => id !== appId);
      saveSetting('pinned_apps', next);
      return next;
    });
    setDesktopApps(prev => prev.filter(item => item.id !== appId));
    setOpenWindows(prev => prev.filter(win => win.appId !== appId));
    addNotification("App Uninstalled", `${APP_INFO[appId]?.label || appId} has been removed.`, 'system');
    playSound('close');
  };

  const updateDesktopAppPosition = (id: AppId, x: number, y: number) => {
    const snappedX = Math.round((x - PADDING) / GRID_X) * GRID_X + PADDING;
    const snappedY = Math.round((y - PADDING) / GRID_Y) * GRID_Y + PADDING;
    setDesktopApps(prev => prev.map(app => app.id === id ? { ...app, x: snappedX, y: snappedY } : app));
  };

  const toggleDesktopApp = (id: AppId) => {
    const exists = desktopApps.find(app => app.id === id);
    if (exists) {
      if (['trash', 'files', 'store'].includes(id)) return;
      setDesktopApps(prev => prev.filter(app => app.id !== id));
    } else {
      const info = APP_INFO[id];
      const newApp = { id, label: info.label, icon: info.icon, x: PADDING, y: PADDING + (desktopApps.length * GRID_Y) };
      setDesktopApps(prev => [...prev, newApp]);
    }
  };

  const togglePinApp = (id: AppId) => {
    setPinnedApps(prev => {
      const next = prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id];
      saveSetting('pinned_apps', next);
      return next;
    });
  };

  const reorderPinnedApps = (newOrder: AppId[]) => {
    setPinnedApps(newOrder);
    saveSetting('pinned_apps', newOrder);
  };

  const reorderStartMenu = (newLayout: StartMenuItem[]) => {
    setStartMenuLayout(newLayout);
    saveSetting('start_layout', newLayout);
  };

  const createStartFolder = (name: string, firstAppId: AppId, secondAppId: AppId) => {
    const newFolder = { id: Math.random().toString(36).substr(2, 9), name, apps: [firstAppId, secondAppId] };
    const newItem: StartMenuItem = { id: `folder-${newFolder.id}`, type: 'folder', folder: newFolder };
    setStartMenuLayout(prev => {
      const filtered = prev.filter(item => item.appId !== firstAppId && item.appId !== secondAppId);
      const updated = [...filtered, newItem];
      saveSetting('start_layout', updated);
      return updated;
    });
  };

  const addAppToStartFolder = (appId: AppId, folderId: string) => {
    setStartMenuLayout(prev => {
      const updated = prev.map(item => {
        if (item.type === 'folder' && item.folder?.id === folderId) {
          if (!item.folder.apps.includes(appId)) {
            return { ...item, folder: { ...item.folder, apps: [...item.folder.apps, appId] } };
          }
        }
        return item;
      }).filter(item => item.appId !== appId);
      saveSetting('start_layout', updated);
      return updated;
    });
  };

  const removeAppFromStartFolder = (appId: AppId, folderId: string) => {
    setStartMenuLayout(prev => {
      const appItem: StartMenuItem = { id: `item-${appId}`, type: 'app', appId };
      const updated = prev.map(item => {
        if (item.type === 'folder' && item.folder?.id === folderId) {
          return { ...item, folder: { ...item.folder, apps: item.folder.apps.filter(id => id !== appId) } };
        }
        return item;
      });
      const final = [...updated, appItem];
      saveSetting('start_layout', final);
      return final;
    });
  };

  const renameStartFolder = (folderId: string, newName: string) => {
    setStartMenuLayout(prev => {
      const updated = prev.map(item => {
        if (item.type === 'folder' && item.folder?.id === folderId) {
          return { ...item, folder: { ...item.folder, name: newName } };
        }
        return item;
      });
      saveSetting('start_layout', updated);
      return updated;
    });
  };

  const deleteStartFolder = (folderId: string) => {
    setStartMenuLayout(prev => {
      const folderItem = prev.find(item => item.type === 'folder' && item.folder?.id === folderId);
      if (!folderItem || !folderItem.folder) return prev;
      const appsToRestore: StartMenuItem[] = folderItem.folder.apps.map(id => ({ id: `item-${id}`, type: 'app', appId: id }));
      const filtered = prev.filter(item => !(item.type === 'folder' && item.folder?.id === folderId));
      const updated = [...filtered, ...appsToRestore];
      saveSetting('start_layout', updated);
      return updated;
    });
  };

  const updateWallpaper = (url: string) => {
    setWallpaperState(url);
    saveSetting('wallpaper', url);
  };

  const createStickyNote = () => {
    const newNote: StickyNote = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Note...",
      x: 300 + (stickyNotes.length * 20),
      y: 100 + (stickyNotes.length * 20),
      color: '#fef08a'
    };
    const updated = [...stickyNotes, newNote];
    setStickyNotes(updated);
    saveSetting('sticky_notes', updated);
    playSound('click');
  };

  const updateStickyNote = (id: string, updates: Partial<StickyNote>) => {
    const updated = stickyNotes.map(n => n.id === id ? { ...n, ...updates } : n);
    setStickyNotes(updated);
    saveSetting('sticky_notes', updated);
  };

  const deleteStickyNote = (id: string) => {
    const updated = stickyNotes.filter(n => n.id !== id);
    setStickyNotes(updated);
    saveSetting('sticky_notes', updated);
    playSound('close');
  };

  const updateBIOSSettings = useCallback((updates: Partial<BIOSSettings>) => {
    setBiosSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('nebula_bios_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <OSContext.Provider value={{
      currentUser, accounts, openWindows, activeWindowId, installedApps, pinnedApps,
      fileSystem, trash, desktopApps, notifications, emails, markEmailRead, sendEmail, 
      archiveEmail, deleteEmail, restoreEmail, permanentlyDeleteEmail,
      wallpaper, notes, theme, accentColor, mouserScale,
      customAccentHex, cursorColor, cursorShape, customCursorUrl, isInverted, isGrayscale, glassEnabled, powerStatus,
      taskbarPosition, taskbarSize, taskbarTransparency, appTransparency, isTaskbarAutoHide, setTaskbarAutoHide, iconSize, currentWifi, isWifiConnecting,
      isOnline, volume, brightness, isWidgetsOpen, isQuickSettingsOpen, 
      isStartOpen: isStartOpenState, isChatOpen, isLocked, isNDEEnabled, systemStats, stickyNotes,
      currentDisplayId, displayLayout, isSecurityEnabled, chatMessages, biosSettings,
      startMenuLayout, globalScale,
      userLocation, locationName, weatherData, requestLocation,
      login, loginGuest, logout, lock, unlock, createAccount, deleteAccount, updateUserPassword, resetUserPassword, updateUserAvatar, updateUserWorkStatus, openApp, closeWindow, minimizeWindow,
      maximizeWindow, snapWindow, focusWindow, updateWindowPosition, moveWindowToDisplay,
      updateDisplayLayout, resetDisplayLayout, installApp, uninstallApp, addNotification, clearNotifications,
      updateWallpaper, setNotes, setTheme, setAccentColor, setCustomAccentHex,
      setCursorColor, setCursorShape, setCustomCursorUrl, setMouserScale, setInverted, setGrayscale, setGlassEnabled, setTaskbarPosition, rotateTaskbar, setTaskbarSize,
      setTaskbarTransparency, setAppTransparency,
      setIconSize, connectToWifi, setVolume, setBrightness, setIsWidgetsOpen,
      setIsQuickSettingsOpen, setIsStartOpen, setIsChatOpen, setIsNDEEnabled, sendChatMessage, setCurrentDisplayId, setSecurityEnabled, updateBIOSSettings, restart, shutDown, powerOn,
      minimizeAllWindows, playSound, setGlobalScale, factoryReset, setSystemStats,
      createFolder, importFile, renameFileSystemItem, moveToTrash, restoreFromTrash, emptyTrash, deleteItemPermanently,
      updateDesktopAppPosition, toggleDesktopApp, togglePinApp, reorderPinnedApps,
      reorderStartMenu, createStartFolder, addAppToStartFolder, removeAppFromStartFolder, renameStartFolder, deleteStartFolder,
      createStickyNote, updateStickyNote, deleteStickyNote
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
