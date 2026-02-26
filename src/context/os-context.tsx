
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
  StickyNote as StickyNoteIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { respondToEmail } from '@/ai/flows/mail-ai-flow';
import { respondToChat } from '@/ai/flows/chat-ai-flow';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal' | 'browser' | 'trash' | 'news' | 'maps' | 'monitor' | 'calendar' | 'snake' | 'minesweeper' | 'image-viewer' | 'update' | 'virus' | 'paint' | 'info' | 'camera' | 'slides' | 'mail' | 'nebula-v' | 'google-search' | 'shop' | 'screencast' | 'sticky-notes';
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
  isKidAccount?: boolean;
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
}

export interface StartMenuFolder {
  id: string;
  name: string;
  apps: AppId[];
}

export interface StartMenuItem {
  id: string;
  type: 'app' | 'folder';
  appId?: AppId;
  folder?: StartMenuFolder;
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
  mouserScale: number;
  isInverted: boolean;
  isGrayscale: boolean;
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
  startMenuLayout: StartMenuItem[];
  
  login: (userId: string, password?: string) => boolean;
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
  setMouserScale: (scale: number) => void;
  setInverted: (inverted: boolean) => void;
  setGrayscale: (grayscale: boolean) => void;
  setGlassEnabled: (enabled: boolean) => void;
  setTaskbarPosition: (position: TaskbarPosition) => void;
  rotateTaskbar: () => void;
  setTaskbarSize: (size: TaskbarSize) => void;
  setIconSize: (size: DesktopIconSize) => void;
  connectToWifi: (ssid: string) => void;
  setVolume: (v: number) => void;
  setBrightness: (b: number) => void;
  setIsWidgetsOpen: (isOpen: boolean) => void;
  setIsQuickSettingsOpen: (isOpen: boolean) => void;
  setIsStartOpen: (isOpen: boolean) => void;
  setIsStartOpenState: (isOpen: boolean) => void;
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
  'image-viewer': { icon: ImageIcon, label: 'Image Viewer' },
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
};

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
  { id: '4', name: 'Nebula Shared Assets', type: 'folder', parentId: null },
];

