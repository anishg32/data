'use client';

import { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineProps {
  availableYears: string[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const QUICK_RANGES = [
  { label: '1Y', value: '1year' },
  { label: '3Y', value: '3years' },
  { label: '5Y', value: '5years' },
  { label: 'ALL', value: 'all' },
];

export default function Timeline({ availableYears, selectedPeriod, onPeriodChange }: TimelineProps) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-3 mb-4">
        <Clock size={14} className="text-cyan-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)]">
          Time Machine
        </h3>
        <span className="text-[10px] text-cyan-400/60 ml-auto">How has this changed over time?</span>
      </div>

      {/* Quick ranges */}
      <div className="flex items-center gap-2 mb-4">
        {QUICK_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onPeriodChange(range.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPeriod === range.value
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-[rgba(200,210,255,0.4)] border border-transparent hover:border-white/10'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => onPeriodChange(year)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedPeriod === year
                ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                : 'text-[rgba(200,210,255,0.35)] hover:text-[rgba(200,210,255,0.6)] hover:bg-white/5'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Timeline visual */}
      <div className="mt-4 relative h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
          style={{
            width: `${
              selectedPeriod === 'all'
                ? 100
                : selectedPeriod === '5years'
                  ? 80
                  : selectedPeriod === '3years'
                    ? 50
                    : selectedPeriod === '1year'
                      ? 20
                      : ((availableYears.indexOf(selectedPeriod) + 1) / availableYears.length) * 100
            }%`,
          }}
        />
      </div>
    </div>
  );
}
