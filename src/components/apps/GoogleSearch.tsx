
"use client"

import React, { useEffect } from 'react';
import { Search, ShieldCheck, Globe } from 'lucide-react';

export const GoogleSearch: React.FC = () => {
  useEffect(() => {
    // Check if script is already present to avoid duplicates
    if (!document.getElementById('google-cse-script')) {
      const script = document.createElement('script');
      script.id = 'google-cse-script';
      script.src = "https://cse.google.com/cse.js?cx=e3968982df5d3426b";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* App Toolbar */}
      <div className="h-10 border-b border-black/5 bg-slate-50 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Search size={14} className="text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Nebula Search Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} className="text-green-600" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Programmable Module Active</span>
        </div>
      </div>

      {/* Search Content */}
      <div className="flex-1 overflow-auto p-6 custom-google-styles">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2 py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Search size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Nebula<span className="text-blue-600">Search</span></h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">Powered by Google Programmable Search Intelligence</p>
          </div>

          {/* The CSE Container */}
          <div className="min-h-[400px]">
            <div className="gcse-search"></div>
          </div>
        </div>
      </div>

      <div className="h-8 bg-slate-100 border-t border-black/5 flex items-center px-4 justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Globe size={10} />
          <span>Global Index Authorization: CX-E39689</span>
        </div>
        <span>Nebulabs Search Proxy v1.0</span>
      </div>

      <style jsx global>{`
        .custom-google-styles .gsc-control-cse {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
        .custom-google-styles .gsc-search-button-v2 {
          background-color: #2563eb !important;
          border-color: #2563eb !important;
          border-radius: 8px !important;
        }
        .custom-google-styles input.gsc-input {
          border-radius: 8px !important;
          border: 1px solid #e2e8f0 !important;
          padding: 8px 12px !important;
        }
      `}</style>
    </div>
  );
};
