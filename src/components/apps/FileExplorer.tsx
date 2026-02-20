
"use client"

import React, { useState } from 'react';
import { useOS } from '@/context/os-context';
import { Folder, File, ChevronRight, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const FileExplorer: React.FC = () => {
  const { fileSystem, createFolder, moveToTrash } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  const filteredItems = fileSystem.filter(item => item.parentId === currentFolderId);
  
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName, currentFolderId);
      setNewFolderName("");
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

      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer relative"
              onDoubleClick={() => item.type === 'folder' && setCurrentFolderId(item.id)}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                {item.type === 'folder' ? (
                  <Folder size={48} className="text-accent/80 group-hover:text-accent fill-accent/10 transition-colors" />
                ) : (
                  <File size={40} className="text-white/40 group-hover:text-white/60 transition-colors" />
                )}
              </div>
              <span className="text-xs text-white/80 text-center truncate w-full px-2">{item.name}</span>
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
            <div className="space-y-2 flex flex-col items-center">
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
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-white/5 bg-black/10 text-[10px] text-white/40 flex justify-between">
        <span>{filteredItems.length} items</span>
        <span>Nebula WebFS v1.0</span>
      </div>
    </div>
  );
};
