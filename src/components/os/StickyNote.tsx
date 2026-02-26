
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useOS, StickyNote as StickyNoteType } from '@/context/os-context';
import { X, Plus, Palette, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StickyNoteProps {
  note: StickyNoteType;
}

const COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Pink', value: '#fbcfe8' },
  { name: 'Slate', value: '#e2e8f0' },
];

export const StickyNote: React.FC<StickyNoteProps> = ({ note }) => {
  const { updateStickyNote, deleteStickyNote, createStickyNote } = useOS();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    const rect = noteRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateStickyNote(note.id, {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, note.id, updateStickyNote]);

  return (
    <div
      ref={noteRef}
      className={cn(
        "fixed w-64 h-64 shadow-xl border border-black/5 flex flex-col transition-all duration-75 group",
        isDragging ? "z-[1000] scale-105 shadow-2xl" : "z-10"
      )}
      style={{
        left: note.x,
        top: note.y,
        backgroundColor: note.color,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Note Header */}
      <div className="h-8 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
        <div className="flex items-center gap-1">
          <button 
            onClick={createStickyNote}
            className="p-1 hover:bg-black/10 rounded transition-colors text-black/40 hover:text-black"
            title="New Note"
          >
            <Plus size={14} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1 hover:bg-black/10 rounded transition-colors text-black/40 hover:text-black"
                title="Color"
              >
                <Palette size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-white/10 p-1 min-w-[120px]">
              {COLORS.map(c => (
                <DropdownMenuItem 
                  key={c.name}
                  onClick={() => updateStickyNote(note.id, { color: c.value })}
                  className="gap-2 text-[10px] font-bold uppercase cursor-pointer"
                >
                  <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.value }} />
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button 
          onClick={() => deleteStickyNote(note.id)}
          className="p-1 hover:bg-red-500/20 rounded transition-colors text-black/40 hover:text-red-600"
          title="Delete Note"
        >
          <X size={14} />
        </button>
      </div>

      {/* Note Content */}
      <textarea
        value={note.content}
        onChange={(e) => updateStickyNote(note.id, { content: e.target.value })}
        className="flex-1 bg-transparent border-none outline-none p-4 text-black/80 font-medium text-sm resize-none selection:bg-black/10"
        placeholder="Type something..."
      />

      {/* Drag Indicator */}
      <div className="absolute bottom-1 right-1 opacity-20 pointer-events-none">
        <MoreHorizontal size={12} className="text-black" />
      </div>
    </div>
  );
};
