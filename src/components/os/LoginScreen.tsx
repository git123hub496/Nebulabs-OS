"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useOS, LocalUser, ThemeMode, AccentColor } from '@/context/os-context';
import { User, Plus, ArrowRight, X, Lock, ShieldCheck, KeyRound, Sun, Moon, Check, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BIOS } from './BIOS';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const SETUP_LOGS = [
  "Initializing Nebulabs Kernel v4.5.2...",
  "Mounting virtual cloud partition...",
  "Calibrating multi-display bridge interface...",
  "Establishing secure workspace tunnel...",
  "Building system icon cache...",
  "Patching security vulnerabilities in BIOS...",
  "Applying UI transparency optimizations...",
  "Optimizing virtual threading support...",
  "Finalizing system registry changes...",
  "Workspace staging complete."
];

const ACCENT_COLORS: { id: AccentColor; color: string }[] = [
  { id: 'purple', color: '#9333ea' },
  { id: 'blue', color: '#3b82f6' },
  { id: 'rose', color: '#e11d48' },
  { id: 'orange', color: '#f97316' },
  { id: 'green', color: '#16a34a' },
];

export const LoginScreen: React.FC = () => {
  const { accounts, login, createAccount, wallpaper, setTheme, setAccentColor } = useOS();
  const [step, setStep] = useState<'select' | 'create' | 'customize' | 'initialize'>('select');
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('dark');
  const [selectedAccent, setSelectedAccent] = useState<AccentColor>('purple');
  const [showBIOS, setShowBIOS] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<LocalUser | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);
  
  // Initialization states
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("");
  const [logIndex, setLogIndex] = useState(0);

  // Sound Effects
  const playSound = (type: 'click' | 'success') => {
    const urls = {
      click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
      success: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
    };
    const audio = new Audio(urls[type]);
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Catch silent play blocks
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b' && step === 'select' && !selectedAccount) {
        setShowBIOS(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, selectedAccount]);

  // Initialization sequence
  useEffect(() => {
    if (step === 'initialize') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              playSound('success');
              createAccount(newUsername, newPassword || undefined);
            }, 800);
            return 100;
          }
          return prev + 1;
        });
      }, 40);

      const logInterval = setInterval(() => {
        setLogIndex(prev => {
          const next = (prev + 1) % SETUP_LOGS.length;
          setCurrentLog(SETUP_LOGS[next]);
          return next;
        });
      }, 600);

      return () => {
        clearInterval(interval);
        clearInterval(logInterval);
      };
    }
  }, [step, newUsername, newPassword, createAccount]);

  if (showBIOS) {
    return <BIOS onClose={() => setShowBIOS(false)} />;
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      playSound('click');
      setStep('customize');
    }
  };

  const handleCustomizeSubmit = () => {
    playSound('click');
    setTheme(selectedTheme);
    setAccentColor(selectedAccent);
    setStep('initialize');
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

  return (
    <div 
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in-95 duration-700 w-full max-w-4xl px-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">Nebulabs WebOS</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
            {step === 'initialize' ? "System Initialization" : step === 'customize' ? "Workspace Personalization" : selectedAccount ? "Identity Verification" : "Select an account to continue"}
          </p>
        </div>

        {step === 'select' && !selectedAccount && (
          <div className="flex flex-wrap justify-center gap-8 max-w-2xl px-8">
            {accounts.map(account => (
              <button
                key={account.id}
                onClick={() => handleSelectAccount(account)}
                className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
              >
                <div 
                  className="w-24 h-24 rounded-full border-4 border-white/10 group-hover:border-accent transition-colors flex items-center justify-center shadow-2xl overflow-hidden relative"
                  style={{ backgroundColor: account.avatarUrl ? 'transparent' : account.avatarColor }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage src={account.avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
                      {account.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {account.password && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock size={20} className="text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-white font-bold text-lg drop-shadow-md group-hover:text-accent transition-colors">
                    {account.username}
                  </span>
                  {account.password && (
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10} /> Protected
                    </span>
                  )}
                </div>
              </button>
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

        {selectedAccount && (
          <div className="glass p-10 rounded-[2.5rem] border border-white/10 w-full max-w-md flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300 shadow-2xl">
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
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Secure Environment</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
              <div className="space-y-2">
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
                    placeholder="Enter Password"
                    className={cn(
                      "bg-white/5 border-white/10 text-white h-14 pl-12 rounded-2xl focus-visible:ring-accent text-center tracking-[0.5em] text-xl font-black",
                      isError ? "border-destructive animate-shake" : ""
                    )}
                  />
                </div>
                {isError && (
                  <p className="text-destructive text-[10px] font-bold uppercase text-center tracking-widest animate-in fade-in">Access Denied: Incorrect Password</p>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 h-12 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl font-bold"
                  onClick={() => setSelectedAccount(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 h-12 bg-accent text-primary font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-widest">
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
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-accent uppercase tracking-widest px-1">User Identifier</label>
                  <Input 
                    autoFocus
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. Administrator"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent"
                  />
                </div>
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
              </div>
              <Button type="submit" className="w-full h-14 bg-accent text-primary font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                Continue Setup
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
                    onClick={() => { playSound('click'); setSelectedTheme('dark'); }}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      selectedTheme === 'dark' ? "bg-accent/10 border-accent scale-105" : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 shadow-xl">
                      <Moon size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Dark Mode</span>
                  </button>
                  <button 
                    onClick={() => { playSound('click'); setSelectedTheme('light'); }}
                    className={cn(
                      "p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                      selectedTheme === 'light' ? "bg-accent/10 border-accent scale-105" : "bg-white/5 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-xl">
                      <Sun size={24} className="text-slate-900" />
                    </div>
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
                      onClick={() => { playSound('click'); setSelectedAccent(color.id); }}
                      className={cn(
                        "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all hover:scale-110",
                        selectedAccent === color.id ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60"
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
              className="w-full h-14 bg-accent text-primary font-black rounded-2xl hover:bg-accent/80 gap-2 uppercase tracking-[0.2em]"
            >
              Complete Setup
              <Sparkles size={18} />
            </Button>
          </div>
        )}

        {step === 'initialize' && (
          <div className="glass p-10 rounded-3xl border border-white/10 w-full max-w-lg flex flex-col items-center gap-8 animate-in fade-in shadow-2xl">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center animate-pulse">
                <Loader2 className="text-accent animate-spin" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center">
                <ShieldCheck size={12} className="text-white" />
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-accent tracking-widest">
                  <span>Preparing Workspace</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/5" />
              </div>

              <div className="bg-black/20 rounded-xl p-4 h-32 overflow-hidden border border-white/5 font-mono text-[10px] space-y-1">
                <div className="text-green-500 font-bold animate-pulse">{currentLog}</div>
                <div className="text-white/20 opacity-40">{" >> "}System check passed</div>
                <div className="text-white/20 opacity-40">{" >> "}Kernel integrity verified</div>
                <div className="text-white/20 opacity-40">{" >> "}User partition initialized</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">Please do not power off your session</p>
            </div>
          </div>
        )}

        <div className="fixed bottom-12 flex items-center gap-6 text-white/20">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Network</span>
            <div className="w-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-accent" />
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest">System</span>
            <span className="text-[10px] font-mono">Press 'B' for BIOS</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};