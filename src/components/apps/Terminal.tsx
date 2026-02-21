"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { executeTerminalAiCommand } from '@/ai/flows/terminal-ai-flow';
import { Loader2 } from 'lucide-react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to Nebula Shell v1.1", "AI Integration Active. Type any command or question."]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const { fileSystem } = useOS();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isThinking]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const cmd = input.trim();
    const cmdLower = cmd.toLowerCase();
    const newHistory = [...history, `> ${cmd}`];
    setHistory(newHistory);
    setInput("");

    // Built-in commands logic
    switch (cmdLower) {
      case 'help':
        setHistory(prev => [...prev, "Available commands:", " - ls: List virtual files", " - whoami: Current user", " - neofetch: System info", " - clear: Clear history", " - [anything]: Ask the Nebula AI assistant"]);
        return;
      case 'ls':
        setHistory(prev => [...prev, ...fileSystem.map(item => `${item.type === 'folder' ? '[DIR]' : '[FILE]'} ${item.name}`)]);
        return;
      case 'whoami':
        setHistory(prev => [...prev, "nebula-user (administrator)"]);
        return;
      case 'neofetch':
        setHistory(prev => [...prev,
          "  _ __   ___| |__  _   _ ",
          " | '_ \\ / _ \\ '_ \\| | | |",
          " | | | |  __/ |_) | |_| |",
          " |_| |_|\\___|_.__/ \\__,_|",
          "-------------------------",
          "OS: Nebulabs WebOS 1.1",
          "Kernel: React 19.x (AI Enhanced)",
          "Shell: nebula-ai-sh",
          "Uptime: 2h 45m"
        ]);
        return;
      case 'clear':
        setHistory([]);
        return;
    }

    // AI Command logic for unknown commands
    setIsThinking(true);
    try {
      // Pass the last 5 lines of history for context
      const context = history.slice(-5);
      const result = await executeTerminalAiCommand({ 
        command: cmd,
        history: context
      });
      
      setHistory(prev => [...prev, result.response]);
    } catch (error) {
      setHistory(prev => [...prev, "Error: Failed to reach Nebula AI core. Check network connectivity."]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] font-mono text-sm text-green-500 p-4 overflow-hidden shadow-inner">
      <div className="flex-1 overflow-auto space-y-1 mb-4 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-left-1 duration-300">{line}</div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-2 text-accent italic animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span>Nebula AI is computing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      <form onSubmit={handleCommand} className="flex gap-2 border-t border-white/5 pt-3">
        <span className="shrink-0 text-accent font-bold">nebula@webos:~$</span>
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
          className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder:text-green-900"
          spellCheck={false}
          autoComplete="off"
          placeholder={isThinking ? "Waiting for AI..." : "Enter command..."}
        />
      </form>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
};
