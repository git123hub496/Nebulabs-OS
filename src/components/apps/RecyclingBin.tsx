
"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { Trash2, RotateCcw, XCircle, Folder, File, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const RecyclingBin: React.FC = () => {
  const { trash, restoreFromTrash, emptyTrash, deleteItemPermanently } = useOS();

  return (
    <div className="flex flex-col h-full bg-[#1e2731]">
      {/* App Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/10">
        <div className="flex items-center gap-3">
          <Trash2 className="text-accent" size={20} />
          <div>
            <h2 className="text-sm font-bold">Recycling Bin</h2>
            <p className="text-[10px] text-white/40">{trash.length} items waiting for processing</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-bold gap-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all"
            onClick={emptyTrash}
            disabled={trash.length === 0}
          >
            <XCircle size={14} />
            Empty Bin
          </Button>
        </div>
      </div>

      {/* Main Area */}
      {trash.length > 0 ? (
        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trash.map(item => (
              <div 
                key={item.id}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 transition-all relative"
              >
                <div className="w-16 h-16 flex items-center justify-center relative">
                  {item.type === 'folder' ? (
                    <Folder size={48} className="text-accent/60 fill-accent/5" />
                  ) : (
                    <File size={40} className="text-white/20" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl gap-2">
                    <button 
                      onClick={() => restoreFromTrash(item.id)}
                      className="p-1.5 bg-accent text-primary rounded-lg hover:scale-110 transition-transform"
                      title="Restore"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button 
                      onClick={() => deleteItemPermanently(item.id)}
                      className="p-1.5 bg-destructive text-white rounded-lg hover:scale-110 transition-transform"
                      title="Delete Permanently"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
                <span className="text-[11px] text-white/80 text-center truncate w-full px-1">{item.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
            <Trash2 size={40} className="text-white/20" />
          </div>
          <h3 className="text-lg font-bold mb-1">Bin is Empty</h3>
          <p className="text-xs max-w-[200px]">Deleted items will appear here before they are permanently removed.</p>
        </div>
      )}

      {/* Footer Hint */}
      {trash.length > 0 && (
        <div className="p-3 bg-accent/5 border-t border-white/5 flex items-center gap-2 justify-center">
          <Sparkles size={12} className="text-accent" />
          <span className="text-[10px] text-accent/60 font-medium">Items in the bin still consume storage space.</span>
        </div>
      )}
    </div>
  );
};
