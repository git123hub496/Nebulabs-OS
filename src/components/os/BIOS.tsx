
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOS, BIOSSettings as KernelBIOSSettings } from '@/context/os-context';
import { cn } from '@/lib/utils';

type BIOSSection = 'Main' | 'Advanced' | 'Power' | 'Security' | 'Boot' | 'Exit';

export const BIOS: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<BIOSSection>('Main');
  const [selectedItem, setSelectedItem] = useState(0);
  const { systemStats, restart, biosSettings, updateBIOSSettings } = useOS();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local state for changes before committing
  const [settings, setSettings] = useState<KernelBIOSSettings>({
    cpuTurbo: biosSettings.cpuTurbo,
    networkStack: biosSettings.networkStack,
    secureBoot: biosSettings.secureBoot,
    fastBoot: biosSettings.fastBoot,
    virtualization: biosSettings.virtualization,
    deviceType: biosSettings.deviceType || 'NebulaBook',
    deviceName: biosSettings.deviceName || 'SuperNova',
    integratedGfx: biosSettings.integratedGfx,
    acLossPolicy: biosSettings.acLossPolicy || 'Stay Off',
    wakeOnLan: biosSettings.wakeOnLan
  });

  const [bootOrder, setBootOrder] = useState(['Nebulabs Virtual SSD-0', 'Network PXE', 'USB Flash Device']);

  const handleAction = useCallback((direction: 'up' | 'down' | 'enter' | 'toggle') => {
    if (activeSection === 'Exit' || isEditing) return;

    if (direction === 'up') setSelectedItem(prev => Math.max(0, prev - 1));
    if (direction === 'down') {
      const limits = { Main: 3, Advanced: 5, Power: 3, Security: 2, Boot: 2, Exit: 2 };
      setSelectedItem(prev => Math.min(limits[activeSection], prev + 1));
    }

    if (direction === 'toggle' || direction === 'enter') {
      if (activeSection === 'Main') {
        if (selectedItem === 2) { // System Model
          setSettings(s => ({ ...s, deviceType: s.deviceType === 'NebulaBook' ? 'Nebula-PC' : 'NebulaBook' }));
        }
        if (selectedItem === 3) { // Custom Name
          setIsEditing(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }
      if (activeSection === 'Advanced') {
        if (selectedItem === 0) setSettings(s => ({ ...s, cpuTurbo: !s.cpuTurbo }));
        if (selectedItem === 1) setSettings(s => ({ ...s, networkStack: !s.networkStack }));
        if (selectedItem === 2) setSettings(s => ({ ...s, virtualization: !s.virtualization }));
        if (selectedItem === 3) setSettings(s => ({ ...s, integratedGfx: !s.integratedGfx }));
        if (selectedItem === 5) setSettings(s => ({ ...s, fastBoot: !s.fastBoot }));
      }
      if (activeSection === 'Power') {
        if (selectedItem === 0) {
          const policies: KernelBIOSSettings['acLossPolicy'][] = ['Stay Off', 'Power On', 'Last State'];
          const idx = (policies.indexOf(settings.acLossPolicy) + 1) % policies.length;
          setSettings(s => ({ ...s, acLossPolicy: policies[idx] }));
        }
        if (selectedItem === 1) setSettings(s => ({ ...s, wakeOnLan: !s.wakeOnLan }));
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
  }, [activeSection, selectedItem, bootOrder, isEditing, settings.acLossPolicy]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSaving) return;
    
    if (isEditing) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setIsEditing(false);
      }
      return;
    }

    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') {
      const sections: BIOSSection[] = ['Main', 'Advanced', 'Power', 'Security', 'Boot', 'Exit'];
      const currentIndex = sections.indexOf(activeSection);
      setActiveSection(sections[(currentIndex + 1) % sections.length]);
      setSelectedItem(0);
    }
    if (e.key === 'ArrowLeft') {
      const sections: BIOSSection[] = ['Main', 'Advanced', 'Power', 'Security', 'Boot', 'Exit'];
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
          setSettings({ ...biosSettings, cpuTurbo: true, networkStack: true, secureBoot: true, fastBoot: false, virtualization: true, deviceType: 'NebulaBook', deviceName: 'SuperNova' });
        }
      } else {
        handleAction('enter');
      }
    }
    if (e.key === ' ' || e.key === '+') handleAction('toggle');
  }, [activeSection, handleAction, onClose, restart, isSaving, selectedItem, settings, updateBIOSSettings, isEditing, biosSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Main':
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4 text-sm font-bold">
              <span className="text-[#aaa]">System Time:</span>
              <span className="text-white">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-[#aaa]">System Date:</span>
              <span className="text-white">[{new Date().toLocaleDateString()}]</span>
            </div>
            
            <div className="border-t border-white/20 pt-4 space-y-1">
              {[
                { label: 'BIOS Version', value: 'Nebulabs-v4.5.2-PRO', static: true },
                { label: 'Firmware Language', value: '[English (US)]', static: true },
                { label: 'System Model', value: `[${settings.deviceType}]` },
                { label: 'Custom Identifier', value: isEditing ? (
                  <input 
                    ref={inputRef}
                    value={settings.deviceName}
                    onChange={(e) => setSettings(s => ({ ...s, deviceName: e.target.value }))}
                    className="bg-white text-blue-900 px-1 border-none outline-none w-32 uppercase"
                    maxLength={15}
                  />
                ) : `[${settings.deviceName}]` },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-1 px-2 transition-colors flex justify-between font-bold text-xs uppercase",
                    selectedItem === i && !item.static ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white",
                    item.static && "opacity-60"
                  )}
                >
                  <span>{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 space-y-2 text-[10px] font-bold">
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
                <span>Serial Number:</span>
                <span className="text-white">NL-QX-9928-ABC-13</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-white/10 bg-white/5 rounded italic text-[10px] text-[#ccc] leading-relaxed">
              "Your System Identity establishes the hardware signature for all Nebula network services."
            </div>
          </div>
        );
      case 'Advanced':
        return (
          <div className="space-y-1">
            {[
              { label: 'CPU Turbo Mode', value: settings.cpuTurbo ? '[Enabled]' : '[Disabled]' },
              { label: 'Network Stack', value: settings.networkStack ? '[Enabled]' : '[Disabled]' },
              { label: 'Virtualization Technology', value: settings.virtualization ? '[Enabled]' : '[Disabled]' },
              { label: 'Integrated Graphics Bridge', value: settings.integratedGfx ? '[Enabled]' : '[Disabled]' },
              { label: 'USB Port Configuration', value: '[All Ports Enabled]' },
              { label: 'Fast Boot Support', value: settings.fastBoot ? '[Enabled]' : '[Disabled]' },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-1 px-2 transition-colors flex justify-between font-bold",
                  selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                )}
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        );
      case 'Power':
        return (
          <div className="space-y-1">
            {[
              { label: 'Restore on AC Power Loss', value: `[${settings.acLossPolicy}]` },
              { label: 'Wake-on-LAN', value: settings.wakeOnLan ? '[Enabled]' : '[Disabled]' },
              { label: 'Energy Star Compliance', value: '[Enabled]' },
              { label: 'ERP Ready', value: '[Disabled]' },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-1 px-2 transition-colors flex justify-between font-bold",
                  selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                )}
              >
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
            <div className="mt-8 border-t border-white/20 pt-4 text-[10px] text-[#aaa] font-bold">
              <div className="flex justify-between mb-1">
                <span>Current Power State:</span>
                <span className="text-white">S0 (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Battery Integrity:</span>
                <span className="text-green-400">100% HEALTHY</span>
              </div>
            </div>
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
                    "p-1 px-2 transition-colors flex justify-between font-bold",
                    selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                  )}
                >
                  <span>{item.label}</span>
                  <span className={cn(item.value === 'NOT INSTALLED' ? "text-yellow-400" : "")}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/20 pt-4 text-[10px] text-[#aaa] font-bold">
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
            <div className="text-[#aaa] mb-2 uppercase text-[10px] tracking-widest font-black">Boot Priority Order (Press +/- to move):</div>
            <div className="space-y-1 font-bold">
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
            <div className="mt-6 p-3 border border-dashed border-white/20 text-[10px] italic text-[#ccc] leading-relaxed">
              Note: NumLock state will be set to [ON] during boot sequence initialization.
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
                  "block w-full p-2 border transition-all font-black uppercase",
                  selectedItem === i 
                    ? "bg-[#aaaaaa] text-[#0000aa] border-[#ffffff] scale-105 shadow-[4px_4px_0px_#000]" 
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
        <p className="text-[10px] text-white/60 uppercase font-black tracking-[0.3em]">Updating Nebulabs Firmware Parameters</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0000aa] text-[#dddddd] font-mono p-8 overflow-hidden crt-overlay flex flex-col">
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,112,0.03))] z-50 bg-[length:100%_4px,3px_100%]" />
      
      {/* BIOS Header */}
      <div className="border-4 border-[#aaaaaa] p-1 mb-4 shadow-[4px_4px_0px_#000] shrink-0">
        <div className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 flex justify-between items-center font-black text-xs">
          <span>Nebulabs Setup Utility - Version 4.5.2 (C) 2026 Nebulabs Corp.</span>
          <span className="text-[10px] animate-pulse">FIRMWARE SETUP</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-1 shrink-0">
        {['Main', 'Advanced', 'Power', 'Security', 'Boot', 'Exit'].map((sec) => (
          <button
            key={sec}
            onClick={() => { setActiveSection(sec as BIOSSection); setSelectedItem(0); }}
            className={cn(
              "px-6 py-1 transition-all border-t-2 border-x-2 text-xs font-black uppercase",
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
      <div className="border-4 border-[#aaaaaa] flex-1 flex shadow-[4px_4px_0px_#000] min-h-0 overflow-hidden bg-[#000099]">
        {/* Left List */}
        <div className="flex-1 p-6 border-r border-[#aaaaaa] overflow-y-auto custom-scrollbar">
          {renderSection()}
        </div>

        {/* Right Info Sidebar */}
        <div className="w-80 p-6 bg-[#000088] text-[10px] font-bold flex flex-col">
          <div className="text-white font-black mb-4 uppercase tracking-widest border-b border-white/20 pb-2 shrink-0">Item Specific Help</div>
          <div className="leading-relaxed opacity-90 text-[#ccc] flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeSection === 'Main' && "Displays general system information. Select 'System Model' to toggle hardware type. Select 'Custom Identifier' and press ENTER to rename your device."}
            {activeSection === 'Advanced' && "Configure specialized hardware parameters. Warning: Improper settings may lead to virtual hardware instability."}
            {activeSection === 'Power' && "Configure power management features. 'AC Loss Policy' determines how the system reacts after a power failure."}
            {activeSection === 'Security' && "Manage system access and boot security. Enabling Secure Boot prevents unauthorized code execution."}
            {activeSection === 'Boot' && "Specify the device search order. The device at the top of the list will be checked for a bootable OS first."}
            {activeSection === 'Exit' && "Commit settings to the Nebulabs Virtual CMOS memory and restart the system."}
          </div>
          <div className="mt-auto space-y-1 opacity-80 border-t border-white/20 pt-4 text-white shrink-0">
            <div className="flex justify-between"><span>↑↓</span> <span>Select Item</span></div>
            <div className="flex justify-between"><span>←→</span> <span>Select Menu</span></div>
            <div className="flex justify-between"><span>Enter</span> <span>Edit/Toggle</span></div>
            <div className="flex justify-between"><span>+/-</span> <span>Change Value</span></div>
            <div className="flex justify-between"><span>F10</span> <span>Save and Exit</span></div>
            <div className="flex justify-between"><span>ESC</span> <span>Exit Setup</span></div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 flex items-end justify-between shrink-0">
        <div className="space-y-1">
          <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[4px_4px_0px_#000]">NEBULABS</div>
          <div className="text-[10px] uppercase font-black opacity-60 tracking-[0.3em]">Proprietary Virtual BIOS Architecture</div>
        </div>
        <div className="text-right text-[10px] opacity-60 font-black tracking-widest uppercase">
          <div>Display: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080'}</div>
          <div>VRAM: {systemStats.ram * 512} KB Buffer</div>
          <div>Identity: {settings.deviceType} {settings.deviceName}</div>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
