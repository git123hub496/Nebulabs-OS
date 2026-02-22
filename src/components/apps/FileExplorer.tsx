
"use client"

import React, { useState, useRef, useMemo } from 'react';
import { useOS } from '@/context/os-context';
import { Folder, File, ChevronRight, Plus, Trash2, Search, Upload, ImageIcon, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const FileExplorer: React.FC = () => {
  const { fileSystem, createFolder, importFile, moveToTrash, openApp } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = fileSystem.filter(item => item.parentId === currentFolderId);
  
  const totalUsedSize = useMemo(() => {
    return fileSystem.reduce((acc, item) => acc + (item.size || 0), 0);
  }, [fileSystem]);

  const totalCapacity = 2 * 1024 * 1024; // 2MB Limit
  const freeSize = Math.max(0, totalCapacity - totalUsedSize);
  const usedPercentage = Math.min((totalUsedSize / totalCapacity) * 100, 100);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName, currentFolderId);
      setNewFolderName("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importFile(file.name, content, file.size, currentFolderId);
      };
      if (file.size > totalCapacity) {
        alert("File too large for virtual drive (Limit: 2MB).");
        return;
      }
      reader.readAsDataURL(file);
    }
  };

  const handleItemClick = (item: any) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
    } else {
      const extension = item.name.split('.').pop()?.toLowerCase();
      const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '');
      
      if (isImage) {
        openApp('image-viewer', item.name, { src: item.content });
      } else {
        alert("No application associated with this file type.");
      }
    }
  };

  const getBreadcrumbs = () => {
    const crumbs = [];
    let current = fileSystem.find(i => i.id === currentFolderId);
    while (current) {
      crumbs.unshift(current);
      current = fileSystem.find(i => i.id === current?.parentId);
    }
    return crumbs;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getItemIcon = (item: any) => {
    if (item.type === 'folder') return <Folder size={48} className="text-accent/80 group-hover:text-accent fill-accent/10 transition-colors" />;
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '');
    
    if (isImage) return <ImageIcon size={40} className="text-accent/60 group-hover:text-accent transition-colors" />;
    return <File size={40} className="text-white/40 group-hover:text-white/60 transition-colors" />;
  };

  return (
    <div className="flex flex-col h-full bg-[#1e2731]">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/10">
        <div className="flex items-center gap-2 overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-white/60"
            onClick={() => setCurrentFolderId(null)}
          >
            Nebula Drive
          </Button>
          {getBreadcrumbs().map(crumb => (
            <React.Fragment key={crumb.id}>
              <ChevronRight size={14} className="text-white/20" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-white/80"
                onClick={() => setCurrentFolderId(crumb.id)}
              >
                {crumb.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search..." 
            className="h-8 w-40 bg-white/5 border-white/10 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Drive Info Widget (Visible only in root) */}
        {!currentFolderId && (
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Devices and Drives</h3>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group w-full max-w-sm border border-transparent hover:border-white/10">
              <div className="relative shrink-0 mt-1">
                {/* Custom "N" grid logo container */}
                <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center shadow-lg relative mb-2">
                  <span className="text-white font-black text-2xl tracking-tighter">N</span>
                </div>
                <div className="relative w-12 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-sm flex items-center px-1 shadow-inner border border-gray-500/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse" />
                  <div className="ml-auto w-1 h-1 bg-white/20 rounded-full" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 pt-1">
                <h4 className="text-xs font-bold text-white/90 mb-1.5">Nebula Disk (C:)</h4>
                <div className="w-full h-3 bg-white/10 border border-white/10 rounded-[1px] relative overflow-hidden mb-1">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out" 
                    style={{ width: `${usedPercentage}%` }} 
                  />
                </div>
                <p className="text-[10px] text-white/40 font-medium">
                  {formatSize(freeSize)} free of {formatSize(totalCapacity)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer relative"
                onDoubleClick={() => handleItemClick(item)}
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  {getItemIcon(item)}
                </div>
                <div className="flex flex-col items-center min-w-0 w-full px-2">
                  <span className="text-xs text-white/80 text-center truncate w-full">{item.name}</span>
                  {item.type === 'file' && (
                    <span className="text-[9px] text-white/20 font-mono">{formatSize(item.size)}</span>
                  )}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveToTrash(item.id); }}
                  className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 text-destructive hover:scale-110 transition-all"
                  title="Move to Trash"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer group h-full justify-center">
              <div className="space-y-2 flex flex-col items-center w-full">
                <Plus size={24} className="text-white/20 group-hover:text-accent transition-colors" />
                <Input 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder"
                  className="h-7 text-[10px] bg-white/5 border-white/10 text-center"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <Button size="sm" className="h-6 text-[10px] w-full bg-accent/20 text-accent hover:bg-accent/30" onClick={handleCreateFolder}>
                  Create
                </Button>
                <div className="w-full pt-2 border-t border-white/5">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*,.pdf,.txt"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-[10px] w-full border-white/10 text-white/40 hover:text-accent hover:border-accent/40 hover:bg-accent/5 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={12} />
                    Import File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-white/5 bg-black/10 text-[10px] text-white/40 flex justify-between">
        <span>{filteredItems.length} items</span>
        <span>Nebula WebFS v1.1 • Persistent Storage</span>
      </div>
    </div>
  );
};
