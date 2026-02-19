"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '@/context/os-context';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(["Welcome to Nebula Shell v1.0", "Type 'help' to see available commands."]);
  const [input, setInput] = useState("");
  const { fileSystem } = useOS();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push("Available commands:", " - ls: List virtual files", " - whoami: Current user", " - neofetch: System info", " - clear: Clear history", " - help: Show this menu");
        break;
      case 'ls':
        newHistory.push(...fileSystem.map(item => `${item.type === 'folder' ? '[DIR]' : '[FILE]'} ${item.name}`));
        break;
      case 'whoami':
        newHistory.push("nebula-user");
        break;
      case 'neofetch':
        newHistory.push(
          "  _ __   ___| |__  _   _ ",
          " | '_ \\ / _ \\ '_ \\| | | |",
          " | | | |  __/ |_) | |_| |",
          " |_| |_|\\___|_.__/ \\__,_|",
          "-------------------------",
          "OS: Nebulabs WebOS 1.0",
          "Kernel: React 19.x",
          "Shell: nebula-sh",
          "Uptime: 2h 45m"
        );
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] font-mono text-sm text-green-500 p-4 overflow-hidden">
      <div className="flex-1 overflow-auto space-y-1 mb-4">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="shrink-0 text-accent">nebula@webos:~$</span>
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-green-400"
          spellCheck={false}
        />
      </form>
    </div>
  );
};