
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag, RotateCcw, Trophy, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLS = 10;
const ROWS = 12;
const MINES = 15;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export const Minesweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [minesRemaining, setMinesRemaining] = useState(MINES);

  const initGrid = useCallback(() => {
    // 1. Create empty grid
    let newGrid: Cell[][] = Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // 2. Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; r + dr < ROWS && dr <= 1; dr++) {
          if (r + dr < 0) continue;
          for (let dc = -1; c + dc < COLS && dc <= 1; dc++) {
            if (c + dc < 0) continue;
            if (newGrid[r + dr][c + dc].isMine) count++;
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    setGrid(newGrid);
    setStatus('playing');
    setMinesRemaining(MINES);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const revealCell = (r: number, c: number) => {
    if (status !== 'playing' || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    let newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      // Game Over
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setGrid(newGrid);
      setStatus('lost');
      return;
    }

    const floodReveal = (row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      
      newGrid[row][col].isRevealed = true;
      
      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodReveal(row + dr, col + dc);
          }
        }
      }
    };

    floodReveal(r, c);
    setGrid(newGrid);

    // Check Win
    let hiddenNonMines = 0;
    newGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) hiddenNonMines++;
    }));
    if (hiddenNonMines === 0) setStatus('won');
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status !== 'playing' || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const isFlagged = !newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = isFlagged;
    setGrid(newGrid);
    setMinesRemaining(prev => isFlagged ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#161d25] p-6 gap-4 items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Bomb className="text-accent" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">Minesweeper</h2>
            <p className="text-[10px] text-white/40">Strategy v1.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] text-white/20 uppercase font-bold">Mines</p>
            <p className="text-sm font-mono text-accent">{minesRemaining}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10 text-accent" onClick={initGrid}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 bg-black/20 p-2 rounded-xl border border-white/5">
        {grid.map((row, r) => row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => revealCell(r, c)}
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={cn(
              "w-7 h-7 rounded-[4px] flex items-center justify-center text-[10px] font-black transition-all",
              cell.isRevealed 
                ? (cell.isMine ? "bg-rose-500/20 text-rose-500" : "bg-white/5 text-accent shadow-inner") 
                : "bg-accent/20 border border-accent/10 hover:bg-accent/30 active:scale-95"
            )}
          >
            {cell.isRevealed ? (
              cell.isMine ? <Bomb size={12} /> : (cell.neighborMines > 0 ? cell.neighborMines : "")
            ) : (
              cell.isFlagged ? <Flag size={10} className="text-rose-500" /> : ""
            )}
          </button>
        )))}
      </div>

      {status !== 'playing' && (
        <div className="mt-auto w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            {status === 'won' ? (
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Trophy className="text-green-500" size={20} />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Skull className="text-rose-500" size={20} />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">
                {status === 'won' ? "Mission Success!" : "Game Over"}
              </p>
              <p className="text-[10px] text-white/40">
                {status === 'won' ? "All mines cleared." : "You stepped on a mine."}
              </p>
            </div>
          </div>
          <Button onClick={initGrid} size="sm" className="bg-accent text-primary font-bold rounded-xl px-4">
            Play Again
          </Button>
        </div>
      )}

      <p className="text-[9px] text-white/20 uppercase font-bold mt-auto">Left Click: Reveal • Right Click: Flag</p>
    </div>
  );
};
