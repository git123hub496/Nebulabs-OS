"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col h-full bg-[#1a1a1a] p-6 max-w-sm mx-auto">
      <div className="bg-black/40 rounded-xl p-6 mb-6 text-right border border-white/5">
        <div className="text-[10px] text-white/30 h-4 mb-1 font-mono">{equation}</div>
        <div className="text-3xl font-bold text-white tracking-tighter overflow-hidden truncate">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={clear} variant="outline" className="h-14 bg-white/5 border-white/10 text-destructive hover:bg-destructive hover:text-white">AC</Button>
        <Button onClick={() => handleOperator('÷')} variant="outline" className="h-14 bg-white/5 border-white/10 text-accent">÷</Button>
        <Button onClick={() => handleOperator('×')} variant="outline" className="h-14 bg-white/5 border-white/10 text-accent">×</Button>
        <Button onClick={() => handleOperator('-')} variant="outline" className="h-14 bg-white/5 border-white/10 text-accent">-</Button>

        {[7, 8, 9].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-14 bg-white/5 border-white/10 text-white/80">{n}</Button>
        ))}
        <Button onClick={() => handleOperator('+')} variant="outline" className="h-14 bg-white/5 border-white/10 text-accent">+</Button>

        {[4, 5, 6].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-14 bg-white/5 border-white/10 text-white/80">{n}</Button>
        ))}
        <Button onClick={calculate} className="h-28 row-span-2 bg-accent text-primary hover:bg-accent/80 font-bold">=</Button>

        {[1, 2, 3].map(n => (
          <Button key={n} onClick={() => handleNumber(String(n))} variant="outline" className="h-14 bg-white/5 border-white/10 text-white/80">{n}</Button>
        ))}

        <Button onClick={() => handleNumber('0')} variant="outline" className="h-14 col-span-2 bg-white/5 border-white/10 text-white/80">0</Button>
        <Button onClick={() => handleNumber('.')} variant="outline" className="h-14 bg-white/5 border-white/10 text-white/80">.</Button>
      </div>
    </div>
  );
};