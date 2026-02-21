"use client"

import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';

type BIOSSection = 'Main' | 'Advanced' | 'Security' | 'Boot' | 'Exit';

export const BIOS: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<BIOSSection>('Main');
  const [selectedItem, setSelectedItem] = useState(0);
  const { systemStats } = useOS();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') {
      const sections: BIOSSection[] = ['Main', 'Advanced', 'Security', 'Boot', 'Exit'];
      const currentIndex = sections.indexOf(activeSection);
      setActiveSection(sections[(currentIndex + 1) % sections.length]);
      setSelectedItem(0);
    }
    if (e.key === 'ArrowLeft') {
      const sections: BIOSSection[] = ['Main', 'Advanced', 'Security', 'Boot', 'Exit'];
      const currentIndex = sections.indexOf(activeSection);
      setActiveSection(sections[(currentIndex - 1 + sections.length) % sections.length]);
      setSelectedItem(0);
    }
    if (e.key === 'Enter' && activeSection === 'Exit') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, handleKeyDown]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Main':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <span className="text-[#aaa]">System Time:</span>
              <span className="text-white">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-[#aaa]">System Date:</span>
              <span className="text-white">[{new Date().toLocaleDateString()}]</span>
            </div>
            <div className="border-t border-white/20 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>BIOS Version:</span>
                <span className="text-white">Nebula-v4.2.0-LTS</span>
              </div>
              <div className="flex justify-between">
                <span>Processor Type:</span>
                <span className="text-white">Virtual-X Compute Core @ 3.4GHz</span>
              </div>
              <div className="flex justify-between">
                <span>Total Memory:</span>
                <span className="text-white">32768 MB (DDR5)</span>
              </div>
              <div className="flex justify-between">
                <span>L3 Cache:</span>
                <span className="text-white">16 MB</span>
              </div>
            </div>
          </div>
        );
      case 'Advanced':
        return (
          <div className="space-y-2">
            <div className="p-1 px-2 hover:bg-white hover:text-[#0000aa] transition-colors cursor-pointer flex justify-between">
              <span>CPU Configuration</span>
              <span>[Enter]</span>
            </div>
            <div className="p-1 px-2 hover:bg-white hover:text-[#0000aa] transition-colors cursor-pointer flex justify-between">
              <span>SATA Mode Selection</span>
              <span className="text-white">[AHCI]</span>
            </div>
            <div className="p-1 px-2 hover:bg-white hover:text-[#0000aa] transition-colors cursor-pointer flex justify-between">
              <span>USB Hardware Port Setup</span>
              <span>[Enter]</span>
            </div>
            <div className="p-1 px-2 hover:bg-white hover:text-[#0000aa] transition-colors cursor-pointer flex justify-between">
              <span>Graphics Engine Buffer</span>
              <span className="text-white">[2048 MB]</span>
            </div>
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Administrator Password</span>
              <span className="text-yellow-400">NOT INSTALLED</span>
            </div>
            <div className="flex justify-between">
              <span>User Password</span>
              <span className="text-yellow-400">NOT INSTALLED</span>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span>Secure Boot State</span>
                <span className="text-green-400">ENABLED</span>
              </div>
              <div className="flex justify-between">
                <span>TPM 2.0 Module</span>
                <span className="text-green-400">ACTIVE</span>
              </div>
            </div>
          </div>
        );
      case 'Boot':
        return (
          <div className="space-y-2">
            <div className="text-[#aaa] mb-2 uppercase text-[10px] tracking-widest">Boot Priority Order:</div>
            <div className="flex gap-4">
              <span className="text-white">1st Boot Device:</span>
              <span className="text-yellow-400">[Nebula Virtual SSD-0]</span>
            </div>
            <div className="flex gap-4 opacity-50">
              <span className="text-white">2nd Boot Device:</span>
              <span>[Network Boot - PXE]</span>
            </div>
            <div className="flex gap-4 opacity-50">
              <span className="text-white">3rd Boot Device:</span>
              <span>[USB Flash Drive]</span>
            </div>
            <div className="mt-4 p-2 border border-dashed border-white/20 text-xs italic opacity-60">
              Note: Secure boot will only allow signed Nebula Kernels to execute.
            </div>
          </div>
        );
      case 'Exit':
        return (
          <div className="space-y-4 text-center py-10">
            <button 
              onClick={onClose}
              className="block w-full p-2 border border-white hover:bg-white hover:text-[#0000aa] transition-all font-bold uppercase"
            >
              Save Changes and Exit
            </button>
            <button 
              onClick={onClose}
              className="block w-full p-2 border border-white/20 hover:border-white hover:bg-white/10 transition-all uppercase"
            >
              Discard Changes and Exit
            </button>
            <button 
              className="block w-full p-2 text-xs opacity-40 italic"
            >
              Load Setup Defaults
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0000aa] text-[#dddddd] font-mono p-8 overflow-hidden crt-overlay">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,112,0.03))] z-10 bg-[length:100%_4px,3px_100%]" />
      
      {/* BIOS Header */}
      <div className="border-4 border-[#aaaaaa] p-1 mb-4 shadow-[4px_4px_0px_#000]">
        <div className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 flex justify-between items-center font-bold">
          <span>Aptio Setup Utility - Copyright (C) 2024 Nebula Megatrends, Inc.</span>
          <span className="text-[10px] animate-pulse">SYSTEM SETUP</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-1">
        {['Main', 'Advanced', 'Security', 'Boot', 'Exit'].map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec as BIOSSection)}
            className={cn(
              "px-6 py-1 transition-all border-t-2 border-x-2",
              activeSection === sec 
                ? "bg-[#aaaaaa] text-[#0000aa] border-[#ffffff]" 
                : "bg-transparent text-[#aaaaaa] border-transparent hover:text-white"
            )}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="border-4 border-[#aaaaaa] h-[calc(100%-240px)] flex shadow-[4px_4px_0px_#000]">
        {/* Left List */}
        <div className="flex-1 p-6 border-r border-[#aaaaaa]">
          {renderSection()}
        </div>

        {/* Right Info Sidebar */}
        <div className="w-80 p-6 bg-[#000088]/50 text-xs">
          <div className="text-white font-bold mb-4 uppercase tracking-tighter">Item Specific Help</div>
          <p className="leading-relaxed opacity-80">
            {activeSection === 'Main' && "System Information including Date, Time and basic hardware specs."}
            {activeSection === 'Advanced' && "Advanced configuration for CPU, Storage, and System peripherals."}
            {activeSection === 'Security' && "Password protection and Trusted Platform Module settings."}
            {activeSection === 'Boot' && "Configure the sequence in which the system searches for an OS."}
            {activeSection === 'Exit' && "Commit changes to the CMOS memory and restart the system."}
          </p>
          <div className="mt-auto pt-40 space-y-1 opacity-60">
            <div className="flex justify-between"><span>↑↓</span> <span>Select Item</span></div>
            <div className="flex justify-between"><span>←→</span> <span>Select Menu</span></div>
            <div className="flex justify-between"><span>Enter</span> <span>Select &gt; SubMenu</span></div>
            <div className="flex justify-between"><span>F1</span> <span>General Help</span></div>
            <div className="flex justify-between"><span>F9</span> <span>Setup Defaults</span></div>
            <div className="flex justify-between"><span>F10</span> <span>Save and Exit</span></div>
            <div className="flex justify-between"><span>ESC</span> <span>Exit</span></div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 flex items-end justify-between">
        <div className="space-y-1">
          <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[4px_4px_0px_#000]">NEBULA</div>
          <div className="text-[10px] uppercase font-bold opacity-40">Modular Micro-Kernel Architecture</div>
        </div>
        <div className="text-right text-xs opacity-40">
          <div>Display: {window.innerWidth}x{window.innerHeight}</div>
          <div>VRAM: {systemStats.ram * 128} KB Map</div>
        </div>
      </div>

      <style jsx>{`
        .crt-overlay {
          text-shadow: 0 0 5px rgba(255,255,255,0.3);
          animation: flicker 0.15s infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.99; }
          50% { opacity: 1; }
          100% { opacity: 0.995; }
        }
      `}</style>
    </div>
  );
};
