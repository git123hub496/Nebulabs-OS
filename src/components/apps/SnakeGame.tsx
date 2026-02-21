
"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, RotateCcw, Play, Pause, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned inside snake
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prev => {
      const head = prev[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, score, highScore]);

  useEffect(() => {
    const interval = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10));
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="flex flex-col h-full bg-[#0a0f14] p-6 gap-4 items-center overflow-hidden" ref={gameRef} tabIndex={0}>
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Gamepad2 className="text-accent" size={20} />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest">Nebula Snake</h2>
            <p className="text-[10px] text-white/40">Retro Arcade v1.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[9px] text-white/20 uppercase font-bold">Score</p>
            <p className="text-sm font-mono text-accent">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-white/20 uppercase font-bold">Best</p>
            <p className="text-sm font-mono text-accent">{highScore}</p>
          </div>
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[320px] bg-black/40 border border-white/5 rounded-xl overflow-hidden grid grid-cols-20 grid-rows-20">
        <div 
          className="absolute inset-0 grid gap-px" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/[0.02]" />
          ))}
        </div>

        {/* Snake Rendering */}
        {snake.map((p, i) => (
          <div 
            key={i}
            className={cn(
              "absolute rounded-[2px] transition-all duration-100",
              i === 0 ? "bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)] z-10" : "bg-accent/40"
            )}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(p.x * 100) / GRID_SIZE}%`,
              top: `${(p.y * 100) / GRID_SIZE}%`,
            }}
          />
        ))}

        {/* Food Rendering */}
        <div 
          className="absolute bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20 text-center p-6">
            {isGameOver ? (
              <>
                <Trophy className="text-yellow-400 mb-2" size={40} />
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Game Over</h3>
                <p className="text-xs text-white/40 mb-4">You hit a wall or yourself! Final score: {score}</p>
                <Button onClick={resetGame} className="bg-accent text-primary font-bold px-8 rounded-xl">
                  <RotateCcw className="mr-2" size={16} /> Try Again
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                  <Play className="text-accent fill-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight uppercase">Paused</h3>
                <p className="text-[10px] text-white/40 mb-4">Press SPACE or button below to resume</p>
                <Button onClick={() => setIsPaused(false)} className="bg-accent text-primary font-bold px-8 rounded-xl">
                  Resume Game
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex gap-2 mt-auto">
        <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
        <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5" onClick={resetGame}>
          <RotateCcw size={16} />
        </Button>
      </div>
      
      <p className="text-[9px] text-white/20 uppercase font-bold mt-2">Use Arrow Keys to Navigate</p>
    </div>
  );
};
