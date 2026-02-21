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
  Briefcase
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

type AccountType = 'personal' | 'school' | 'work';

export const LoginScreen: React.FC = () => {
  const { 
    accounts, login, createAccount, deleteAccount, resetUserPassword, wallpaper, 
    setTheme, theme, setAccentColor, shutDown, restart,
    isInverted, setInverted, glassEnabled, setGlassEnabled
  } = useOS();
  
  const [step, setStep] = useState<'select' | 'create' | 'customize' | 'initialize' | 'recovery'>('select');
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [creationAccountType, setCreationAccountType] = useState<AccountType>('personal');
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('dark');
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>('purple');
  const [selectedAccount, setSelectedAccount] = useState<LocalUser | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [time, setTime] = useState(new Date());
  
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("");
  const [logIndex, setLogIndex] = useState(0);
  const hasCreated = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
          return prev + 2; 
        });
      }, step === 'initialize' ? 10 : 15);

      const logInterval = setInterval(() => {
        setLogIndex(prev => {
          const next = (prev + 1) % sequenceLogs.length;
          setCurrentLog(sequenceLogs[next]);
          return next;
        });
      }, 200);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [step, newUsername, newPassword, newDistrict, creationAccountType, createAccount, resetUserPassword, selectedAccount]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      if (creationAccountType === 'school' && !newDistrict.trim()) {
        return;
      }
      playSound('click');
      if (creationAccountType === 'school') {
        setStep('initialize'); 
      } else {
        setStep('customize');
      }
    }
  };

  const handleCustomizeSubmit = () => {
    playSound('click');
    setTheme(selectedTheme);
    setAccentColor(selectedAccent);
    setStep('initialize');
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim()) {
      playSound('click');
      hasCreated.current = false;
      setProgress(0);
      setStep('recovery');
    }
  };

  const handleSelectAccount = (account: LocalUser) => {
    if (!account.password) {
      playSound('success');
      login(account.id);
    } else {
      playSound('click');
      setSelectedAccount(account);
      setPasswordInput("");
      setIsError(false);
    }
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

  const isSchoolMode = creationAccountType === 'school';
  const isWorkMode = creationAccountType === 'work';

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
          <h1 className="text-4xl font-black text-white tracking-tighter">Nebulabs WebOS</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
            {step === 'initialize' ? "System Initialization" : step === 'customize' ? "Workspace Personalization" : step === 'recovery' ? "Identity Recovery" : selectedAccount ? "Identity Verification" : "Select an account to continue"}
          </p>
        </div>

        {step === 'select' && !selectedAccount && (
          <div className="flex flex-wrap justify-center gap-8 max-w-2xl px-8 max-h-[60vh] overflow-y-auto custom-scrollbar p-4">
            {accounts.map(account => (
              <div
                key={account.id}
                className="group relative flex flex-col items-center gap-4 transition-all hover:scale-105"
              >
                <button
                  onClick={() => handleSelectAccount(account)}
                  className="flex flex-col items-center gap-4"
                >
                  <div 
                    className="w-24 h-24 rounded-full border-4 border-white/10 group-hover:border-accent transition-colors flex items-center justify-center shadow-2xl overflow-hidden relative"
                    style={{ backgroundColor: account.avatarColor }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage src={account.avatarUrl} className="object-cover" />
                      <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
                        {account.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {account.isSchoolAccount && (
                      <div className="absolute top-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-[#1e2731]">
                        <GraduationCap size={12} className="text-white" />
                      </div>
                    )}
                    {account.isWorkAccount && !account.isSchoolAccount && (
                      <div className="absolute top-0 right-0 bg-accent p-1.5 rounded-full border-2 border-[#1e2731]">
                        <Briefcase size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white font-bold text-lg drop-shadow-md group-hover:text-accent transition-colors">
                      {account.username}
                    </span>
                    {account.isSchoolAccount && (
                      <span className="text-[10px] text-blue-400 uppercase font-black tracking-tighter flex items-center gap-1">
                        {account.districtId || "NHU-7"}
                      </span>
                    )}
                    {account.isWorkAccount && !account.isSchoolAccount && (
                      <span className="text-[10px] text-accent uppercase font-black tracking-tighter">
                        Work Account
                      </span>
                    )}
                  </div>
                </button>

                {account.id !== 'admin' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteAccount(account.id); }}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 border-2 border-white shadow-lg"
                  >
                    <Trash2 size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => { playSound('click'); setStep('create'); }}
              className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
            >
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/20 group-hover:border-white/40 group-hover:bg-white/5 transition-all flex items-center justify-center">
                <Plus className="text-white/40 group-hover:text-white" size={32} />
              </div>
              <span className="text-white/40 font-bold text-lg group-hover:text-white transition-colors">
                New User
              </span>
            </button>
          </div>
        )}

        {selectedAccount && step === 'select' && (
          <div className="glass p-10 rounded-[2.5rem] border border-white/10 w-full max-md flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300 shadow-2xl">
            <Avatar className="w-24 h-24 border-4 border-accent shadow-xl shadow-accent/20">
              <AvatarImage src={selectedAccount.avatarUrl} className="object-cover" />
              <AvatarFallback 
                className="text-4xl font-black text-white"
                style={{ backgroundColor: selectedAccount.avatarColor }}
              >
                {selectedAccount.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">{selectedAccount.username}</h2>
              {selectedAccount.isSchoolAccount ? (
                <div className="flex items-center gap-2 justify-center py-1 px-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <GraduationCap size={14} className="text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{selectedAccount.districtId || "Managed Account"}</span>
                </div>
              ) : selectedAccount.isWorkAccount ? (
                <div className="flex items-center gap-2 justify-center py-1 px-3 bg-accent/20 rounded-full border border-accent/30">
                  <Briefcase size={14} className="text-accent" />
                  <span className="text-[10px] text-accent font-black uppercase tracking-widest">Work Account Active</span>
                </div>
              ) : (
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Secure Environment</p>
              )}
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <Input 
                    type="password"
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setIsError(false);
                    }}
                    placeholder={selectedAccount.isSchoolAccount ? "ID" : "Enter Password"}
                    className={cn(
                      "bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus-visible:ring-accent text-center tracking-[0.5em] text-xl font-black",
                      isError ? "border-destructive animate-shake" : ""
                    )}
                  />
                </div>
                {isError && (
                  <p className="text-destructive text-[10px] font-bold uppercase text-center tracking-widest">Access Denied: Incorrect Password</p>
                )}
                
                {!selectedAccount.isSchoolAccount && (
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => { playSound('click'); setStep('recovery'); }}
                      className="text-[10px] font-black uppercase text-accent/60 hover:text-accent transition-colors tracking-[0.2em]"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 w-full">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 h-12 text-white/40 hover:text-white rounded-2xl font-bold"
                  onClick={() => setSelectedAccount(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-12 bg-accent text-primary-foreground font-black rounded-2xl hover:bg-accent/80 uppercase tracking-widest">
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'create' && (
          <div className="glass p-8 rounded-3xl border border-white/10 w-full max-w-md flex flex-col gap-8 animate-in slide-in-from-bottom-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <User className="text-accent" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Create Identity</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setStep('select')} className="text-white/40 hover:text-white">
                <X size={20} />
              </Button>
            </div>
            
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
              <button 
                onClick={() => setCreationAccountType('personal')}
                className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", creationAccountType === 'personal' ? "bg-accent text-white shadow-lg" : "text-white/40 hover:text-white/60")}
              >
                Personal
              </button>
              <button 
                onClick={() => setCreationAccountType('work')}
                className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", creationAccountType === 'work' ? "bg-accent text-white shadow-lg" : "text-white/40 hover:text-white/60")}
              >
                Work
              </button>
              <button 
                onClick={() => setCreationAccountType('school')}
                className={cn("flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", creationAccountType === 'school' ? "bg-blue-500 text-white shadow-lg" : "text-white/40 hover:text-white/60")}
              >
                School
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">User Identifier</label>
                  <Input 
                    autoFocus
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={isSchoolMode ? "Student Name" : isWorkMode ? "Corporate Name" : "e.g. Administrator"}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent"
                  />
                </div>
                
                {isSchoolMode ? (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Managed Enrollment</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-1">District Identifier</label>
                      <Input 
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        placeholder="e.g. Nebula-High"
                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus-visible:ring-blue-500"
                      />
                    </div>
                    {newDistrict.length >= 2 && (
                      <div className="p-2 bg-black/20 rounded-lg text-center">
                        <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Generated Access Code</p>
                        <p className="text-lg font-black text-blue-400 tracking-[0.5em]">{newDistrict.slice(0, 2).toUpperCase()}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-white/40 leading-relaxed italic">The first 2 letters of your district will be your access password.</p>
                  </div>
                ) : isWorkMode ? (
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-accent" />
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest">Workplace Environment</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed">Enabling professional tools, Nebula Teams access, and high-priority AI threading.</p>
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">Access Password</label>
                      <Input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Workplace credentials"
                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus-visible:ring-accent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">Access Password (Optional)</label>
                    <Input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave empty for no password"
                      className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent"
                    />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full h-14 bg-accent text-primary-foreground font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                {isSchoolMode ? "Verify & Initialize" : "Continue Setup"}
                <ArrowRight size={18} />
              </Button>
            </form>
          </div>
        )}

        {step === 'customize' && (
          <div className="glass p-8 rounded-3xl border border-white/10 w-full max-w-lg flex flex-col gap-8 animate-in zoom-in-95 shadow-2xl">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white">Choose Your Style</h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Personalize your Nebulabs experience</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest text-center block">System Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedTheme('dark')}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      selectedTheme === 'dark' ? "bg-accent/10 border-accent scale-105" : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <Moon size={24} className="text-white" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Dark Mode</span>
                  </button>
                  <button 
                    onClick={() => setSelectedTheme('light')}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      selectedTheme === 'light' ? "bg-accent/10 border-accent scale-105" : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <Sun size={24} className="text-slate-900" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Light Mode</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-accent uppercase tracking-widest text-center block">Accent Color</label>
                <div className="flex justify-center gap-4">
                  {ACCENT_COLORS.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedAccent(color.id)}
                      className={cn(
                        "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all",
                        selectedAccent === color.id ? "border-white scale-110" : "border-transparent opacity-60"
                      )}
                      style={{ backgroundColor: color.color }}
                    >
                      {selectedAccent === color.id && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCustomizeSubmit} 
              className="w-full h-14 bg-accent text-primary-foreground font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-[0.2em]"
            >
              Complete Setup
              <Sparkles size={18} />
            </Button>
          </div>
        )}

        {(step === 'initialize' || (step === 'recovery' && progress > 0)) && (
          <div className="glass p-10 rounded-3xl border border-white/10 w-full max-w-lg flex flex-col items-center gap-8 animate-in fade-in shadow-2xl">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center animate-pulse">
                {step === 'initialize' ? (
                  <Loader2 className={cn("animate-spin", isSchoolMode ? "text-blue-400" : "text-accent")} size={40} />
                ) : (
                  <Fingerprint className="text-accent animate-pulse" size={40} />
                )}
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className={isSchoolMode ? "text-blue-400" : "text-accent"}>{isSchoolMode ? "Enrolling Managed Identity" : isWorkMode ? "Staging Workplace Assets" : "Preparing Workspace"}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>

              <div className="bg-black/20 rounded-xl p-4 h-32 overflow-hidden border border-white/5 font-mono text-[10px] space-y-1">
                <div className={cn("font-bold animate-pulse", isSchoolMode ? "text-blue-400" : "text-green-500")}>{currentLog}</div>
                <div className="text-white/20 opacity-40">{">> "}Hardware link active</div>
                <div className="text-white/20 opacity-40">{">> "}Kernel integrity verified</div>
                <div className="text-white/20 opacity-40">{">> "}Identity registry unlocked</div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 inset-x-0 h-16 flex items-center justify-between px-12 z-20">
          <div className="flex items-center gap-8 text-white/50">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Identity Services</span>
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
                <button className="p-2.5 rounded-full hover:bg-white/10 text-white/40 transition-all pointer-events-auto">
                  <Accessibility size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border-white/10 p-2 rounded-xl backdrop-blur-3xl shadow-2xl text-foreground z-[10000]">
                <DropdownMenuItem onSelect={() => setInverted(!isInverted)} className="gap-3 cursor-pointer p-3 rounded-lg">
                  <Check size={14} className={cn("text-accent", !isInverted && "opacity-0")} />
                  <span className="font-medium text-xs">High Contrast Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setGlassEnabled(!glassEnabled)} className="gap-3 cursor-pointer p-3 rounded-lg">
                  <Check size={14} className={cn("text-accent", !glassEnabled && "opacity-0")} />
                  <span className="font-medium text-xs">Glass Effects</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-full hover:bg-white/10 text-white/40 transition-all pointer-events-auto">
                  <Power size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass border-white/10 p-2 rounded-xl backdrop-blur-3xl shadow-2xl text-foreground z-[10000]">
                <DropdownMenuItem onSelect={() => restart()} className="gap-3 cursor-pointer p-3 rounded-lg">
                  <RefreshCw size={16} className="text-accent" />
                  <span className="font-bold uppercase text-[10px] tracking-widest">Restart System</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onSelect={() => shutDown()} className="gap-3 cursor-pointer p-3 rounded-lg hover:bg-destructive/10 text-destructive">
                  <Power size={16} />
                  <span className="font-bold uppercase text-[10px] tracking-widest">Shut Down</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
