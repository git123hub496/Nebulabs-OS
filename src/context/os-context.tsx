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
  GraduationCap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { respondToEmail } from '@/ai/flows/mail-ai-flow';
import { respondToChat } from '@/ai/flows/chat-ai-flow';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser' | 'trash' | 'news' | 'maps' | 'monitor' | 'calendar' | 'snake' | 'minesweeper' | 'image-viewer' | 'update' | 'virus' | 'paint' | 'info' | 'camera' | 'slides' | 'mail';
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
  avatarUrl?: string;
  password?: string;
  isWorkAccount?: boolean;
  isSchoolAccount?: boolean;
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

export interface BIOSSettings {
  cpuTurbo: boolean;
  networkStack: boolean;
  secureBoot: boolean;
  fastBoot: boolean;
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
  isChatOpen: boolean;
  isLocked: boolean;
  systemStats: { cpu: number; ram: number; net: number };
  currentDisplayId: string;
  displayLayout: DisplayLayout;
  isSecurityEnabled: boolean;
  chatMessages: ChatMessage[];
  biosSettings: BIOSSettings;
  
  login: (userId: string, password?: string) => boolean;
  logout: () => void;
  lock: () => void;
  unlock: (password?: string) => boolean;
  createAccount: (username: string, password?: string, isSchool?: boolean, isWork?: boolean) => void;
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
  setIsChatOpen: (isOpen: boolean) => void;
  sendChatMessage: (text: string, recipient: string, role: string) => Promise<void>;
  setCurrentDisplayId: (id: string) => void;
  setSecurityEnabled: (enabled: boolean) => void;
  updateBIOSSettings: (settings: Partial<BIOSSettings>) => void;
  restart: () => void;
  shutDown: () => void;
  powerOn: () => void;
  minimizeAllWindows: () => void;
  playSound: (type: 'click' | 'open' | 'close' | 'notify') => void;
  
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
  'paint': { icon: Palette, label: 'Nebula Paint' },
  'info': { icon: Info, label: 'System Info' },
  'camera': { icon: CameraIcon, label: 'Nebula Camera' },
  'slides': { icon: PresentationIcon, label: 'Nebula Slides' },
  'mail': { icon: MailIcon, label: 'NebulaMail' },
};

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
  { id: '4', name: 'Nebula Shared Assets', type: 'folder', parentId: null },
];

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: PADDING, y: PADDING },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: PADDING, y: PADDING + GRID_Y },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: PADDING, y: PADDING + (GRID_Y * 2) },
  { id: 'news', label: 'Nebula News', icon: Newspaper, x: PADDING, y: PADDING + (GRID_Y * 3) },
  { id: 'trash', label: 'Recycling Bin', icon: Trash2, x: PADDING, y: PADDING + (GRID_Y * 4) },
];

const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    from: 'Nebulabs Corp',
    to: 'user',
    subject: 'Welcome to your NebulaBook 180 Pro',
    content: 'Dear User,\n\nCongratulations on your new hardware! Your NebulaBook 180 Pro is the latest in quantum-threaded mobile workstations. We have pre-installed Nebula-Core v4.5.2 for maximum performance.\n\nBest regards,\nNebulabs Hardware Division',
    timestamp: 'Today, 10:00 AM',
    isRead: false,
    isSystem: true,
    folder: 'inbox'
  },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser', 'trash', 'news', 'maps', 'monitor', 'calendar', 'snake', 'minesweeper', 'update', 'paint', 'info', 'camera', 'slides', 'mail'];
