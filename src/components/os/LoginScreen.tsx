
"use client"

import React, { useState } from 'react';
import { useOS } from '@/context/os-context';
import { User, Plus, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const LoginScreen: React.FC = () => {
  const { accounts, login, createAccount, wallpaper } = useOS();
  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      createAccount(newUsername);
      setNewUsername("");
      setIsCreating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
      
      <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">Nebulabs WebOS</h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">Select an account to continue</p>
        </div>

        {!isCreating ? (
          <div className="flex flex-wrap justify-center gap-8 max-w-2xl px-8">
            {accounts.map(account => (
              <button
                key={account.id}
                onClick={() => login(account.id)}
                className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
              >
                <div 
                  className="w-24 h-24 rounded-full border-4 border-white/10 group-hover:border-accent transition-colors flex items-center justify-center shadow-2xl overflow-hidden"
                  style={{ backgroundColor: account.avatarColor }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-transparent text-white text-3xl font-bold">
                      {account.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md group-hover:text-accent transition-colors">
                  {account.username}
                </span>
              </button>
            ))}

            <button
              onClick={() => setIsCreating(true)}
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
        ) : (
          <div className="glass p-8 rounded-3xl border border-white/10 w-full max-w-sm flex flex-col gap-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Create Account</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </Button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent uppercase tracking-widest px-1">Choose Username</label>
                <Input 
                  autoFocus
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-accent"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-accent text-primary font-bold rounded-xl hover:bg-accent/80 gap-2">
                Continue
                <ArrowRight size={18} />
              </Button>
            </form>
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
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">System</span>
            <span className="text-[10px] font-mono">v1.0.4-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