const INITIAL_DESKTOP: DesktopShortcut[] = [
  { id: 'google-search', label: 'Nebula Search', icon: Search, x: PADDING, y: PADDING },
  { id: 'browser', label: 'Nebula Browser', icon: Globe, x: PADDING, y: PADDING + GRID_Y },
  { id: 'files', label: 'File Explorer', icon: FolderOpen, x: PADDING, y: PADDING + (GRID_Y * 2) },
  { id: 'store', label: 'App Store', icon: ShoppingBag, x: PADDING, y: PADDING + (GRID_Y * 3) },
  { id: 'shop', label: 'Shop Nebulabs', icon: Store, x: PADDING, y: PADDING + (GRID_Y * 4) },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal', 'browser', 'trash', 'news', 'maps', 'monitor', 'calendar', 'snake', 'minesweeper', 'update', 'paint', 'info', 'camera', 'slides', 'mail', 'nebula-v', 'google-search', 'shop', 'screencast', 'sticky-notes'];
const INITIAL_PINNED: AppId[] = ['files', 'store', 'shop', 'assistant', 'google-search', 'browser', 'settings', 'mail', 'sticky-notes'];

const AVATAR_COLORS = ['#9333ea', '#3b82f6', '#e11d48', '#f97316', '#16a34a', '#ec4899', '#06b6d4'];
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
  const [mouserScale, setMouserScaleState] = useState<number>(1.0);
  const [isInverted, setInvertedState] = useState(false);
  const [isGrayscale, setGrayscaleState] = useState(false);
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
    wakeOnLan: false
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

  const getFullDeviceName = useCallback(() => {
    return `${biosSettings.deviceType} ${biosSettings.deviceName}`;
  }, [biosSettings]);

  // Set initial emails once device name is known
  useEffect(() => {
    if (emails.length === 0) {
      setEmails([
        {
          id: '1',
          from: 'Nebulabs Corp',
          to: 'user',
          subject: `Welcome to your ${getFullDeviceName()}`,
          content: `Dear User,\n\nCongratulations on your new hardware! Your ${getFullDeviceName()} is the latest in quantum-threaded mobile workstations. We have pre-installed Nebula-Core v4.5.2 for maximum performance.\n\nBest regards,\nNebulabs Hardware Division`,
          timestamp: 'Today, 10:00 AM',
          isRead: false,
          isSystem: true,
          folder: 'inbox'
        },
      ]);
    }
  }, [getFullDeviceName, emails.length]);

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
    if (!currentUser || powerStatus !== 'on' || isLocked || !isOnline) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        const type = Math.random() > 0.5 ? 'chat' : 'email';
        
        if (type === 'chat') {
          const contacts = currentUser.isSchoolAccount 
            ? ['Mr. Henderson', 'Ms. Garcia', 'IT Desk'] 
            : (currentUser.isKidAccount ? ['Mom', 'Dad', 'Best Friend'] : (currentUser.isWorkAccount ? ['Sarah', 'Admin', 'HR'] : ['Mom', 'Best Friend', 'Pizza Planet']));
          
          const sender = contacts[Math.floor(Math.random() * contacts.length)];
          const messages = [
            "Just checking in on the latest progress.",
            "Are we still on for the sync later?",
            "Don't forget to review the documents I sent.",
            "Hope your day is going well!",
            `System update scheduled for your ${biosSettings.deviceType} tonight.`
          ];
          
          const botMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            sender,
            recipient: currentUser.username,
            text: messages[Math.floor(Math.random() * messages.length)],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isBot: true
          };
          setChatMessages(prev => [...prev, botMsg]);
          if (!isChatOpen) {
            addNotification(`Chat: ${sender}`, botMsg.text.slice(0, 30) + '...', 'app');
          }
        } else {
          const subjects = [`Update required for ${biosSettings.deviceName}`, "Weekly Digest", "New document shared", "System Alert", "Invitation"];
          const bodies = ["Please review the attached file.", "Your weekly stats are ready.", "Check out the new feature release.", `Action required on your ${getFullDeviceName()} account.`];
          const newEmail: Email = {
            id: Math.random().toString(36).substr(2, 9),
            from: "Nebula Core",
            to: currentUser.username,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            content: bodies[Math.floor(Math.random() * bodies.length)],
            timestamp: 'Just now',
            isRead: false,
            folder: 'inbox'
          };
          setEmails(prev => [newEmail, ...prev]);
          addNotification("New Email", newEmail.subject, 'app');
        }
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [currentUser, powerStatus, isLocked, isOnline, isChatOpen, addNotification, biosSettings, getFullDeviceName]);

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
    setEmails(prev => prev.filter(e => e.id !== id));
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
      } catch (e) {}
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

    const scale = localStorage.getItem(`nebula_${user.id}_cursor_scale`);
    if (scale) setMouserScaleState(Number(scale));
    
    const pos = localStorage.getItem(`nebula_${user.id}_taskbar_pos`);
    if (pos) setTaskbarPositionState(pos as TaskbarPosition);
    
    const size = localStorage.getItem(`nebula_${user.id}_taskbar_size`);
    if (size && !isNaN(Number(size))) setTaskbarSizeState(Number(size));
    
    const n = localStorage.getItem(`nebula_${user.id}_notes`);
    if (n) setNotesInternal(n);

    const gr = localStorage.getItem(`nebula_${user.id}_grayscale`);
    if (gr) setGrayscaleState(gr === 'true');

    const sm = localStorage.getItem(`nebula_${user.id}_start_layout`);
    if (sm) {
      setStartMenuLayout(JSON.parse(sm));
    } else {
      // Default layout if none exists
      const defaultLayout: StartMenuItem[] = INITIAL_APPS.map(id => ({
        id: `item-${id}`,
        type: 'app',
        appId: id
      }));
      setStartMenuLayout(defaultLayout);
    }

    const sn = localStorage.getItem(`nebula_${user.id}_sticky_notes`);
    if (sn) setStickyNotes(JSON.parse(sn));
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
      let fill = '#000';
      let stroke = '#fff';
      const accentHexes: Record<string, string> = { blue: '#3b82f6', rose: '#e11d48', orange: '#f97316', green: '#16a34a', purple: '#9333ea', grey: '#64748b', default: '#9333ea' };
      
      if (cursorColor === 'black') {
        fill = '#000';
        stroke = '#fff';
      } else if (cursorColor === 'white') {
        fill = '#fff';
        stroke = '#000';
      } else if (accentColor === 'custom') {
        fill = customAccentHex;
        stroke = '#fff';
      } else {
        fill = accentHexes[accentColor] || accentHexes['default'];
        stroke = '#fff';
      }

      const baseScale = 32 * mouserScale;
      // SVG exactly matched to image: pointed winged arrow with tilted stem and drop shadow
      const svg = `
        <svg width="${baseScale}" height="${baseScale}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1.5" flood-opacity="0.6"/>
            </filter>
          </defs>
          <path d="M0,0 L0,19 L4.8,15 L7.5,22 L10.5,21 L7.8,14 L13,14 Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="miter" filter="url(#shadow)"/>
        </svg>`;
      
      return `url("data:image/svg+xml;base64,${window.btoa(svg)}") 0 0, auto`;
    };
    
    document.documentElement.style.setProperty('--cursor-url', getCursorValue());
  }, [cursorColor, accentColor, customAccentHex, mouserScale]);

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

  const createAccount = useCallback((username: string, password?: string, isSchool: boolean = false, isWork: boolean = false, isKid: boolean = false, districtId?: string) => {
    const effectiveDistrictId = districtId || (isSchool ? "NHU-7" : undefined);
    const uniqueCode = `${effectiveDistrictId || (isKid ? 'KID' : (isWork ? 'WRK' : 'USR'))}-${Math.floor(1000 + Math.random() * 9000)}-X`;
    
    const newAcc: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      avatarColor: isKid ? '#ec4899' : (isSchool ? '#3b82f6' : AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]),
      password: password || (isSchool ? "NU" : undefined),
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
  }, [theme, accentColor, wallpaper, addNotification, loadSettings]);

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
    if (appId === 'sticky-notes') {
      createStickyNote();
      return;
    }

    if (currentUser?.isSchoolAccount && (appId === 'virus')) {
      addNotification("Access Restricted", "Restricted app execution prevented by District Policy.", "security");
      return;
    }
    if (currentUser?.isKidAccount && (appId === 'terminal' || appId === 'virus')) {
      addNotification("Parental Control", "Terminal access is disabled for Home Managed accounts.", "security");
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
    else if (appId === 'nebula-v') { initialWidth = 1000; initialHeight = 700; }
    else if (appId === 'google-search') { initialWidth = 1000; initialHeight = 700; }
    else if (appId === 'shop') { initialWidth = 1100; initialHeight = 750; }
    else if (appId === 'screencast') { initialWidth = 450; initialHeight = 600; }
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
  const setIconSize = (s: number) => { if (isNaN(s)) return; setIconSizeState(s); saveSetting('icon_size', s); };
  const setVolume = (v: number) => { setVolumeState(v); saveSetting('volume', v); };
  const setBrightness = (b: number) => { setBrightnessState(b); saveSetting('brightness', b); };

  const setIsWidgetsOpen = (open: boolean) => {
    if ((currentUser?.isSchoolAccount || currentUser?.isKidAccount) && open) {
      addNotification("Restricted", "Widgets are disabled on managed accounts.", "security");
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
    if (currentUser?.isSchoolAccount || currentUser?.isKidAccount) return;
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
    const newFile: FileSystemItem = { id: Math.random().toString(36).substr(2, 9), name, type: 'file', parentId, content, size };
    setFileSystem(prev => [...prev, newFile]);
  };

  const renameFileSystemItem = (id: string, newName: string) => {
    setFileSystem(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
    addNotification("Rename Successful", `Item renamed to ${newName}.`, 'system');
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
      setStartMenuLayout(prev => [...prev, { id: `item-${appId}`, type: 'app', appId }]);
      addNotification("App Installed", `${APP_INFO[appId]?.label || appId} is now available in your workspace.`, 'app');
    }
  };

  const uninstallApp = (appId: AppId) => {
    const SYSTEM_APPS: AppId[] = ['settings', 'store', 'files', 'assistant'];
    if (SYSTEM_APPS.includes(appId)) {
      addNotification("System Protection", "Cannot uninstall core system components.", "security");
      return;
    }

    setInstalledApps(prev => prev.filter(id => id !== appId));
    setPinnedApps(prev => prev.filter(id => id !== appId));
    setDesktopApps(prev => prev.filter(item => item.id !== appId));
    setOpenWindows(prev => prev.filter(win => win.appId !== appId));
    setStartMenuLayout(prev => {
      const filtered = prev.filter(item => item.appId !== appId);
      return filtered.map(item => {
        if (item.type === 'folder' && item.folder) {
          return {
            ...item,
            folder: { ...item.folder, apps: item.folder.apps.filter(id => id !== appId) }
          };
        }
        return item;
      });
    });
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
    setPinnedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const reorderPinnedApps = (newOrder: AppId[]) => setPinnedApps(newOrder);

  const updateWallpaper = (url: string) => {
    setWallpaperState(url);
    saveSetting('wallpaper', url);
  };

  const reorderStartMenu = (newLayout: StartMenuItem[]) => {
    setStartMenuLayout(newLayout);
    saveSetting('start_layout', newLayout);
  };

  const createStartFolder = (name: string, firstAppId: AppId, secondAppId: AppId) => {
    const newFolder: StartMenuFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      apps: [firstAppId, secondAppId]
    };
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
    addNotification("Folder Renamed", `Start folder renamed to ${newName}.`, 'system');
  };

  const deleteStartFolder = (folderId: string) => {
    setStartMenuLayout(prev => {
      const folderItem = prev.find(item => item.type === 'folder' && item.folder?.id === folderId);
      if (!folderItem || !folderItem.folder) return prev;
      
      const appsToRestore: StartMenuItem[] = folderItem.folder.apps.map(id => ({
        id: `item-${id}`,
        type: 'app',
        appId: id
      }));
      
      const filtered = prev.filter(item => !(item.type === 'folder' && item.folder?.id === folderId));
      const updated = [...filtered, ...appsToRestore];
      saveSetting('start_layout', updated);
      return updated;
    });
  };

  const createStickyNote = () => {
    const newNote: StickyNote = {
      id: Math.random().toString(36).substr(2, 9),
      content: "New Note...",
      x: 300 + (stickyNotes.length * 20),
      y: 100 + (stickyNotes.length * 20),
      color: '#fef08a' // Default yellow
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

  return (
    <OSContext.Provider value={{
      currentUser, accounts, openWindows, activeWindowId, installedApps, pinnedApps,
      fileSystem, trash, desktopApps, notifications, emails, markEmailRead, sendEmail, 
      archiveEmail, deleteEmail, restoreEmail, permanentlyDeleteEmail,
      wallpaper, notes, theme, accentColor, mouserScale,
      customAccentHex, cursorColor, isInverted, isGrayscale, glassEnabled, powerStatus,
      taskbarPosition, taskbarSize, iconSize, currentWifi, isWifiConnecting,
      isOnline, volume, brightness, isWidgetsOpen, isQuickSettingsOpen, 
      isStartOpen, isChatOpen, isLocked, systemStats, stickyNotes,
      currentDisplayId, displayLayout, isSecurityEnabled, chatMessages, biosSettings,
      startMenuLayout,
      login, logout, lock, unlock, createAccount, deleteAccount, updateUserPassword, resetUserPassword, updateUserAvatar, updateUserWorkStatus, openApp, closeWindow, minimizeWindow,
      maximizeWindow, snapWindow, focusWindow, updateWindowPosition, moveWindowToDisplay,
      updateDisplayLayout, resetDisplayLayout, installApp, uninstallApp, addNotification, clearNotifications,
      updateWallpaper, setNotes, setTheme, setAccentColor, setCustomAccentHex,
      setCursorColor, setMouserScale, setInverted, setGrayscale, setGlassEnabled, setTaskbarPosition, rotateTaskbar, setTaskbarSize,
      setIconSize, connectToWifi, setVolume, setBrightness, setIsWidgetsOpen,
      setIsQuickSettingsOpen, setIsStartOpen, setIsStartOpenState, setIsChatOpen, sendChatMessage, setCurrentDisplayId, setSecurityEnabled, updateBIOSSettings, restart, shutDown, powerOn,
      minimizeAllWindows, playSound,
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
