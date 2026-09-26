'use client';

import { useState, useRef, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber, formatCurrency } from '@/lib/utils';
import type { TimeSeriesPoint } from '@/lib/types';

interface DataChartProps {
  data: TimeSeriesPoint[];
  title: string;
  unit?: string;
  color?: string;
  type?: 'area' | 'bar' | 'line';
  height?: number;
}

function CustomTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;

  return (
    <div className="custom-tooltip">
      <p className="text-xs text-[rgba(200,210,255,0.5)] mb-1">{label}</p>
      <p className="text-sm font-bold text-white">
        {unit === 'USD' ? formatCurrency(value) : formatNumber(value)}
      </p>
      <p className="text-[9px] text-[rgba(200,210,255,0.3)] mt-1 uppercase tracking-wider">
        {payload[0].payload.dataType}
      </p>
    </div>
  );
}

export default function DataChart({
  data,
  title,
  unit = 'users',
  color = '#6366f1',
  type = 'area',
  height = 280,
}: DataChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const formatYAxis = (value: number) => {
    if (unit === 'USD') return formatCurrency(value);
    return formatNumber(value);
  };

  const chartData = data.map((d) => ({
    ...d,
    name: d.date,
  }));

  return (
    <div ref={ref} className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[rgba(200,210,255,0.6)] uppercase tracking-wider">
          {title}
        </h3>
        <span className="demo-badge">DEMO DATA</span>
      </div>

      <div
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,255,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={{ stroke: 'rgba(100,120,255,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,255,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={{ stroke: 'rgba(100,120,255,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                opacity={0.8}
                animationDuration={1500}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,255,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={{ stroke: 'rgba(100,120,255,0.08)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3 }}
                activeDot={{ r: 5, fill: color }}
                animationDuration={2000}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
