
"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Palette, Eraser, Trash2, Download, Save, Undo, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useOS } from '@/context/os-context';
import { cn } from '@/lib/utils';

export const Paint: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#9333ea");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [history, setHistory] = useState<string[]>([]);
  const { importFile } = useOS();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions based on container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext("2d");
    if (context) {
      context.scale(2, 2);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;
      
      // Fill background
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const data = canvas.toDataURL();
      setHistory(prev => [...prev, data].slice(-20));
    }
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = nativeEvent as any;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent as any;
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      contextRef.current.lineWidth = brushSize;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current?.closePath();
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const lastState = newHistory[newHistory.length - 1];
      
      const img = new Image();
      img.src = lastState;
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
        setHistory(newHistory);
      };
    }
  };

  const saveToDrive = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const data = canvas.toDataURL("image/png");
      const fileName = `sketch_${Date.now()}.png`;
      importFile(fileName, data, Math.round(data.length * 0.75), null);
      toast({
        title: "Exported to Drive",
        description: `${fileName} has been saved to your Pictures folder.`
      });
    }
  };

  const colors = [
    "#000000", "#ffffff", "#9333ea", "#3b82f6", "#e11d48", 
    "#f97316", "#16a34a", "#64748b", "#facc15", "#db2777"
  ];

  return (
    <div className="flex flex-col h-full bg-[#1e2731]">
      {/* Toolbar */}
      <div className="h-14 border-b border-white/5 bg-black/20 flex items-center px-4 justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", tool === 'brush' ? "bg-accent text-primary" : "text-white/40")}
              onClick={() => setTool('brush')}
            >
              <Palette size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", tool === 'eraser' ? "bg-accent text-primary" : "text-white/40")}
              onClick={() => setTool('eraser')}
            >
              <Eraser size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <div className="flex items-center gap-2">
            {colors.map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setTool('brush'); }}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                  color === c && tool === 'brush' ? "border-white scale-110 shadow-lg" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <span className="text-[10px] font-bold text-white/40 uppercase whitespace-nowrap">Size</span>
          <Slider 
            value={[brushSize]} 
            min={1} 
            max={50} 
            onValueChange={v => setBrushSize(v[0])}
            className="cursor-pointer"
          />
          <span className="text-[10px] font-mono text-accent w-6">{brushSize}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white" onClick={handleUndo} title="Undo">
            <Undo size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-destructive" onClick={clearCanvas} title="Clear Canvas">
            <Trash2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/10" onClick={saveToDrive} title="Save to Drive">
            <Save size={16} />
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 p-8 bg-[#161d25] relative overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white shadow-2xl rounded-sm cursor-crosshair max-w-full max-h-full"
        />
      </div>

      <div className="h-8 bg-black/40 border-t border-white/5 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Nebula Creative Suite v1.0</span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[9px] font-mono text-white/20">RES: 1800x1400 Virtual DPI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-bold text-white/40 uppercase">Canvas Ready</span>
        </div>
      </div>
    </div>
  );
};
