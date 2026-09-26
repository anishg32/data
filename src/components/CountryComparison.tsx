'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CountryMetric } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { Users, TrendingUp } from 'lucide-react';

interface CountryComparisonProps {
  countryData: CountryMetric[];
  selectedCountries: string[];
  metricKey: string;
  metricLabel: string;
  entityColor?: string;
}

const COUNTRY_COLORS = [
  '#6366f1',
  '#22d3ee',
  '#34d399',
  '#f59e0b',
  '#f43f5e',
  '#a78bfa',
  '#fb923c',
  '#2dd4bf',
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="custom-tooltip">
      <p className="text-xs font-semibold text-white mb-1">{data.countryName}</p>
      <p className="text-sm font-bold" style={{ color: payload[0].fill }}>
        {formatNumber(data.value)}
      </p>
      {data.growth !== undefined && (
        <p className={`text-[10px] mt-1 ${data.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}% growth
        </p>
      )}
      <p className="text-[9px] text-[rgba(200,210,255,0.3)] mt-1 uppercase">DEMO DATA</p>
    </div>
  );
}

export default function CountryComparison({
  countryData,
  selectedCountries,
  metricKey,
  metricLabel,
  entityColor = '#6366f1',
}: CountryComparisonProps) {
  const chartData = useMemo(() => {
    return selectedCountries
      .map((code) => {
        const cd = countryData.find((c) => c.countryCode === code);
        if (!cd) return null;
        const metric = cd.metrics[metricKey];
        const growthMetric = cd.metrics['growth'];

        return {
          countryCode: code,
          countryName: cd.countryName,
          value: metric?.value || 0,
          growth: growthMetric?.value,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.value - a.value);
  }, [countryData, selectedCountries, metricKey]);

  if (chartData.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <Users size={32} className="mx-auto text-[rgba(200,210,255,0.15)] mb-3" />
        <p className="text-sm text-[rgba(200,210,255,0.4)]">
          Select countries on the map to compare
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)]">
            {metricLabel} by Country
          </h3>
        </div>
        <span className="demo-badge">DEMO DATA</span>
      </div>

      {/* Bar Chart */}
      <div style={{ height: Math.max(200, chartData.length * 50) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,255,0.06)" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatNumber}
              tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
              axisLine={{ stroke: 'rgba(100,120,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="countryName"
              tick={{ fontSize: 11, fill: 'rgba(200,210,255,0.5)' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={1200}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Growth ranking */}
      <div className="mt-4 pt-4 border-t border-[rgba(100,120,255,0.08)]">
        <h4 className="text-[10px] uppercase tracking-wider text-[rgba(200,210,255,0.3)] mb-3">
          Growth Ranking
        </h4>
        <div className="grid gap-2">
          {chartData
            .filter((d: any) => d.growth !== undefined)
            .sort((a: any, b: any) => (b.growth || 0) - (a.growth || 0))
            .map((d: any, i: number) => (
              <div key={d.countryCode} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[rgba(200,210,255,0.25)] w-4">#{i + 1}</span>
                  <span className="text-xs text-[rgba(200,210,255,0.6)]">{d.countryName}</span>
                </div>
                <span className={`text-xs font-medium ${d.growth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {d.growth >= 0 ? '+' : ''}{d.growth.toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
