
"use client"

import React, { useState } from 'react';
import { Presentation, Plus, Trash2, ChevronLeft, ChevronRight, Play, Layout, Save, Type, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content';
  background?: string;
}

export const PresentationMaker: React.FC = () => {
  const { importFile } = useOS();
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', title: 'Nebula Slides', content: 'Crafting the future of presentations.', type: 'title' }
  ]);
  const [currentIndex, setCurrentSlideIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const currentSlide = slides[currentIndex];

  const addSlide = () => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Slide',
      content: 'Start typing here...',
      type: 'content'
    };
    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentIndex + 1);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, index - 1));
  };

  const updateSlide = (data: Partial<Slide>) => {
    setSlides(prev => prev.map((s, i) => i === currentIndex ? { ...s, ...data } : s));
  };

  const handleSave = () => {
    const data = JSON.stringify(slides);
    importFile('Presentation.slides', data, data.length, null);
    toast({
      title: "Saved to Drive",
      description: "Your presentation has been saved successfully."
    });
  };

  if (isPreview) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-12">
        <button 
          onClick={() => setIsPreview(false)}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X size={32} />
        </button>

        <div className="w-full max-w-5xl aspect-video bg-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95 duration-500">
          <h1 className={cn(
            "font-black tracking-tighter text-white transition-all",
            currentSlide.type === 'title' ? "text-7xl mb-8" : "text-4xl self-start text-left mb-12 border-b border-white/10 w-full pb-6"
          )}>
            {currentSlide.title}
          </h1>
          <p className={cn(
            "text-white/60 leading-relaxed",
            currentSlide.type === 'title' ? "text-2xl" : "text-xl self-start text-left"
          )}>
            {currentSlide.content}
          </p>
        </div>

        <div className="absolute bottom-12 flex items-center gap-8 text-white/40 font-mono text-xs">
          <button onClick={() => setCurrentSlideIndex(Math.max(0, currentIndex - 1))} className="hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <span>Slide {currentIndex + 1} / {slides.length}</span>
          <button onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentIndex + 1))} className="hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#161d25] overflow-hidden">
      {/* Sidebar Slides List */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Storyboard</h2>
          <Button size="icon" variant="ghost" onClick={addSlide} className="h-7 w-7 text-accent hover:bg-accent/10">
            <Plus size={16} />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {slides.map((slide, i) => (
              <div 
                key={slide.id}
                onClick={() => setCurrentSlideIndex(i)}
                className={cn(
                  "aspect-video rounded-lg border-2 cursor-pointer transition-all relative group overflow-hidden bg-[#1a1a1a] p-3",
                  currentIndex === i ? "border-accent shadow-lg shadow-accent/10" : "border-white/5 hover:border-white/20"
                )}
              >
                <span className="text-[8px] font-mono text-white/20 absolute bottom-1 right-2">{i + 1}</span>
                <div className="space-y-1">
                  <div className="h-1 w-1/2 bg-white/20 rounded-full" />
                  <div className="h-1 w-3/4 bg-white/10 rounded-full" />
                  <div className="h-1 w-full bg-white/5 rounded-full" />
                </div>
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {slides.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSlide(i); }}
                      className="p-1.5 bg-destructive text-white rounded-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-white/5 bg-black/40 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 text-[10px] uppercase font-bold px-3", currentSlide.type === 'title' ? "bg-accent text-primary" : "text-white/40")}
                onClick={() => updateSlide({ type: 'title' })}
              >
                Title
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 text-[10px] uppercase font-bold px-3", currentSlide.type === 'content' ? "bg-accent text-primary" : "text-white/40")}
                onClick={() => updateSlide({ type: 'content' })}
              >
                Content
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="h-9 border-white/10 gap-2 text-white/60">
              <Save size={14} /> Save
            </Button>
            <Button size="sm" onClick={() => setIsPreview(true)} className="h-9 bg-accent text-primary font-bold gap-2">
              <Play size={14} fill="currentColor" /> Present
            </Button>
          </div>
        </div>

        <div className="flex-1 p-12 bg-black/40 overflow-auto flex flex-col items-center">
          <div className="w-full max-w-4xl aspect-video bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/5 p-16 flex flex-col gap-8 transition-all">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-accent tracking-widest pl-1">Headline</label>
              <Input 
                value={currentSlide.title}
                onChange={(e) => updateSlide({ title: e.target.value })}
                className={cn(
                  "bg-transparent border-none text-white focus-visible:ring-0 p-0 h-auto",
                  currentSlide.type === 'title' ? "text-5xl font-black text-center" : "text-2xl font-bold text-left"
                )}
                placeholder="Slide Title"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase text-accent tracking-widest pl-1">Subtext / Content</label>
              <Textarea 
                value={currentSlide.content}
                onChange={(e) => updateSlide({ content: e.target.value })}
                className={cn(
                  "bg-transparent border-none text-white/60 focus-visible:ring-0 p-0 resize-none h-full leading-relaxed",
                  currentSlide.type === 'title' ? "text-xl text-center" : "text-lg text-left"
                )}
                placeholder="Enter slide content here..."
              />
            </div>
          </div>
          
          <div className="mt-12 flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <span>Adaptive Engine v1.0</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>Nebula Slides Rendering Core</span>
          </div>
        </div>
      </div>
    </div>
  );
};
