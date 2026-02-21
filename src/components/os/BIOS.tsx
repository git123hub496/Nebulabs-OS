
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useOS, BIOSSettings as KernelBIOSSettings } from '@/context/os-context';
import { cn } from '@/lib/utils';

type BIOSSection = 'Main' | 'Advanced' | 'Security' | 'Boot' | 'Exit';

export const BIOS: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<BIOSSection>('Main');
  const [selectedItem, setSelectedItem] = useState(0);
  const { systemStats, restart, biosSettings, updateBIOSSettings } = useOS();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for changes before committing
  const [settings, setSettings] = useState<KernelBIOSSettings>({
    cpuTurbo: biosSettings.cpuTurbo,
    networkStack: biosSettings.networkStack,
    secureBoot: biosSettings.secureBoot,
    fastBoot: biosSettings.fastBoot,
  });

  const [bootOrder, setBootOrder] = useState(['Nebulabs Virtual SSD-0', 'Network PXE', 'USB Flash Device']);

  const handleAction = useCallback((direction: 'up' | 'down' | 'enter' | 'toggle') => {
    if (activeSection === 'Exit') return;

    if (direction === 'up') setSelectedItem(prev => Math.max(0, prev - 1));
    if (direction === 'down') {
      const limits = { Main: 0, Advanced: 3, Security: 2, Boot: 2, Exit: 2 };
      setSelectedItem(prev => Math.min(limits[activeSection], prev + 1));
    }

    if (direction === 'toggle' || direction === 'enter') {
      if (activeSection === 'Advanced') {
        if (selectedItem === 0) setSettings(s => ({ ...s, cpuTurbo: !s.cpuTurbo }));
        if (selectedItem === 1) setSettings(s => ({ ...s, networkStack: !s.networkStack }));
        if (selectedItem === 3) setSettings(s => ({ ...s, fastBoot: !s.fastBoot }));
      }
      if (activeSection === 'Security') {
        if (selectedItem === 2) setSettings(s => ({ ...s, secureBoot: !s.secureBoot }));
      }
      if (activeSection === 'Boot' && selectedItem < 2) {
        // Swap boot order
        const newOrder = [...bootOrder];
        const temp = newOrder[selectedItem];
        newOrder[selectedItem] = newOrder[selectedItem + 1];
        newOrder[selectedItem + 1] = temp;
        setBootOrder(newOrder);
      }
    }
  }, [activeSection, selectedItem, bootOrder]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSaving) return;
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
    if (e.key === 'ArrowUp') handleAction('up');
    if (e.key === 'ArrowDown') handleAction('down');
    if (e.key === 'Enter') {
      if (activeSection === 'Exit') {
        if (selectedItem === 0) {
          setIsSaving(true);
          updateBIOSSettings(settings);
          setTimeout(() => { restart(); onClose(); }, 1500);
        } else if (selectedItem === 1) {
          onClose();
        } else {
          setSettings({ cpuTurbo: true, networkStack: true, secureBoot: true, fastBoot: false });
        }
      } else {
        handleAction('enter');
      }
    }
    if (e.key === ' ' || e.key === '+') handleAction('toggle');
  }, [activeSection, handleAction, onClose, restart, isSaving, selectedItem, settings, updateBIOSSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Main':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-[#aaa]">System Time:</span>
              <span className="text-white">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-[#aaa]">System Date:</span>
              <span className="text-white">[{new Date().toLocaleDateString()}]</span>
            </div>
            <div className="border-t border-white/20 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>BIOS Version:</span>
                <span className="text-white">Nebulabs-v4.5.2-PRO</span>
              </div>
              <div className="flex justify-between">
                <span>Processor Type:</span>
                <span className="text-white">Nebulabs Quantum-X Core</span>
              </div>
              <div className="flex justify-between">
                <span>CPU Speed:</span>
                <span className="text-white">{settings.cpuTurbo ? '4.20 GHz (Turbo)' : '3.40 GHz'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Memory:</span>
                <span className="text-white">65536 MB (DDR5-6400)</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Cache:</span>
                <span className="text-white">L3: 32 MB / L2: 8 MB</span>
              </div>
            </div>
            <div className="mt-8 p-4 border border-white/10 bg-white/5 rounded italic text-[10px] text-[#888]">
              "Nebulabs firmware provides the foundation for your virtual workspace environment. 
              Always ensure secure boot is enabled for kernel integrity."
            </div>
          </div>
        );
      case 'Advanced':
        return (
          <div className="space-y-1">
            {[
              { label: 'CPU Turbo Mode', value: settings.cpuTurbo ? '[Enabled]' : '[Disabled]' },
              { label: 'Network Stack Stack', value: settings.networkStack ? '[Enabled]' : '[Disabled]' },
              { label: 'Virtualization Technology', value: '[Enabled]' },
              { label: 'Fast Boot Support', value: settings.fastBoot ? '[Enabled]' : '[Disabled]' },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-1 px-2 transition-colors flex justify-between",
                  selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                )}
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        );
      case 'Security':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              {[
                { label: 'Administrator Password', value: 'NOT INSTALLED' },
                { label: 'User Password', value: 'NOT INSTALLED' },
                { label: 'Secure Boot Control', value: settings.secureBoot ? '[Enabled]' : '[Disabled]' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-1 px-2 transition-colors flex justify-between",
                    selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                  )}
                >
                  <span>{item.label}</span>
                  <span className={cn(item.value === 'NOT INSTALLED' ? "text-yellow-400" : "")}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-4 text-[10px] text-[#aaa]">
              <div className="flex justify-between mb-1">
                <span>TPM 2.0 Module Status:</span>
                <span className="text-green-400">ACTIVE & READY</span>
              </div>
              <div className="flex justify-between">
                <span>Kernel Integrity Check:</span>
                <span className={cn(settings.secureBoot ? "text-green-400" : "text-red-400")}>
                  {settings.secureBoot ? "PASSED" : "UNVERIFIED"}
                </span>
              </div>
            </div>
          </div>
        );
      case 'Boot':
        return (
          <div className="space-y-2">
            <div className="text-[#aaa] mb-2 uppercase text-[10px] tracking-widest font-bold">Boot Priority Order (Press +/- to move):</div>
            <div className="space-y-1">
              {bootOrder.map((device, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-1 px-2 flex gap-4",
                    selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                  )}
                >
                  <span className="w-20">Boot #{i+1}:</span>
                  <span className={i === 0 ? "text-yellow-400 font-bold" : ""}>[{device}]</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 border border-dashed border-white/20 text-[10px] italic text-[#888] leading-relaxed">
              Note: Disabling the Network Stack will prevent the OS from initializing WiFi and all communication apps.
            </div>
          </div>
        );
      case 'Exit':
        return (
          <div className="space-y-4 text-center py-10">
            {[
              'Save Changes and Reboot',
              'Discard Changes and Exit',
              'Restore Factory Defaults'
            ].map((label, i) => (
              <button 
                key={i}
                onClick={() => setSelectedItem(i)}
                className={cn(
                  "block w-full p-2 border transition-all font-bold uppercase",
                  selectedItem === i 
                    ? "bg-[#aaaaaa] text-[#0000aa] border-[#ffffff] scale-105" 
                    : "bg-transparent text-white border-white/20 hover:bg-white/5"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        );
    }
  };

  if (isSaving) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black text-white font-mono flex flex-col items-center justify-center gap-4">
        <div className="text-xl font-bold tracking-widest animate-pulse">REBOOTING SYSTEM...</div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
        <p className="text-[10px] text-white/40 uppercase">Updating Nebulabs Firmware Parameters</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0000aa] text-[#dddddd] font-mono p-8 overflow-hidden crt-overlay">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,112,0.03))] z-10 bg-[length:100%_4px,3px_100%]" />
      
      {/* BIOS Header */}
      <div className="border-4 border-[#aaaaaa] p-1 mb-4 shadow-[4px_4px_0px_#000]">
        <div className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 flex justify-between items-center font-bold">
          <span>Nebulabs Setup Utility - Version 4.5.2 (C) 2026 Nebulabs Corp.</span>
          <span className="text-[10px] animate-pulse">FIRMWARE SETUP</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-1">
        {['Main', 'Advanced', 'Security', 'Boot', 'Exit'].map((sec) => (
          <button
            key={sec}
            onClick={() => { setActiveSection(sec as BIOSSection); setSelectedItem(0); }}
            className={cn(
              "px-6 py-1 transition-all border-t-2 border-x-2 text-xs font-bold",
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
        <div className="flex-1 p-6 border-r border-[#aaaaaa] bg-[#000099]">
          {renderSection()}
        </div>

        {/* Right Info Sidebar */}
        <div className="w-80 p-6 bg-[#000088] text-[10px]">
          <div className="text-white font-bold mb-4 uppercase tracking-tighter border-b border-white/20 pb-2">Item Specific Help</div>
          <div className="leading-relaxed opacity-80 h-40 overflow-hidden">
            {activeSection === 'Main' && "Displays general system information including the current Nebulabs Firmware version and processor specifications."}
            {activeSection === 'Advanced' && "Configure specialized hardware parameters. Warning: Improper settings may lead to virtual hardware instability."}
            {activeSection === 'Security' && "Manage system access and boot security. Enabling Secure Boot prevents unauthorized code execution."}
            {activeSection === 'Boot' && "Specify the device search order. The device at the top of the list will be checked for a bootable OS first."}
            {activeSection === 'Exit' && "Commit settings to the Nebulabs Virtual CMOS memory and restart the system."}
          </div>
          <div className="mt-auto space-y-1 opacity-60 border-t border-white/20 pt-4">
            <div className="flex justify-between"><span>↑↓</span> <span>Select Item</span></div>
            <div className="flex justify-between"><span>←→</span> <span>Select Menu</span></div>
            <div className="flex justify-between"><span>Enter</span> <span>Execute Action</span></div>
            <div className="flex justify-between"><span>+/-</span> <span>Change Value</span></div>
            <div className="flex justify-between"><span>F10</span> <span>Save and Exit</span></div>
            <div className="flex justify-between"><span>ESC</span> <span>Exit Setup</span></div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 flex items-end justify-between">
        <div className="space-y-1">
          <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[4px_4px_0px_#000]">NEBULABS</div>
          <div className="text-[10px] uppercase font-bold opacity-40">Proprietary Virtual BIOS Architecture</div>
        </div>
        <div className="text-right text-[10px] opacity-40 font-mono">
          <div>Display: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080'}</div>
          <div>VRAM: {systemStats.ram * 512} KB Buffer</div>
          <div>CPU State: {settings.cpuTurbo ? 'P-STATE_MAX' : 'P-STATE_BASE'}</div>
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
