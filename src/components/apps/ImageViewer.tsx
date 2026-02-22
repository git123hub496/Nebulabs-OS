
"use client"

import React from 'react';
import { ExternalLink, Maximize2, Minimize2, ZoomIn, ZoomOut, ShieldCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOS } from '@/context/os-context';
import { toast } from '@/hooks/use-toast';

interface ImageViewerProps {
  src?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ src }) => {
  const { importFile } = useOS();

  const handleVirtualDownload = () => {
    if (!src) return;
    const fileName = `nebula_export_${Date.now()}.png`;
    // Intercept physical download and save to virtual file system instead
    importFile(fileName, src, Math.round(src.length * 0.75), null);
    
    toast({
      title: "Saved to Nebula Drive",
      description: `${fileName} has been added to your root folder.`,
    });
  };

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#161d25] text-white/40 gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ShieldCheck size={32} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold">No Image Selected</p>
          <p className="text-[10px] uppercase tracking-widest">Select a file from Nebulabs Drive</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] relative overflow-hidden group">
      {/* App Toolbar Overlay */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black/60 to-transparent z-20 flex items-center px-4 justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-accent/20 backdrop-blur-md rounded text-[9px] font-black text-accent uppercase tracking-tighter border border-accent/20">
            NEBULA IMAGE RENDERER
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" asChild>
            <a href={src} target="_blank" rel="noopener noreferrer" title="View Source">
              <ExternalLink size={14} />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" 
            onClick={handleVirtualDownload}
            title="Download to Nebula Drive"
          >
            <Download size={14} />
          </Button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-auto custom-scrollbar">
        {/* Transparency Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 shadow-2xl rounded-sm overflow-hidden border border-white/5 bg-black/40">
          <img 
            src={src} 
            alt="Nebulabs Preview" 
            className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-500"
          />
        </div>
      </div>

      {/* Info Footer */}
      <div className="h-10 bg-black/40 border-t border-white/5 backdrop-blur-xl flex items-center px-4 justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workspace Encrypted View</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[9px] font-mono text-white/20">MIME: IMAGE/PNG</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white/20">
            <ZoomIn size={12} />
            <span className="text-[10px] font-bold">100%</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};
