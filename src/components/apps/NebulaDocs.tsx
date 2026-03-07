
"use client"

import React, { useState } from 'react';
import { useOS } from '@/context/os-context';
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Save, 
  FileText,
  History,
  Share2,
  Printer,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const NebulaDocs: React.FC = () => {
  const { importFile, isOnline } = useOS();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "Offline Mode",
        description: "Cloud saving is restricted while the network stack is interrupted."
      });
      return;
    }

    setIsSaving(true);
    // Simulate cloud save latency
    setTimeout(() => {
      importFile(`${title}.ndoc`, content, content.length, null);
      setIsSaving(false);
      toast({
        title: "Saved Successfully",
        description: `${title} has been backed up to your virtual workspace.`
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] text-[#202124]">
      {/* Menu Bar */}
      <div className="bg-white px-4 py-2 flex flex-col gap-1 border-b border-[#e8eaed]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
            <FileText size={20} />
          </div>
          <div className="flex flex-col">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium bg-transparent border-none outline-none hover:bg-black/5 px-1 rounded transition-colors focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3 text-[11px] font-medium text-[#5f6368]">
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">File</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">Edit</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">View</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">Insert</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">Format</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">Tools</button>
              <button className="hover:bg-black/5 px-1.5 py-0.5 rounded">Help</button>
              {isSaving && <span className="text-blue-600 animate-pulse italic ml-2">Saving...</span>}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-[#5f6368]"><History size={18} /></Button>
            <Button variant="ghost" size="icon" className="text-[#5f6368]"><Share2 size={18} /></Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#f1f3f4] mx-4 my-2 rounded-full px-4 py-1 flex items-center gap-1 shrink-0 border border-[#e8eaed]">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368]"><Printer size={16} /></Button>
        <Separator orientation="vertical" className="h-6 mx-1 bg-[#dadce0]" />
        <div className="flex items-center gap-1 px-2 text-xs font-medium text-[#5f6368] hover:bg-black/5 rounded cursor-pointer h-8">
          100% <ChevronDown size={14} />
        </div>
        <Separator orientation="vertical" className="h-6 mx-1 bg-[#dadce0]" />
        <div className="flex items-center gap-1 px-2 text-xs font-medium text-[#5f6368] hover:bg-black/5 rounded cursor-pointer h-8">
          Normal text <ChevronDown size={14} />
        </div>
        <Separator orientation="vertical" className="h-6 mx-1 bg-[#dadce0]" />
        <div className="flex items-center gap-1 px-2 text-xs font-medium text-[#5f6368] hover:bg-black/5 rounded cursor-pointer h-8">
          Arial <ChevronDown size={14} />
        </div>
        <Separator orientation="vertical" className="h-6 mx-1 bg-[#dadce0]" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368] font-bold"><Bold size={16} /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368] italic"><Italic size={16} /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368] underline"><Underline size={16} /></Button>
        <Separator orientation="vertical" className="h-6 mx-1 bg-[#dadce0]" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368]"><AlignLeft size={16} /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368]"><AlignCenter size={16} /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5f6368]"><AlignRight size={16} /></Button>
      </div>

      {/* Editor Surface */}
      <ScrollArea className="flex-1 bg-[#f8f9fa] flex justify-center py-8">
        <div className="w-full max-w-4xl mx-auto flex justify-center">
          <div className="bg-white shadow-lg border border-[#dadce0] w-[816px] min-h-[1056px] p-[96px] relative animate-in fade-in slide-in-from-bottom-4">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none resize-none text-[11pt] leading-[1.5] font-serif placeholder:text-[#dadce0]"
              placeholder="Start writing..."
              spellCheck={false}
            />
            {/* Visual Ruler Overlay Simulation */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-transparent pointer-events-none" />
          </div>
        </div>
      </ScrollArea>

      <div className="h-8 bg-white border-t border-[#e8eaed] flex items-center px-4 justify-between text-[10px] font-medium text-[#5f6368]">
        <div className="flex items-center gap-4">
          <span>Page 1 of 1</span>
          <span>{content.split(/\s+/).filter(Boolean).length} words</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>All changes saved to Drive</span>
        </div>
      </div>
    </div>
  );
};
