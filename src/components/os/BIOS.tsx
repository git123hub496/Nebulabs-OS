
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOS, BIOSSettings as KernelBIOSSettings } from '@/context/os-context';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, CornerDownLeft, X } from 'lucide-react';

type BIOSSection = 'Main' | 'Advanced' | 'Power' | 'Security' | 'Boot' | 'Exit';

export const BIOS: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<BIOSSection>('Main');
  const [selectedItem, setSelectedItem] = useState(0);
  const { systemStats, restart, biosSettings, updateBIOSSettings, factoryReset } = useOS();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initProgress, setInitProgress] = useState(0);
  const [mountedTime, setMountedTime] = useState("");
  const [mountedDate, setMountedDate] = useState("");
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
    wakeOnLan: biosSettings.wakeOnLan,
    isLite: biosSettings.isLite
  });

  const [bootOrder, setBootOrder] = useState(['Nebulabs Virtual SSD-0', 'Network PXE', 'USB Flash Device']);

  useEffect(() => {
    setMountedTime(new Date().toLocaleTimeString());
    setMountedDate(new Date().toLocaleDateString());
    
    if (isInitializing) {
      const timer = setInterval(() => {
        setInitProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsInitializing(false), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isInitializing]);

  const handleAction = useCallback((direction: 'up' | 'down' | 'enter' | 'toggle' | 'left' | 'right') => {
    if (isEditing && direction !== 'enter') return;

    if (direction === 'up') setSelectedItem(prev => Math.max(0, prev - 1));
    if (direction === 'down') {
      const limits: Record<BIOSSection, number> = { Main: 3, Advanced: 6, Power: 3, Security: 2, Boot: 2, Exit: 2 };
      setSelectedItem(prev => Math.min(limits[activeSection], prev + 1));
    }
    if (direction === 'left' || direction === 'right') {
      const sections: BIOSSection[] = ['Main', 'Advanced', 'Power', 'Security', 'Boot', 'Exit'];
      const currentIndex = sections.indexOf(activeSection);
      const nextIdx = direction === 'right' ? (currentIndex + 1) % sections.length : (currentIndex - 1 + sections.length) % sections.length;
      setActiveSection(sections[nextIdx]);
      setSelectedItem(0);
    }

    if (direction === 'toggle' || direction === 'enter') {
      if (activeSection === 'Main') {
        if (selectedItem === 2) { // System Model
          setSettings(s => ({ ...s, deviceType: s.deviceType === 'NebulaBook' ? 'Nebula-PC' : 'NebulaBook' }));
        }
        if (selectedItem === 3) { // Custom Name
          if (isEditing) {
            setIsEditing(false);
          } else {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }
      }
      if (activeSection === 'Advanced') {
        if (selectedItem === 0) setSettings(s => ({ ...s, cpuTurbo: !s.cpuTurbo }));
        if (selectedItem === 1) setSettings(s => ({ ...s, networkStack: !s.networkStack }));
        if (selectedItem === 2) setSettings(s => ({ ...s, virtualization: !s.virtualization }));
        if (selectedItem === 3) setSettings(s => ({ ...s, integratedGfx: !s.integratedGfx }));
        if (selectedItem === 4) setSettings(s => ({ ...s, isLite: !s.isLite })); // Lite Mode
        if (selectedItem === 6) setSettings(s => ({ ...s, fastBoot: !s.fastBoot }));
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
        const newOrder = [...bootOrder];
        const temp = newOrder[selectedItem];
        newOrder[selectedItem] = newOrder[selectedItem + 1];
        newOrder[selectedItem + 1] = temp;
        setBootOrder(newOrder);
      }
      if (activeSection === 'Exit') {
        if (selectedItem === 0) {
          setIsSaving(true);
          updateBIOSSettings(settings);
          setTimeout(() => { restart(); onClose(); }, 1500);
        } else if (selectedItem === 1) {
          onClose();
        } else if (selectedItem === 2) {
          factoryReset();
        }
      }
    }
  }, [activeSection, selectedItem, bootOrder, isEditing, settings, onClose, restart, updateBIOSSettings, factoryReset]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSaving || isInitializing) return;
    
    if (isEditing) {
      if (e.key === 'Enter' || e.key === 'Escape') {
        setIsEditing(false);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'ArrowRight') handleAction('right');
    if (e.key === 'ArrowLeft') handleAction('left');
    if (e.key === 'ArrowUp') handleAction('up');
    if (e.key === 'ArrowDown') handleAction('down');
    if (e.key === 'Enter') handleAction('enter');
    if (e.key === ' ' || e.key === '+' || e.key === '=') handleAction('toggle');
  }, [handleAction, onClose, isSaving, isInitializing, isEditing]);

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
              <span className="text-white">[{mountedTime}]</span>
              <span className="text-[#aaa]">System Date:</span>
              <span className="text-white">[{mountedDate}]</span>
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
                    onBlur={() => setIsEditing(false)}
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
              { label: 'System Edition', value: settings.isLite ? '[Lite Mode]' : '[Standard]' },
              { label: 'USB Port Configuration', value: '[All Ports Enabled]' },
              { label: 'Fast Boot Support', value: settings.fastBoot ? '[Enabled]' : '[Disabled]' },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-1 px-2 transition-colors flex justify-between font-bold text-xs uppercase",
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
                  "p-1 px-2 transition-colors flex justify-between font-bold text-xs uppercase",
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
                    "p-1 px-2 transition-colors flex justify-between font-bold text-xs uppercase",
                    selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                  )}
                >
                  <span>{item.label}</span>
                  <span className={cn(item.value === 'NOT INSTALLED' ? "text-yellow-400" : "")}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Boot':
        return (
          <div className="space-y-2">
            <div className="text-[#aaa] mb-2 uppercase text-[10px] tracking-widest font-black">Boot Priority Order:</div>
            <div className="space-y-1 font-bold">
              {bootOrder.map((device, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-1 px-2 flex gap-4 text-xs uppercase",
                    selectedItem === i ? "bg-[#aaaaaa] text-[#0000aa]" : "text-white"
                  )}
                >
                  <span className="w-20">Boot #{i+1}:</span>
                  <span className={i === 0 ? "text-yellow-400 font-bold" : ""}>[{device}]</span>
                </div>
              ))}
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
                onMouseEnter={() => setSelectedItem(i)}
                className={cn(
                  "block w-full p-2 border transition-all font-black uppercase text-xs",
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

  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black text-[#00ff00] font-mono p-12 overflow-hidden flex flex-col gap-4">
        <div className="text-xl font-bold tracking-widest border-b border-[#00ff00]/20 pb-4">NEBULABS BIOS INITIALIZATION</div>
        <div className="space-y-1 text-sm">
          <div>{'>'} CPU: Quantum-X v4.2 Detected [OK]</div>
          <div>{'>'} MEMORY: 65536MB DDR5 Map [OK]</div>
          <div>{'>'} STORAGE: Cloud Partition SSD [MOUNTED]</div>
          <div>{'>'} NETWORK: Tunnel established [SECURE]</div>
          <div>{'>'} FIRMWARE: Rev 4.5.2 [LATEST]</div>
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-[10px] uppercase font-black">
            <span>Staging BIOS Environment</span>
            <span>{initProgress}%</span>
          </div>
          <div className="w-full h-1 bg-[#00ff00]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff00] transition-all duration-100" style={{ width: `${initProgress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="fixed inset-0 z-[100000] bg-black text-white font-mono flex flex-col items-center justify-center gap-4">
        <div className="text-xl font-bold tracking-widest animate-pulse">REBOOTING SYSTEM...</div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] bg-[#0000aa] text-[#dddddd] font-mono p-8 overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,112,0.03))] z-50 bg-[length:100%_4px,3px_100%]" />
      
      <div className="border-4 border-[#aaaaaa] p-1 mb-4 shadow-[4px_4px_0px_#000] shrink-0">
        <div className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 flex justify-between items-center font-black text-xs">
          <span>Nebulabs Setup Utility - Version 4.5.2 (C) 2026 Nebulabs Corp.</span>
          <span className="text-[10px] animate-pulse">FIRMWARE SETUP</span>
        </div>
      </div>

      <div className="flex gap-1 mb-1 shrink-0 px-1">
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

      <div className="border-4 border-[#aaaaaa] flex-1 flex shadow-[4px_4px_0px_#000] min-h-0 overflow-hidden bg-[#000099]">
        <div className="flex-1 p-6 border-r border-[#aaaaaa] overflow-y-auto custom-scrollbar">
          {renderSection()}
        </div>

        <div className="w-80 p-6 bg-[#000088] text-[10px] font-bold flex flex-col">
          <div className="text-white font-black mb-4 uppercase tracking-widest border-b border-white/20 pb-2 shrink-0">Item Specific Help</div>
          <div className="leading-relaxed opacity-90 text-[#ccc] flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeSection === 'Main' && "Displays general system information. Select 'System Model' to toggle hardware type."}
            {activeSection === 'Advanced' && "Configure specialized hardware parameters. 'System Edition' toggles performance mode."}
            {activeSection === 'Exit' && "Commit settings to the Nebulabs Virtual CMOS memory and restart."}
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2 bg-black/20 p-4 rounded border border-white/10">
            <button onClick={() => handleAction('up')} className="p-2 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center"><ChevronUp size={16} /></button>
            <button onClick={() => handleAction('enter')} className="p-2 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center col-span-2 text-[10px] font-black uppercase"><CornerDownLeft size={14} className="mr-2" /> Select</button>
            <button onClick={() => handleAction('left')} className="p-2 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center"><ChevronLeft size={16} /></button>
            <button onClick={() => handleAction('down')} className="p-2 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center"><ChevronDown size={16} /></button>
            <button onClick={() => handleAction('right')} className="p-2 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center"><ChevronRight size={16} /></button>
            <button onClick={onClose} className="p-2 bg-destructive/20 hover:bg-destructive/40 rounded flex items-center justify-center col-span-3 text-[10px] font-black uppercase text-white/60"><X size={14} className="mr-2" /> Exit Setup</button>
          </div>

          <div className="mt-auto space-y-1 opacity-80 border-t border-white/20 pt-4 text-white shrink-0">
            <div className="flex justify-between"><span>↑↓</span> <span>Select Item</span></div>
            <div className="flex justify-between"><span>←→</span> <span>Select Menu</span></div>
            <div className="flex justify-between"><span>Enter</span> <span>Edit/Toggle</span></div>
            <div className="flex justify-between"><span>ESC</span> <span>Exit Setup</span></div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between shrink-0">
        <div className="space-y-1">
          <div className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[4px_4px_0px_#000]">NEBULABS</div>
          <div className="text-[10px] uppercase font-black opacity-60 tracking-[0.3em]">Proprietary Virtual BIOS Architecture</div>
        </div>
      </div>
    </div>
  );
};
