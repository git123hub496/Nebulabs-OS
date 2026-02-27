
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useOS, LocalUser, ThemeMode, AccentColor } from '@/context/os-context';
import { 
  User, 
  Plus, 
  ArrowRight, 
  X, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Sun, 
  Moon, 
  Check, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Power, 
  RefreshCw, 
  Wifi, 
  Accessibility, 
  Languages, 
  Info,
  Clock as ClockIcon,
  ShieldAlert,
  Fingerprint,
  GraduationCap,
  Building2,
  Briefcase,
  Smile,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const SETUP_LOGS = [
  "Initializing Nebulabs Kernel v4.5.2...",
  "Mounting virtual cloud partition...",
  "Applying District-Level Policies...",
  "Calibrating multi-display bridge interface...",
  "Establishing secure workspace tunnel...",
  "Building system icon cache...",
  "Patching security vulnerabilities in BIOS...",
  "Applying UI transparency optimizations...",
  "Optimizing virtual threading support...",
  "Finalizing system registry changes...",
  "Workspace staging complete."
];

const RECOVERY_LOGS = [
  "Bypassing standard auth layer...",
  "Establishing hardware handshake...",
  "Verifying virtual motherboard signature...",
  "Decrypting local registry pointers...",
  "Initiating identity verification sequence...",
  "Resetting credential hash..."
];

const ACCENT_COLORS: { id: AccentColor; color: string }[] = [
  { id: 'purple', color: '#9333ea' },
  { id: 'blue', color: '#3b82f6' },
  { id: 'rose', color: '#e11d48' },
  { id: 'orange', color: '#f97316' },
  { id: 'green', color: '#16a34a' },
];

type AccountType = 'personal' | 'school' | 'work' | 'kid';

export const LoginScreen: React.FC = () => {
  const { 
    accounts, login, createAccount, deleteAccount, resetUserPassword, wallpaper, 
    setTheme, theme, setAccentColor, shutDown, restart,
    isInverted, setInverted, glassEnabled, setGlassEnabled, biosSettings, updateBIOSSettings, factoryReset
  } = useOS();
  
  const [step, setStep] = useState<'select' | 'hardware' | 'create' | 'customize' | 'initialize' | 'recovery'>('select');
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [creationAccountType, setCreationAccountType] = useState<AccountType>('personal');
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('dark');
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>('purple');
  const [selectedAccount, setSelectedAccount] = useState<LocalUser | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("");
  const [logIndex, setLogIndex] = useState(0);
  const hasCreated = useRef(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (accounts.length === 0 && step === 'select') {
      setStep('hardware');
    }
  }, [accounts, step]);

  const playSound = (type: 'click' | 'success') => {
    if (typeof window === 'undefined') return;
    const urls = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
    };
    try {
      const audio = new Audio(urls[type]);
      audio.volume = 0.4;
      audio.play().catch(() => {}); 
    } catch (e) {}
  };

  useEffect(() => {
    if ((step === 'initialize' || step === 'recovery') && !hasCreated.current) {
      const sequenceLogs = step === 'initialize' ? SETUP_LOGS : RECOVERY_LOGS;
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            if (!hasCreated.current) {
              hasCreated.current = true;
              setTimeout(() => {
                playSound('success');
                if (step === 'initialize') {
                  const effectivePassword = creationAccountType === 'school' 
                    ? newDistrict.slice(0, 2).toUpperCase() 
                    : (newPassword || undefined);

                  createAccount(
                    newUsername, 
                    effectivePassword, 
                    creationAccountType === 'school',
                    creationAccountType === 'work',
                    creationAccountType === 'kid',
                    creationAccountType === 'school' ? newDistrict : undefined
                  );
                } else {
                  if (selectedAccount) {
                    resetUserPassword(selectedAccount.id, newPassword);
                    setStep('select');
                    setPasswordInput("");
                    hasCreated.current = false;
                    setProgress(0);
                  }
                }
              }, 400);
            }
            return 100;
          }
          return prev + 1; 
        });
      }, step === 'initialize' ? 50 : 30);

      const logInterval = setInterval(() => {
        setLogIndex(prev => {
          const next = (prev + 1) % sequenceLogs.length;
          setCurrentLog(sequenceLogs[next]);
          return next;
        });
      }, 800);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [step, newUsername, newPassword, newDistrict, creationAccountType, createAccount, resetUserPassword, selectedAccount]);

  const handleHardwareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    setStep('create');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      if (creationAccountType === 'school' && !newDistrict.trim()) return;
      playSound('click');
      if (creationAccountType === 'school' || creationAccountType === 'kid') setStep('initialize'); 
      else setStep('customize');
    }
  };

  const handleCustomizeSubmit = () => {
    playSound('click');
    setTheme(selectedTheme);
    setAccentColor(selectedAccent);
    setStep('initialize');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount) {
      const success = login(selectedAccount.id, passwordInput);
      if (success) {
        playSound('success');
        setSelectedAccount(null);
      } else {
        setIsError(true);
        setPasswordInput("");
      }
    }
  };

  if (!time) return null;

  return (
    <div 
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-12 z-20 pointer-events-none">
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="text-white/60 font-black text-2xl tracking-tighter opacity-40">NEBULABS</div>
        </div>
        <div className="flex flex-col items-end pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
          <span className="text-white font-bold text-lg">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in-95 duration-700 w-full max-w-4xl px-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Nebulabs WebOS</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
            {step === 'initialize' ? "System Staging" : step === 'hardware' ? "Hardware Enrollment" : step === 'customize' ? "Workspace Personalization" : selectedAccount ? "Identity Verification" : "Select Identity"}
          </p>
        </div>

        {step === 'select' && !selectedAccount && (
          <div className="flex flex-wrap justify-center gap-8 max-w-2xl px-8 max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
            {accounts.map(account => (
              <div key={account.id} className="group relative flex flex-col items-center gap-4 transition-all hover:scale-105">
                <button onClick={() => handleSelectAccount(account)} className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white/10 group-hover:border-accent transition-colors flex items-center justify-center shadow-2xl relative" style={{ backgroundColor: account.avatarColor }}>
                    <Avatar className="w-full h-full border-none">
                      <AvatarImage src={account.avatarUrl} className="object-cover" />
                      <AvatarFallback className="bg-transparent text-white text-3xl font-bold">{account.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {account.isSchoolAccount && <div className="absolute -top-1 -right-1 bg-blue-500 p-1.5 rounded-full border-2 border-[#1e2731] z-10 shadow-lg"><GraduationCap size={12} className="text-white" /></div>}
                    {account.isKidAccount && <div className="absolute -top-1 -right-1 bg-pink-500 p-1.5 rounded-full border-2 border-[#1e2731] z-10 shadow-lg"><Smile size={12} className="text-white" /></div>}
                  </div>
                  <span className="text-white font-bold text-lg drop-shadow-md group-hover:text-accent transition-colors">{account.username}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteAccount(account.id); }} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 border-2 border-white shadow-lg"><Trash2 size={12} strokeWidth={3} /></button>
              </div>
            ))}
            <button onClick={() => { playSound('click'); setStep('hardware'); }} className="group flex flex-col items-center gap-4 transition-all hover:scale-105">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 group-hover:border-white/40 group-hover:bg-white/5 transition-all flex items-center justify-center">
                <Plus className="text-white/40 group-hover:text-white" size={32} />
              </div>
              <span className="text-white/40 font-bold text-lg group-hover:text-white transition-colors">Add User</span>
            </button>
          </div>
        )}

        {step === 'hardware' && (
          <div className="glass p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md flex flex-col gap-8 animate-in slide-in-from-bottom-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center"><Monitor className="text-accent" size={24} /></div>
              <h2 className="text-xl font-bold text-white tracking-tight">Machine Signature</h2>
            </div>
            <form onSubmit={handleHardwareSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">Hardware Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => updateBIOSSettings({ deviceType: 'NebulaBook' })} className={cn("p-4 rounded-xl border-2 transition-all text-left", biosSettings.deviceType === 'NebulaBook' ? "bg-accent/10 border-accent text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10")}>
                      <Tv size={18} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">NebulaBook</span>
                    </button>
                    <button type="button" onClick={() => updateBIOSSettings({ deviceType: 'Nebula-PC' })} className={cn("p-4 rounded-xl border-2 transition-all text-left", biosSettings.deviceType === 'Nebula-PC' ? "bg-accent/10 border-accent text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10")}>
                      <Cpu size={18} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">Nebula-PC</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">Model Identifier</label>
                  <Input value={biosSettings.deviceName} onChange={(e) => updateBIOSSettings({ deviceName: e.target.value })} placeholder="e.g. Supernova" className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent" />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 bg-accent text-primary-foreground font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-[0.2em]">Deploy Hardware <ArrowRight size={18} /></Button>
            </form>
          </div>
        )}

        {selectedAccount && step === 'select' && (
          <div className="glass p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <Avatar className="w-24 h-24 border-4 border-accent shadow-xl shadow-accent/20">
              <AvatarImage src={selectedAccount.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-black text-white" style={{ backgroundColor: selectedAccount.avatarColor }}>{selectedAccount.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">{selectedAccount.username}</h2>
              <p className="text-[10px] text-accent font-black uppercase tracking-widest">{selectedAccount.uniqueCode || "Secure Identity"}</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                <Input type="password" autoFocus value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setIsError(false); }} placeholder="Credentials" className={cn("bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus-visible:ring-accent text-center tracking-[0.5em] text-xl font-black", isError ? "border-destructive animate-shake" : "")} />
              </div>
              <div className="flex gap-3 w-full">
                <Button type="button" variant="ghost" className="flex-1 h-12 text-white/40 hover:text-white rounded-2xl font-bold" onClick={() => setSelectedAccount(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 h-12 bg-accent text-primary-foreground font-black rounded-2xl hover:bg-accent/80 uppercase tracking-widest">Sign In</Button>
              </div>
            </form>
          </div>
        )}

        {step === 'initialize' && (
          <div className="glass p-10 rounded-[3rem] border border-white/10 w-full max-w-lg flex flex-col items-center gap-8 animate-in fade-in shadow-2xl">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-accent" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-accent">
                  <span>Enrolling Identity Partition</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>
              <div className="bg-black/20 rounded-xl p-4 h-32 overflow-hidden border border-white/5 font-mono text-[10px] space-y-1">
                <div className="font-bold text-green-500">{currentLog}</div>
                <div className="text-white/20 opacity-40">{">> "}Hardware link active</div>
                <div className="text-white/20 opacity-40">{">> "}Partition wipe successful</div>
                <div className="text-white/20 opacity-40">{">> "}Cryptographic key staged</div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 inset-x-0 h-16 flex items-center justify-between px-12 z-20">
          <div className="flex items-center gap-8 text-white/50">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Identity Bridge</span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono">KERNEL: 4.5.2</span>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-[10px] font-mono">SECURE BOOT: ACTIVE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-full hover:bg-white/10 text-white/40 transition-all pointer-events-auto"><Accessibility size={20} /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-white/10 p-2 rounded-xl backdrop-blur-3xl shadow-2xl text-foreground z-[10000]">
                <DropdownMenuItem onSelect={() => setInverted(!isInverted)} className="gap-3 cursor-pointer p-3 rounded-lg"><Check size={14} className={cn("text-accent", !isInverted && "opacity-0")} /><span className="font-medium text-xs">High Contrast Mode</span></DropdownMenuItem>
                <DropdownMenuItem onSelect={factoryReset} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /><span className="font-medium text-xs">Factory Reset</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={restart} className="p-2.5 rounded-full hover:bg-white/10 text-white/40 transition-all pointer-events-auto"><Power size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
