"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Note: In a real app, use a safer math library instead of eval
      // eslint-disable-next-line no-eval
      const result = eval(fullEquation.replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] p-6 w-full overflow-hidden">
      <div className="bg-black/40 rounded-2xl p-6 mb-6 text-right border border-white/5 shadow-inner">
        <div className="text-[10px] text-accent/40 h-4 mb-1 font-mono tracking-wider">{equation}</div>
        <div className="text-4xl font-bold text-white tracking-tighter overflow-hidden truncate font-mono">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 flex-1">
        <Button onClick={clear} variant="outline" className="h-full bg-white/5 border-white/10 text-destructive hover:bg-destructive hover:text-white rounded-xl text-lg font-bold">AC</Button>
        <Button onClick={() => handleOperator('÷')} variant="outline" className="h-full bg-white/5 border-white/10 text-accent hover:bg-accent/20 rounded-xl text-xl font-bold">÷</Button>
        <Button onClick={() => handleOperator('×')} variant="outline" className="h-full bg-white/5 border-white/10 text-accent hover:bg-accent/20 rounded-xl text-xl font-bold">×</Button>
        <Button onClick={() => handleOperator('-')} variant="outline" className="h-full bg-white/5 border-white/10 text-accent hover:bg-accent/20 rounded-xl text-xl font-bold">-</Button>

        {[7, 8, 9].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-full bg-white/5 border-white/10 text-white/80 hover:bg-white/10 rounded-xl text-xl font-medium">{n}</Button>
        ))}
        <Button onClick={() => handleOperator('+')} variant="outline" className="h-full bg-white/5 border-white/10 text-accent hover:bg-accent/20 rounded-xl text-xl font-bold">+</Button>

        {[4, 5, 6].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-full bg-white/5 border-white/10 text-white/80 hover:bg-white/10 rounded-xl text-xl font-medium">{n}</Button>
        ))}
        <Button onClick={calculate} className="h-full row-span-2 bg-accent text-primary-foreground hover:bg-accent/90 rounded-xl text-3xl font-black shadow-lg shadow-accent/20">=</Button>

        {[1, 2, 3].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-full bg-white/5 border-white/10 text-white/80 hover:bg-white/10 rounded-xl text-xl font-medium">{n}</Button>
        ))}

        <Button onClick={() => handleNumber('0')} variant="outline" className="h-full col-span-2 bg-white/5 border-white/10 text-white/80 hover:bg-white/10 rounded-xl text-xl font-medium">0</Button>
        <Button onClick={() => handleNumber('.')} variant="outline" className="h-full bg-white/5 border-white/10 text-white/80 hover:bg-white/10 rounded-xl text-xl font-medium">.</Button>
      </div>
    </div>
  );
};
