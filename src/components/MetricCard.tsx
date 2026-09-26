'use client';

import { useRef, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Info, ExternalLink } from 'lucide-react';
import type { MetricValue, DataType } from '@/lib/types';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: MetricValue | null;
  icon?: React.ReactNode;
  color?: string;
  showSource?: boolean;
  growth?: number;
  delay?: number;
}

function DataTypeBadge({ type }: { type: DataType }) {
  const styles: Record<DataType, string> = {
    REPORTED: 'badge-reported',
    ESTIMATED: 'badge-estimated',
    CALCULATED: 'badge-calculated',
    UNAVAILABLE: 'badge-unavailable',
  };

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded ${styles[type]}`}>
      {type}
    </span>
  );
}

export default function MetricCard({
  label,
  value,
  icon,
  color = '#6366f1',
  showSource = false,
  growth,
  delay = 0,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  // Count-up animation
  useEffect(() => {
    if (!isVisible || !value?.value) return;

    const end = value.value;
    const duration = 1500;
    let startTime: number;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * end));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, value?.value]);

  const formatDisplayValue = (v: number) => {
    if (!value) return 'N/A';
    if (value.unit === 'USD') return formatCurrency(v);
    if (value.unit === '%') return `${(v / 10).toFixed(1)}%`;
    return formatNumber(v);
  };

  if (!value || value.value === null) {
    return (
      <div ref={ref} className="metric-card glass-panel p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-[rgba(200,210,255,0.3)]">{icon}</span>}
          <span className="text-xs text-[rgba(200,210,255,0.4)] uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
        <div className="text-sm text-[rgba(200,210,255,0.3)] italic">
          Data unavailable
        </div>
        <DataTypeBadge type="UNAVAILABLE" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`metric-card glass-panel p-5 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span style={{ color }}>{icon}</span>}
          <span className="text-xs text-[rgba(200,210,255,0.4)] uppercase tracking-wider font-medium">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="demo-badge">DEMO</span>
          <DataTypeBadge type={value.dataType} />
        </div>
      </div>

      {/* Value */}
      <div className="count-up text-3xl font-bold mb-2" style={{ color }}>
        {isVisible ? formatDisplayValue(displayValue) : '—'}
      </div>

      {/* Growth indicator */}
      {growth !== undefined && (
        <div className="flex items-center gap-1.5 mb-3">
          {growth >= 0 ? (
            <TrendingUp size={14} className="text-emerald-400" />
          ) : (
            <TrendingDown size={14} className="text-rose-400" />
          )}
          <span className={`text-sm font-medium ${growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </span>
          <span className="text-[10px] text-[rgba(200,210,255,0.3)]">vs prev period</span>
        </div>
      )}

      {/* Source info */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[rgba(200,210,255,0.25)]">
          {value.date} · {value.source.dataPeriod}
        </span>
        <button
          onClick={() => setShowSourceInfo(!showSourceInfo)}
          className="text-[rgba(200,210,255,0.25)] hover:text-indigo-400 transition-colors"
        >
          <Info size={12} />
        </button>
      </div>

      {/* Expandable source */}
      {showSourceInfo && (
        <div className="mt-3 pt-3 border-t border-[rgba(100,120,255,0.08)] animate-fade-in text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[rgba(200,210,255,0.3)]">Source</span>
            <span className="text-[rgba(200,210,255,0.5)]">{value.source.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[rgba(200,210,255,0.3)]">Period</span>
            <span className="text-[rgba(200,210,255,0.5)]">{value.source.dataPeriod}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[rgba(200,210,255,0.3)]">Collected</span>
            <span className="text-[rgba(200,210,255,0.5)]">{value.source.collectionDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[rgba(200,210,255,0.3)]">Confidence</span>
            <span className="text-[rgba(200,210,255,0.5)]">{Math.round(value.source.confidence * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTypeBadge };
