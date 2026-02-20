"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AppId = 'store' | 'files' | 'settings' | 'assistant' | 'google-drive' | 'notes' | 'calc' | 'terminal';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
}

interface OSContextType {
  openWindows: WindowInstance[];
  activeWindowId: string | null;
  installedApps: AppId[];
  fileSystem: FileSystemItem[];
  wallpaper: string;
  notes: string;
  
  openApp: (appId: AppId, title: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  installApp: (appId: AppId) => void;
  updateWallpaper: (url: string) => void;
  setNotes: (content: string) => void;
  
  createFolder: (name: string, parentId: string | null) => void;
  deleteItem: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const INITIAL_FILES: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null },
  { id: '2', name: 'Pictures', type: 'folder', parentId: null },
  { id: '3', name: 'README.md', type: 'file', parentId: null },
];

const INITIAL_APPS: AppId[] = ['store', 'files', 'settings', 'assistant', 'notes', 'calc', 'terminal'];

export const OSProvider = ({ children }: { children: ReactNode }) => {
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [installedApps, setInstalledApps] = useState<AppId[]>(INITIAL_APPS);
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(INITIAL_FILES);
  const [wallpaper, setWallpaper] = useState("https://picsum.photos/seed/nebula1/1920/1080");
  const [notes, setNotesState] = useState("");
  const [nextZIndex, setNextZIndex] = useState(10);

  useEffect(() => {
    const saved = localStorage.getItem('nebula_notes');
    if (saved) setNotesState(saved);
  }, []);

  const setNotes = (content: string) => {
    setNotesState(content);
    localStorage.setItem('nebula_notes', content);
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

    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowInstance = {
      id: newId,
      appId,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex
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

  const updateWallpaper = (url: string) => setWallpaper(url);

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
      openWindows,
      activeWindowId,
      installedApps,
      fileSystem,
      wallpaper,
      notes,
      openApp,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      installApp,
      updateWallpaper,
      setNotes,
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
