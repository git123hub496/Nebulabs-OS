
"use client"

import React from 'react';
import { useOS, AppId } from '@/context/os-context';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { 
  Search, 
  Settings, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  LogOut, 
  FolderOpen,
  Cloud,
  Table as TableIcon,
  Presentation,
  Info,
  LogIn
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StartMenuProps {
  onClose: () => void;
}

const APP_INFO: Record<AppId, { icon: any; label: string }> = {
  'store': { icon: ShoppingBag, label: 'App Store' },
  'files': { icon: FolderOpen, label: 'File Explorer' },
  'settings': { icon: Settings, label: 'Settings' },
  'assistant': { icon: MessageSquare, label: 'Nebula Assistant' },
  'google-docs': { icon: FileText, label: 'Google Docs' },
  'google-sheets': { icon: TableIcon, label: 'Google Sheets' },
  'google-slides': { icon: Presentation, label: 'Google Slides' },
  'google-drive': { icon: Cloud, label: 'Google Drive' }
};

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { installedApps, openApp } = useOS();
  const { user } = useUser();
  const auth = useAuth();

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId].label);
    onClose();
  };

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="absolute bottom-14 left-0 w-96 h-[560px] glass rounded-xl border window-shadow p-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <Input 
          placeholder="Search apps, settings, and files" 
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-wider mb-4 opacity-80">Pinned Apps</h3>
          <div className="grid grid-cols-4 gap-4">
            {installedApps.map(appId => {
              const info = APP_INFO[appId];
              const Icon = info.icon;
              return (
                <button
                  key={appId}
                  onClick={() => handleAppClick(appId)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-105 transition-all">
                    <Icon className="text-white/80 group-hover:text-accent transition-colors" size={24} />
                  </div>
                  <span className="text-[10px] text-white/70 font-medium text-center truncate w-full">{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-accent uppercase tracking-wider mb-4 opacity-80">Quick Links</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <FolderOpen size={16} />
              <span>Personal Documents</span>
            </button>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <ShoppingBag size={16} />
              <span>Nebula Cloud Store</span>
            </button>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm text-white/70 transition-colors">
              <Info size={16} />
              <span>About Nebulabs OS</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between">
        {user ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="w-9 h-9 border border-accent/20">
              <AvatarImage src={user.photoURL || ""} />
              <AvatarFallback className="bg-accent text-primary font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white/90 truncate">{user.displayName || "Nebula User"}</span>
              <span className="text-[10px] text-white/40 truncate">{user.email}</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all">
              <LogIn size={18} className="text-white/60 group-hover:text-accent" />
            </div>
            <span className="text-sm font-medium text-white/80">Sign in with Google</span>
          </button>
        )}
        
        {user && (
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-destructive/10 text-white/60 hover:text-destructive transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