const INITIAL_PINNED: AppId[] = ['files', 'store', 'assistant', 'browser', 'settings', 'mail', 'camera', 'slides'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a'];
const OFFLINE_WIFI = "Public_Guest_No_Internet";

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null);
  const [accounts, setAccounts] = useState<LocalUser[]>([]);
  const [powerStatus, setPowerStatusState] = useState<PowerStatus>('booting');
  const [systemStats, setSystemStats] = useState({ cpu: 12, ram: 42, net: 2 });
  const [isLocked, setIsLocked] = useState(false);

  const [isWidgetsOpen, setIsWidgetsOpenState] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpenState] = useState(false);
  const [isStartOpen, setIsStartOpenState] = useState(false);
  const [isChatOpen, setIsChatOpenState] = useState(false);

  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  const [wallpaper, setWallpaperState] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920");
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('purple');
  const [customAccentHex, setCustomAccentHexState] = useState("#9333ea");
  const [cursorColor, setCursorColorState] = useState<CursorColor>('black');
  const [isInverted, setInvertedState] = useState(false);
  const [glassEnabled, setGlassEnabledState] = useState(true);
  const [brightness, setBrightnessState] = useState(100);
  const [volume, setVolumeState] = useState(75);

  const [taskbarPosition, setTaskbarPositionState] = useState<TaskbarPosition>('bottom');
  const [taskbarSize, setTaskbarSizeState] = useState<number>(48);
  const [iconSize, setIconSizeState] = useState<number>(100);

  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [pinnedApps, setPinnedApps] = useState<AppId[]>(INITIAL_PINNED);
  const [desktopApps, setDesktopApps] = useState<DesktopShortcut[]>(INITIAL_DESKTOP);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [trash, setTrash] = useState<FileSystemItem[]>([]);
  const [notes, setNotesInternal] = useState("");
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Nebulabs Onboarding', text: 'Welcome to your internal chat workspace.', timestamp: '10:00 AM', isBot: true }
  ]);

  const [currentWifi, setCurrentWifiState] = useState("Nebula_Secure_5G");
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentDisplayId, setDisplayIdState] = useState('1');
  const [displayLayout, setDisplayLayoutState] = useState<DisplayLayout>({ '1': { right: '2' }, '2': { left: '1' } });
  const [isSecurityEnabled, setSecurityEnabledState] = useState(true);

  // Firmware/BIOS Persistence
  const [biosSettings, setBiosSettings] = useState<BIOSSettings>({
    cpuTurbo: true,
    networkStack: true,
    secureBoot: true,
    fastBoot: false,
  });

  useEffect(() => {
    const savedBios = localStorage.getItem('nebula_bios_settings');
    if (savedBios) {
      setBiosSettings(JSON.parse(savedBios));
    }
  }, []);

  const updateBIOSSettings = (settings: Partial<BIOSSettings>) => {
    const updated = { ...biosSettings, ...settings };
    setBiosSettings(updated);
    localStorage.setItem('nebula_bios_settings', JSON.stringify(updated));
  };

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

  useEffect(() => {
    if (!currentUser || powerStatus !== 'on') return;

    const interval = setInterval(() => {
      if (currentUser.isSchoolAccount && Math.random() > 0.95) {
        addNotification("District Update", "Academic filters updated by NHU-7 Admin.", 'security');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentUser, powerStatus, addNotification]);

  const markEmailRead = (id: string) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, isRead: true } : email));
  };

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
        if (!isChatOpen) {
          addNotification(`Chat: ${recipient}`, response.response.slice(0, 30) + '...', 'app');
        }
      }, 1000 + Math.random() * 1000);
    } catch (error) {
      console.error("Chat AI Failure:", error);
    }
  };

  const saveSetting = useCallback((key: string, value: any) => {
    if (currentUser) {
      try {
        const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        localStorage.setItem(`nebula_${currentUser.id}_${key}`, strValue);
      } catch (e) {
        console.warn("Nebula Kernel: Local registry entry failed.", e);
      }
    }
  }, [currentUser]);

  const loadSettings = useCallback((user: LocalUser) => {
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
    
    const pos = localStorage.getItem(`nebula_${user.id}_taskbar_pos`);
    if (pos) setTaskbarPositionState(pos as TaskbarPosition);
    
    const size = localStorage.getItem(`nebula_${user.id}_taskbar_size`);
    if (size && !isNaN(Number(size))) setTaskbarSizeState(Number(size));
    else setTaskbarSizeState(48);
    
    const n = localStorage.getItem(`nebula_${user.id}_notes`);
    if (n) setNotesInternal(n);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const classes = Array.from(html.classList).filter(c => c.startsWith('accent-'));
    classes.forEach(c => html.classList.remove(c));
    if (accentColor !== 'default' && accentColor !== 'custom') {
      html.classList.add(`accent-${accentColor}`);
    }
  }, [accentColor]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const getCursorValue = () => {
      if (cursorColor === 'black') return 'var(--cursor-black)';
      if (cursorColor === 'white') return 'var(--cursor-white)';
      let hex = customAccentHex;
      const accentHexes: Record<string, string> = { blue: '#3b82f6', rose: '#e11d48', orange: '#f97316', green: '#16a34a', purple: '#9333ea', grey: '#64748b', default: '#9333ea' };
      if (accentColor !== 'custom') hex = accentHexes[accentColor] || accentHexes['default'];
      const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 4 3 L 4 21 L 8.5 16.5 L 11.5 23 L 14.5 22 L 11.5 15.5 L 18 15.5 L 4 3 Z" fill="${hex}" stroke="white" stroke-width="0.8" stroke-linejoin="round"/></svg>`;
      return `url("data:image/svg+xml;base64,${window.btoa(svg)}")`;
    };
    document.documentElement.style.setProperty('--cursor-url', getCursorValue());
  }, [cursorColor, accentColor, customAccentHex]);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('nebula_accounts');
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    else {
      const defaultUser = { id: 'admin', username: 'Administrator', avatarColor: '#9333ea', isWorkAccount: true };
      setAccounts([defaultUser]);
      localStorage.setItem('nebula_accounts', JSON.stringify([defaultUser]));
    }
    const timer = setTimeout(() => setPowerStatusState('on'), 800);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback((userId: string, password?: string): boolean => {
    const user = accounts.find(a => a.id === userId);
    if (user) {
      if (user.password && user.password !== password) return false;
      setCurrentUser(user);
      localStorage.setItem('nebula_current_user_id', userId);
      setIsLocked(false);
      loadSettings(user);
      return true;
    }
    return false;
  }, [accounts, loadSettings]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('nebula_current_user_id');
    setOpenWindows([]);
    setActiveWindowId(null);
    setIsLocked(false);
  }, []);

  const lock = () => { if (currentUser) setIsLocked(true); };

  const unlock = (password?: string): boolean => {
    if (currentUser) {
      if (currentUser.password && currentUser.password !== password) return false;
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const createAccount = useCallback((username: string, password?: string, isSchool: boolean = false, isWork: boolean = false) => {
    const districtId = isSchool ? "NHU-7" : undefined;
    const uniqueCode = `${districtId || (isWork ? 'WRK' : 'USR')}-${Math.floor(1000 + Math.random() * 9000)}-X`;
    
    const newAcc: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatarColor: isSchool ? '#3b82f6' : AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      password: isSchool ? "NU" : (password || undefined),
      isWorkAccount: isWork,
      isSchoolAccount: isSchool,
      districtId,
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
    try {
      localStorage.setItem(`nebula_${newAcc.id}_theme`, theme);
      localStorage.setItem(`nebula_${newAcc.id}_accent`, isSchool ? 'blue' : accentColor);
      localStorage.setItem(`nebula_${newAcc.id}_wallpaper`, wallpaper);
    } catch (e) {}
    addNotification("Account Created", `Welcome, ${username}! ${isSchool ? "District profile active." : (isWork ? "Professional workspace ready." : "System initialized.")}`);
  }, [theme, accentColor, wallpaper, addNotification]);

  const deleteAccount = useCallback((userId: string) => {
    if (userId === 'admin') return; 
    setAccounts(prev => {
      const updated = prev.filter(a => a.id !== userId);
      try { localStorage.setItem('nebula_accounts', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  }, []);

  const updateUserPassword = (password: string) => {
    if (!currentUser || currentUser.isSchoolAccount) return;
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
    if (user?.isSchoolAccount) return; 
    const updatedAccounts = accounts.map(a => a.id === userId ? { ...a, password } : a);
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
      addNotification("Identity Recovered", "Hardware-level password reset successful.", "security");
    } catch (e) {}
  };

  const updateUserAvatar = (url: string) => {
    if (!currentUser) return;
    try {
      const updatedUser = { ...currentUser, avatarUrl: url };
      setCurrentUser(updatedUser);
      const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
      setAccounts(updatedAccounts);
      localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
    } catch (e) {}
  };

  const updateUserWorkStatus = (enabled: boolean) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, isWorkAccount: enabled };
    setCurrentUser(updatedUser);
    const updatedAccounts = accounts.map(a => a.id === currentUser.id ? updatedUser : a);
    setAccounts(updatedAccounts);
    localStorage.setItem('nebula_accounts', JSON.stringify(updatedAccounts));
  };

  const clearNotifications = () => setNotifications([]);

  const openApp = (appId: AppId, title: string, params?: any) => {
    if (currentUser?.isSchoolAccount && (appId === 'news' || appId === 'virus')) {
      addNotification("Access Restricted", "The Nebula News app is disabled by NHU-7 Policy.", "security");
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
    else if (appId === 'paint') { initialWidth = 900; initialHeight = 700; }
    else if (appId === 'camera') { initialWidth = 640; initialHeight = 520; }
    else if (appId === 'slides') { initialWidth = 950; initialHeight = 650; }
    else if (appId === 'mail') { initialWidth = 900; initialHeight = 600; }
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

  const setNotes = (content: string) => { if (!isOnline) return; setNotesInternal(content); saveSetting('notes', content); };
  const setTheme = (t: ThemeMode) => { setThemeState(t); saveSetting('theme', t); };
  const setAccentColor = (c: AccentColor) => { setAccentColorState(c); saveSetting('accent', c); };
  const setCustomAccentHex = (h: string) => { setCustomAccentHexState(h); saveSetting('custom_accent', h); };
  const setCursorColor = (c: CursorColor) => { setCursorColorState(c); saveSetting('cursor', c); };
  const setInverted = (inv: boolean) => { setInvertedState(inv); saveSetting('inverted', inv); };
  const setGlassEnabled = (gl: boolean) => { setGlassEnabledState(gl); saveSetting('glass', gl); };
  const setTaskbarPosition = (p: TaskbarPosition) => { setTaskbarPositionState(p); saveSetting('taskbar_pos', p); };
  const setTaskbarSize = (s: number) => { if (isNaN(s)) return; setTaskbarSizeState(s); saveSetting('taskbar_size', s); };
  const setIconSize = (s: number) => { if (isNaN(s)) return; setIconSizeState(s); saveSetting('icon_size', s); };
  const setVolume = (v: number) => { setVolumeState(v); saveSetting('volume', v); };
  const setBrightness = (b: number) => { setBrightnessState(b); saveSetting('brightness', b); };

  const setIsWidgetsOpen = (open: boolean) => {
    if (currentUser?.isSchoolAccount && open) {
      addNotification("Restricted", "Widgets are disabled during school hours.", "security");
      return;
    }
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
    if (currentUser?.isSchoolAccount && open) {
      addNotification("System Information", "The Start Menu is disabled on managed learning devices.", "system");
      return;
    }
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
    if (!biosSettings.networkStack) {
      addNotification("Hardware Locked", "WiFi cannot be enabled. Network Stack is disabled in BIOS.", "security");
      return;
    }
    setIsWifiConnecting(true);
    setTimeout(() => {
      setCurrentWifiState(ssid);
      setIsOnline(ssid !== OFFLINE_WIFI);
      setIsWifiConnecting(false);
    }, 2000);
  };

  const setSecurityEnabled = (enabled: boolean) => {
    if (currentUser?.isSchoolAccount) return;
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
  const restart = () => { setCurrentUser(null); setOpenWindows([]); setActiveWindowId(null); setIsLocked(false); setPowerStatusState('booting'); setTimeout(() => setPowerStatusState('on'), 800); };
  const shutDown = () => { setCurrentUser(null); setOpenWindows([]); setActiveWindowId(null); setIsLocked(false); setPowerStatusState('off'); };
  const minimizeAllWindows = () => { setOpenWindows(prev => prev.map(w => ({ ...w, isMinimized: true }))); setActiveWindowId(null); playSound('close'); };

  const createFolder = (name: string, parentId: string | null) => {
    const newFolder: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'folder', parentId };
    setFileSystem(prev => [...prev, newFolder]);
  };

  const importFile = (name: string, content: string, size: number, parentId: string | null) => {
    const newFile: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'file', parentId, content, size };
    setFileSystem(prev => [...prev, newFile]);
  };

  const moveToTrash = (id: string) => {
    const item = fileSystem.find(i => i.id === id);
    if (item) { setFileSystem(prev => prev.filter(i => i.id !== id)); setTrash(prev => [...prev, item]); }
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
    }
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
    setPinnedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const reorderPinnedApps = (newOrder: AppId[]) => setPinnedApps(newOrder);

  const updateWallpaper = (url: string) => {
    setWallpaperState(url);
    saveSetting('wallpaper', url);
  };

  return (
    <OSContext.Provider value={{
      currentUser, accounts, openWindows, activeWindowId, installedApps, pinnedApps,
      fileSystem, trash, desktopApps, notifications, emails, markEmailRead, sendEmail, 
      archiveEmail, deleteEmail, restoreEmail, permanentlyDeleteEmail,
      wallpaper, notes, theme, accentColor,
      customAccentHex, cursorColor, isInverted, glassEnabled, powerStatus,
      taskbarPosition, taskbarSize, iconSize, currentWifi, isWifiConnecting,
      isOnline, volume, brightness, isWidgetsOpen, isQuickSettingsOpen, 
      isStartOpen, isChatOpen, isLocked, systemStats,
      currentDisplayId, displayLayout, isSecurityEnabled, chatMessages, biosSettings,
      login, logout, lock, unlock, createAccount, deleteAccount, updateUserPassword, resetUserPassword, updateUserAvatar, updateUserWorkStatus, openApp, closeWindow, minimizeWindow,
      maximizeWindow, snapWindow, focusWindow, updateWindowPosition, moveWindowToDisplay,
      updateDisplayLayout, resetDisplayLayout, installApp, addNotification, clearNotifications,
      updateWallpaper, setNotes, setTheme, setAccentColor, setCustomAccentHex,
      setCursorColor, setInverted, setGlassEnabled, setTaskbarPosition, setTaskbarSize,
      setIconSize, connectToWifi, setVolume, setBrightness, setIsWidgetsOpen,
      setIsQuickSettingsOpen, setIsStartOpen, setIsChatOpen, sendChatMessage, setCurrentDisplayId, setSecurityEnabled, updateBIOSSettings, restart, shutDown, powerOn,
      minimizeAllWindows, playSound,
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
