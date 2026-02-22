
"use client"

import React, { useState, useRef } from 'react';
import { useOS, AppId, APP_INFO, StartMenuItem, StartMenuFolder } from '@/context/os-context';
import { 
  Search, 
  Settings, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  FolderOpen,
  Cloud,
  Calculator as CalcIcon,
  Terminal as TermIcon,
  Power,
  RefreshCw,
  LogOut,
  Globe,
  Newspaper,
  Pin,
  PinOff,
  Trash2,
  Map as MapIcon,
  Activity,
  Calendar as CalendarIcon,
  GraduationCap,
  Presentation as PresentationIcon,
  Smile,
  Home,
  ChevronRight,
  Folder,
  X,
  Edit2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const StartAppContextMenu: React.FC<{ x: number, y: number, appId: AppId, onClose: () => void }> = ({ x, y, appId, onClose }) => {
  const { togglePinApp, pinnedApps, openApp } = useOS();
  
  return (
    <div 
      className="fixed z-[100001] w-52 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button 
        onClick={() => {
          openApp(appId, APP_INFO[appId].label);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <RefreshCw size={14} className="text-accent/60" />
          <span>Launch</span>
        </div>
      </button>
      <button 
        onClick={() => {
          togglePinApp(appId);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          {pinnedApps.includes(appId) ? (
            <>
              <PinOff size={14} className="text-accent/60" />
              <span>Unpin from Taskbar</span>
            </>
          ) : (
            <>
              <Pin size={14} className="text-accent/60" />
              <span>Pin to Taskbar</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

const FolderContextMenu: React.FC<{ x: number, y: number, folderId: string, onClose: () => void }> = ({ x, y, folderId, onClose }) => {
  const { deleteStartFolder, renameStartFolder } = useOS();
  
  return (
    <div 
      className="fixed z-[100001] w-52 glass rounded-xl border border-white/10 shadow-2xl backdrop-blur-3xl p-1.5 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button 
        onClick={() => {
          const newName = prompt("Enter new folder name:");
          if (newName) renameStartFolder(folderId, newName);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/20 text-xs font-bold text-white/80 hover:text-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <Edit2 size={14} className="text-accent/60" />
          <span>Rename Folder</span>
        </div>
      </button>
      <button 
        onClick={() => {
          if (confirm("Delete folder and restore apps?")) deleteStartFolder(folderId);
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-destructive/20 text-xs font-bold text-white/80 hover:text-destructive transition-colors"
      >
        <div className="flex items-center gap-3">
          <Trash2 size={14} className="text-destructive/60" />
          <span>Delete Folder</span>
        </div>
      </button>
    </div>
  );
};

interface StartMenuProps {
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const { 
    startMenuLayout, reorderStartMenu, createStartFolder, addAppToStartFolder, 
    removeAppFromStartFolder, openApp, restart, shutDown, taskbarPosition, 
    currentUser, logout 
  } = useOS();

  const [searchQuery, setSearchQuery] = useState("");
  const [appContextMenu, setAppContextMenu] = useState<{ x: number, y: number, appId: AppId } | null>(null);
  const [folderContextMenu, setFolderContextMenu] = useState<{ x: number, y: number, folderId: string } | null>(null);
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);
  
  // Drag and Drop state
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const isSchool = currentUser?.isSchoolAccount;
  const isKid = currentUser?.isKidAccount;

  const handleAppClick = (appId: AppId) => {
    openApp(appId, APP_INFO[appId]?.label || appId);
    onClose();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingItemId(id);
    e.dataTransfer.setData('itemId', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggingItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('itemId');
    if (sourceId === targetId) return;

    const sourceItem = startMenuLayout.find(i => i.id === sourceId);
    const targetItem = startMenuLayout.find(i => i.id === targetId);

    if (!sourceItem || !targetItem) return;

    // Folder Logic
    if (sourceItem.type === 'app' && targetItem.type === 'folder') {
      addAppToStartFolder(sourceItem.appId!, targetItem.folder!.id);
    } else if (sourceItem.type === 'app' && targetItem.type === 'app') {
      // Create folder if dropped on another app
      createStartFolder("New Group", targetItem.appId!, sourceItem.appId!);
    } else {
      // Rearrange logic
      const newLayout = [...startMenuLayout];
      const sourceIndex = newLayout.findIndex(i => i.id === sourceId);
      const targetIndex = newLayout.findIndex(i => i.id === targetId);
      const [removed] = newLayout.splice(sourceIndex, 1);
      newLayout.splice(targetIndex, 0, removed);
      reorderStartMenu(newLayout);
    }

    setDraggingItemId(null);
    setDragOverItemId(null);
  };

  const handleFolderClick = (id: string) => {
    setExpandedFolderId(id);
  };

  const positionClasses = {
    bottom: 'bottom-14 left-0 animate-in slide-in-from-bottom-2 origin-bottom-left',
    top: 'top-14 left-0 animate-in slide-in-from-top-2 origin-top-left',
    left: 'left-14 top-0 animate-in slide-in-from-left-2 origin-top-left',
    right: 'right-14 top-0 animate-in slide-in-from-right-2 origin-top-right',
  };

  const filteredItems = startMenuLayout.filter(item => {
    if (item.type === 'app' && item.appId) {
      const info = APP_INFO[item.appId];
      if (isKid && (item.appId === 'terminal' || item.appId === 'virus')) return false;
      return info?.label.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (item.type === 'folder' && item.folder) {
      if (searchQuery) return item.folder.name.toLowerCase().includes(searchQuery.toLowerCase());
      return true;
    }
    return false;
  });

  return (
    <div 
      className={cn(
        "absolute w-[360px] h-[520px] glass rounded-2xl border window-shadow p-6 flex flex-col gap-6 z-[10000] shadow-2xl",
        positionClasses[taskbarPosition]
      )}
      onClick={(e) => {
        e.stopPropagation();
        setAppContextMenu(null);
        setFolderContextMenu(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent/60" size={16} />
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps, settings, and files" 
          className="pl-10 bg-white/10 border-white/10 text-foreground placeholder:text-muted-foreground/40 h-10 rounded-xl focus-visible:ring-accent"
        />
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <h3 className={cn("text-[11px] font-bold uppercase tracking-widest mb-4 opacity-80", isSchool ? "text-blue-400" : isKid ? "text-pink-400" : "text-accent")}>
          {searchQuery ? "Search Results" : "Workspace Intelligence"}
        </h3>

        <div className="grid grid-cols-4 gap-4 pb-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              className={cn(
                "group flex flex-col items-center gap-2 p-2 rounded-xl transition-all relative",
                dragOverItemId === item.id && "bg-accent/20 scale-105"
              )}
            >
              {item.type === 'app' ? (
                <button
                  className="flex flex-col items-center gap-2 w-full"
                  onClick={(e) => { e.stopPropagation(); handleAppClick(item.appId!); }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAppContextMenu({ x: e.clientX, y: e.clientY, appId: item.appId! });
                  }}
                >
                  <div className={cn("w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all border border-white/5", isSchool ? "group-hover:bg-blue-500/20 group-hover:border-blue-500/20" : isKid ? "group-hover:bg-pink-500/20 group-hover:border-pink-500/20" : "group-hover:bg-accent/20 group-hover:border-accent/20")}>
                    {React.createElement(APP_INFO[item.appId!].icon, { 
                      className: cn("transition-colors", isSchool ? "group-hover:text-blue-400" : isKid ? "group-hover:text-pink-400" : "group-hover:text-accent"),
                      size: 24 
                    })}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium text-center truncate w-full group-hover:text-white">
                    {APP_INFO[item.appId!].label}
                  </span>
                </button>
              ) : (
                <button
                  className="flex flex-col items-center gap-2 w-full"
                  onClick={(e) => { e.stopPropagation(); handleFolderClick(item.folder!.id); }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFolderContextMenu({ x: e.clientX, y: e.clientY, folderId: item.folder!.id });
                  }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex flex-wrap p-1.5 gap-0.5 border border-accent/20 group-hover:scale-105 transition-all">
                    {item.folder!.apps.slice(0, 4).map(appId => (
                      <div key={appId} className="w-[45%] h-[45%] flex items-center justify-center">
                        {React.createElement(APP_INFO[appId].icon, { size: 10, className: "text-accent" })}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-accent font-bold text-center truncate w-full group-hover:text-white">
                    {item.folder!.name}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className={cn("w-10 h-10 border-2 shrink-0", isSchool ? "border-blue-500/40" : isKid ? "border-pink-500/40" : "border-accent/40")}>
            <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
            <AvatarFallback className="bg-accent/20 text-accent font-bold">
              {currentUser?.username[0].toUpperCase() || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-foreground truncate">{currentUser?.username || 'Guest User'}</span>
            <span className={cn("text-[10px] truncate font-medium uppercase tracking-tighter", isSchool ? "text-blue-400/60" : isKid ? "text-pink-400/60" : "text-accent/60")}>
              {isSchool ? "District Student" : isKid ? "Home Managed" : "Administrator"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-accent rounded-xl" onClick={restart}>
            <RefreshCw size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl" onClick={shutDown}>
            <Power size={20} />
          </Button>
        </div>
      </div>

      {/* Expanded Folder Modal */}
      {expandedFolderId && (
        <div className="absolute inset-0 z-[10001] bg-black/60 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setExpandedFolderId(null)}
            className="absolute top-4 right-4 text-white/40 hover:text-white p-2"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold text-white mb-8">
            {startMenuLayout.find(i => i.folder?.id === expandedFolderId)?.folder?.name}
          </h2>

          <div className="grid grid-cols-3 gap-8 w-full max-w-[280px]">
            {startMenuLayout.find(i => i.folder?.id === expandedFolderId)?.folder?.apps.map(appId => (
              <button
                key={appId}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData('appId', appId);
                  e.dataTransfer.setData('sourceFolderId', expandedFolderId);
                }}
                onClick={() => handleAppClick(appId)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all group-hover:bg-accent/20">
                  {React.createElement(APP_INFO[appId].icon, { size: 28, className: "text-accent" })}
                </div>
                <span className="text-[10px] text-white/60 font-medium text-center truncate w-full group-hover:text-white">
                  {APP_INFO[appId].label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-auto text-[9px] text-white/20 uppercase font-bold tracking-[0.2em]">Drag apps out to ungroup</p>
        </div>
      )}

      {/* Drop area for ungrouping */}
      {expandedFolderId && (
        <div 
          className="absolute -inset-4 z-[10000] pointer-events-none"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const appId = e.dataTransfer.getData('appId') as AppId;
            const sourceFolderId = e.dataTransfer.getData('sourceFolderId');
            if (appId && sourceFolderId) {
              removeAppFromStartFolder(appId, sourceFolderId);
              setExpandedFolderId(null);
            }
          }}
        />
      )}

      {appContextMenu && (
        <StartAppContextMenu 
          x={appContextMenu.x} 
          y={appContextMenu.y} 
          appId={appContextMenu.appId} 
          onClose={() => setAppContextMenu(null)} 
        />
      )}

      {folderContextMenu && (
        <FolderContextMenu 
          x={folderContextMenu.x} 
          y={folderContextMenu.y} 
          folderId={folderContextMenu.folderId} 
          onClose={() => setFolderContextMenu(null)} 
        />
      )}
    </div>
  );
};
