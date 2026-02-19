"use client"

import React from 'react';
import { useOS } from '@/context/os-context';
import { Textarea } from '@/components/ui/textarea';
import { Save, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Notes: React.FC = () => {
  const { notes, setNotes } = useOS();

  return (
    <div className="flex flex-col h-full bg-[#1e2731]">
      <div className="p-2 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <FileText size={16} className="text-accent" />
          <span className="text-xs font-medium text-white/60">untitled.txt</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-accent" onClick={() => setNotes(notes)}>
            <Save size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-destructive" onClick={() => setNotes("")}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className="flex-1 p-0">
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start typing your thoughts..."
          className="w-full h-full resize-none border-none bg-transparent focus-visible:ring-0 text-white/80 p-6 font-mono text-sm leading-relaxed"
        />
      </div>
      <div className="p-2 bg-black/10 border-t border-white/5 flex justify-between px-4">
        <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Autosave Active</span>
        <span className="text-[10px] text-white/30">{notes.length} characters</span>
      </div>
    </div>
  );
};