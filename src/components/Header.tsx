import React from 'react';
import { CheckCircle2, LayoutGrid, BarChart3, Users, Download } from 'lucide-react';

interface HeaderProps {
  currentTab: 'roll-call' | 'seating' | 'analytics' | 'roster';
  onSelectTab: (tab: 'roll-call' | 'seating' | 'analytics' | 'roster') => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onExport }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#4338CA] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              AP
            </div>
            <a
              href="#roll-call"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('roll-call');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-[#4338CA] transition-colors"
            >
              Academic Pulse
            </a>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-6 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => onSelectTab('roll-call')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors min-h-[44px] ${
                currentTab === 'roll-call'
                  ? 'text-[#4338CA] bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Roll Call</span>
            </button>

            <button
              onClick={() => onSelectTab('seating')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors min-h-[44px] ${
                currentTab === 'seating'
                  ? 'text-[#4338CA] bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Seating Chart</span>
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors min-h-[44px] ${
                currentTab === 'analytics'
                  ? 'text-[#4338CA] bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => onSelectTab('roster')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors min-h-[44px] ${
                currentTab === 'roster'
                  ? 'text-[#4338CA] bg-indigo-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Roster</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
              title="Export Current Roster & Attendance"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
