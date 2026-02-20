"use client"

import React, { useState } from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  time: string;
  location: string;
  category: string;
}

const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'OS Steering Meeting', time: '10:00 AM', location: 'Virtual Room 4', category: 'Work' },
  { id: '2', title: 'Nebula AI Sprint Review', time: '1:30 PM', location: 'Main Stage', category: 'Development' },
  { id: '3', title: 'System Security Audit', time: '4:00 PM', location: 'Server Lab', category: 'Security' },
  { id: '4', title: 'Community Feedback Session', time: 'Tomorrow 11:00 AM', location: 'Global Feed', category: 'Social' },
];

export const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events] = useState<Event[]>(MOCK_EVENTS);

  return (
    <div className="flex h-full bg-[#161d25]">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-white/5 bg-black/20 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon size={20} className="text-accent" />
              <h2 className="font-bold text-lg">My Nebula</h2>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-accent hover:bg-accent/10">
              <Plus size={18} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <Input className="h-9 pl-9 bg-white/5 border-white/10 text-xs" placeholder="Search events..." />
          </div>
        </div>

        <div className="p-4 flex flex-col items-center">
          <CalendarUI 
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border border-white/10 glass shadow-2xl"
            classNames={{
              day_selected: "bg-accent text-primary hover:bg-accent/80 font-bold",
              day_today: "bg-white/10 text-accent font-bold",
            }}
          />
        </div>

        <div className="flex-1 p-6 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent text-[9px] uppercase tracking-tighter">
                      {event.category}
                    </Badge>
                    <span className="text-[10px] text-white/20 font-mono">{event.time}</span>
                  </div>
                  <h4 className="text-sm font-bold leading-tight mb-2 group-hover:text-accent transition-colors">{event.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <MapPin size={10} className="text-accent" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-white/5 bg-black/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-white/90">
              {date?.toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </h1>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest">Day</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-accent">Month</Button>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest">Year</Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 rounded-xl border-white/10 text-xs gap-2">
              <Clock size={14} className="text-accent" />
              Schedule Event
            </Button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-full">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-black/40 p-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/20 border-b border-white/5">
                {day}
              </div>
            ))}
            {/* Simple Grid Simulation */}
            {[...Array(35)].map((_, i) => {
              const dayNum = i - 3; // Offset for demo
              const isToday = dayNum === new Date().getDate();
              const hasEvent = [5, 12, 18, 24].includes(dayNum);
              
              return (
                <div key={i} className={cn(
                  "bg-white/5 p-4 min-h-[120px] relative transition-colors hover:bg-white/[0.07] group",
                  dayNum <= 0 || dayNum > 31 ? "opacity-20 pointer-events-none" : ""
                )}>
                  {dayNum > 0 && dayNum <= 31 && (
                    <>
                      <span className={cn(
                        "text-xs font-bold",
                        isToday ? "text-accent" : "text-white/40"
                      )}>
                        {dayNum}
                      </span>
                      {hasEvent && (
                        <div className="mt-2 space-y-1">
                          <div className="bg-accent/20 border border-accent/40 p-1.5 rounded-lg text-[9px] font-bold text-accent truncate">
                            Project Nebula
                          </div>
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-white/20 hover:text-accent transition-opacity">
                        <Plus size={14} />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
