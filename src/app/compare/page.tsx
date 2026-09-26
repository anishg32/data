'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import DataChart from '@/components/DataChart';
import { DEMO_ENTITIES } from '@/lib/demo-data';
import { formatNumber, getCategoryLabel, getCategoryColor } from '@/lib/utils';
import { ArrowRight, Plus, X, BarChart3, GitCompare } from 'lucide-react';
import type { Entity } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

const COMPARE_COLORS = ['#6366f1', '#22d3ee', '#34d399', '#f59e0b', '#f43f5e'];

export default function ComparePage() {
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const addEntity = (entity: Entity) => {
    if (selectedEntities.find((e) => e.id === entity.id)) return;
    if (selectedEntities.length >= 5) return;
    setSelectedEntities((prev) => [...prev, entity]);
    setShowSearch(false);
  };

  const removeEntity = (id: string) => {
    setSelectedEntities((prev) => prev.filter((e) => e.id !== id));
  };

  // Build comparison data
  const comparisonMetrics = useMemo(() => {
    if (selectedEntities.length < 2) return [];

    const metrics: { name: string; data: { name: string; value: number; color: string }[] }[] = [];

    // Primary metric comparison
    const primaryData = selectedEntities.map((entity, i) => ({
      name: entity.name,
      value: entity.globalMetrics[0]?.globalValue?.value || 0,
      color: COMPARE_COLORS[i],
    }));

    if (primaryData.some((d) => d.value > 0)) {
      metrics.push({
        name: 'Primary Metric',
        data: primaryData,
      });
    }

    // Countries available
    const countriesData = selectedEntities.map((entity, i) => ({
      name: entity.name,
      value: entity.countriesAvailable,
      color: COMPARE_COLORS[i],
    }));

    metrics.push({
      name: 'Countries Available',
      data: countriesData,
    });

    return metrics;
  }, [selectedEntities]);

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Compare <span className="gradient-text">Intelligence</span>
            </h1>
            <p className="text-[rgba(200,210,255,0.4)] text-lg">
              Compare entities side-by-side across available metrics
            </p>
          </div>

          {/* Selected entities */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {selectedEntities.map((entity, i) => (
              <div
                key={entity.id}
                className="glass-panel p-4 relative group"
                style={{ borderColor: `${COMPARE_COLORS[i]}30` }}
              >
                <button
                  onClick={() => removeEntity(entity.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <div className="text-center">
                  <span className="text-3xl block mb-2">{entity.logo}</span>
                  <div className="text-sm font-semibold" style={{ color: COMPARE_COLORS[i] }}>
                    {entity.name}
                  </div>
                  <div className="text-[10px] text-[rgba(200,210,255,0.3)] mt-1">
                    {getCategoryLabel(entity.category)}
                  </div>
                </div>
              </div>
            ))}

            {selectedEntities.length < 5 && (
              <button
                onClick={() => setShowSearch(true)}
                className="glass-panel p-4 flex flex-col items-center justify-center gap-2 text-[rgba(200,210,255,0.25)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all min-h-[120px]"
              >
                <Plus size={24} />
                <span className="text-xs">Add Entity</span>
              </button>
            )}
          </div>

          {/* Search overlay */}
          {showSearch && (
            <div className="mb-8 animate-fade-in">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.5)]">
                    Add to Comparison
                  </h3>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="text-[rgba(200,210,255,0.3)] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <SearchBar variant="compact" onSelect={addEntity} autoFocus />
                <div className="flex flex-wrap gap-2 mt-4">
                  {DEMO_ENTITIES.filter(
                    (e) => !selectedEntities.find((s) => s.id === e.id)
                  ).map((entity) => (
                    <button
                      key={entity.id}
                      onClick={() => addEntity(entity)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
                    >
                      <span>{entity.logo}</span>
                      {entity.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comparison content */}
          {selectedEntities.length >= 2 ? (
            <div className="space-y-6">
              {/* Overview comparison */}
              <div className="glass-panel overflow-hidden">
                <div className="p-5 border-b border-[rgba(100,120,255,0.08)]">
                  <div className="flex items-center gap-3">
                    <GitCompare size={14} className="text-indigo-400" />
                    <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)]">
                      Side-by-Side Comparison
                    </h3>
                    <span className="demo-badge ml-auto">DEMO DATA</span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(100,120,255,0.06)]">
                        <th className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-[rgba(200,210,255,0.3)] font-medium">
                          Metric
                        </th>
                        {selectedEntities.map((entity, i) => (
                          <th key={entity.id} className="px-5 py-3 text-right text-[10px] uppercase tracking-wider font-medium" style={{ color: COMPARE_COLORS[i] }}>
                            {entity.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[rgba(100,120,255,0.04)]">
                        <td className="px-5 py-3 text-sm text-[rgba(200,210,255,0.5)]">Category</td>
                        {selectedEntities.map((entity) => (
                          <td key={entity.id} className="px-5 py-3 text-sm text-right">
                            <span
                              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                              style={{
                                color: getCategoryColor(entity.category),
                                background: `${getCategoryColor(entity.category)}15`,
                              }}
                            >
                              {getCategoryLabel(entity.category)}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-[rgba(100,120,255,0.04)]">
                        <td className="px-5 py-3 text-sm text-[rgba(200,210,255,0.5)]">Primary Metric</td>
                        {selectedEntities.map((entity, i) => (
                          <td key={entity.id} className="px-5 py-3 text-sm text-right font-bold" style={{ color: COMPARE_COLORS[i] }}>
                            {entity.globalMetrics[0]?.globalValue?.formattedValue || 'N/A'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-[rgba(100,120,255,0.04)]">
                        <td className="px-5 py-3 text-sm text-[rgba(200,210,255,0.5)]">Countries</td>
                        {selectedEntities.map((entity, i) => (
                          <td key={entity.id} className="px-5 py-3 text-sm text-right" style={{ color: COMPARE_COLORS[i] }}>
                            {entity.countriesAvailable}+
                          </td>
                        ))}
                      </tr>
                      {selectedEntities.some((e) => e.globalMetrics.length > 1) && (
                        <tr>
                          <td className="px-5 py-3 text-sm text-[rgba(200,210,255,0.5)]">Revenue</td>
                          {selectedEntities.map((entity, i) => {
                            const revMetric = entity.globalMetrics.find((m) => m.id === 'revenue');
                            return (
                              <td key={entity.id} className="px-5 py-3 text-sm text-right" style={{ color: COMPARE_COLORS[i] }}>
                                {revMetric?.globalValue?.formattedValue || 'N/A'}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bar chart comparison */}
              {comparisonMetrics.map((metric) => (
                <div key={metric.name} className="glass-panel p-5">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)] mb-4">
                    {metric.name}
                  </h3>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metric.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,255,0.06)" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fill: 'rgba(200,210,255,0.4)' }}
                          axisLine={{ stroke: 'rgba(100,120,255,0.08)' }}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={formatNumber}
                          tick={{ fontSize: 10, fill: 'rgba(200,210,255,0.3)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            return (
                              <div className="custom-tooltip">
                                <p className="text-xs font-semibold text-white">{payload[0].payload.name}</p>
                                <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>
                                  {formatNumber(payload[0].value as number)}
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1200}>
                          {metric.data.map((entry, i) => (
                            <Cell key={i} fill={entry.color} opacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}

              {/* Timeline comparison */}
              {selectedEntities.length >= 2 && selectedEntities[0].globalMetrics[0]?.timeSeries.length > 0 && (
                <div className="glass-panel p-5">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)] mb-4">
                    Growth Over Time
                  </h3>
                  <p className="text-xs text-[rgba(200,210,255,0.3)] mb-4">
                    Note: Metrics may not be directly comparable across different entity types
                  </p>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {selectedEntities.map((entity, i) => {
                      const ts = entity.globalMetrics[0]?.timeSeries;
                      if (!ts?.length) return null;
                      return (
                        <DataChart
                          key={entity.id}
                          data={ts}
                          title={`${entity.name} — ${entity.globalMetrics[0].name}`}
                          unit={entity.globalMetrics[0].globalValue?.unit || 'users'}
                          color={COMPARE_COLORS[i]}
                          type="area"
                          height={200}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="glass-panel p-16 text-center">
              <BarChart3 size={48} className="mx-auto text-[rgba(200,210,255,0.1)] mb-6" />
              <h3 className="text-xl font-bold mb-3">
                {selectedEntities.length === 0
                  ? 'Start Comparing'
                  : 'Add Another Entity'}
              </h3>
              <p className="text-[rgba(200,210,255,0.4)] max-w-md mx-auto mb-8">
                {selectedEntities.length === 0
                  ? 'Add two or more entities to compare their available data side by side.'
                  : 'Add at least one more entity to begin the comparison.'}
              </p>
              <button
                onClick={() => setShowSearch(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors"
              >
                <Plus size={16} />
                Add Entity
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden h-16" />
    </main>
  );
}
