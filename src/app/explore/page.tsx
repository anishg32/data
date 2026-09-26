'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import { DEMO_ENTITIES } from '@/lib/demo-data';
import { getCategoryLabel, getCategoryColor, timeAgo } from '@/lib/utils';
import { ArrowRight, Filter, Grid3x3, List, Globe } from 'lucide-react';
import type { EntityCategory } from '@/lib/types';

const CATEGORIES: (EntityCategory | 'ALL')[] = [
  'ALL',
  'APP',
  'PRODUCT',
  'MOVIE',
  'GAME',
  'COMPANY',
  'SERVICE',
  'WEBSITE',
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<EntityCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEntities = useMemo(() => {
    if (selectedCategory === 'ALL') return DEMO_ENTITIES;
    return DEMO_ENTITIES.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Explore <span className="gradient-text">Data</span>
            </h1>
            <p className="text-[rgba(200,210,255,0.4)] text-lg">
              Search an app, product, movie, company or service
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-3xl">
            <SearchBar variant="hero" autoFocus />
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/5 text-[rgba(200,210,255,0.35)] border border-transparent hover:border-white/10 hover:text-[rgba(200,210,255,0.6)]'
                }`}
              >
                {cat === 'ALL' ? 'All' : getCategoryLabel(cat)}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'text-indigo-400 bg-indigo-500/10' : 'text-[rgba(200,210,255,0.25)]'
                }`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'text-indigo-400 bg-indigo-500/10' : 'text-[rgba(200,210,255,0.25)]'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-[rgba(200,210,255,0.4)]">
              {filteredEntities.length} results
            </span>
            <span className="demo-badge">DEMO DATA</span>
          </div>

          {/* Entity Grid */}
          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntities.map((entity, i) => (
                <Link
                  key={entity.id}
                  href={`/entity/${entity.id}`}
                  className="glass-panel p-6 group hover:glow-accent transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{entity.logo}</span>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded"
                      style={{
                        color: getCategoryColor(entity.category),
                        background: `${getCategoryColor(entity.category)}15`,
                      }}
                    >
                      {getCategoryLabel(entity.category)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">
                    {entity.name}
                  </h3>
                  <p className="text-xs text-[rgba(200,210,255,0.35)] mb-4 line-clamp-2">
                    {entity.description}
                  </p>

                  {/* Key metric */}
                  {entity.globalMetrics[0]?.globalValue && (
                    <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[10px] text-[rgba(200,210,255,0.3)] uppercase tracking-wider mb-1">
                        {entity.globalMetrics[0].name}
                      </div>
                      <div className="text-lg font-bold" style={{ color: entity.color }}>
                        {entity.globalMetrics[0].globalValue.formattedValue}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-[rgba(200,210,255,0.25)]">
                      <Globe size={10} />
                      {entity.countriesAvailable}+ countries
                    </div>
                    <div className="text-[10px] text-[rgba(200,210,255,0.2)]">
                      Updated {timeAgo(entity.lastUpdated)}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Intelligence <ArrowRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntities.map((entity, i) => (
                <Link
                  key={entity.id}
                  href={`/entity/${entity.id}`}
                  className="glass-panel flex items-center gap-5 p-5 group hover:glow-accent transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <span className="text-3xl">{entity.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold group-hover:text-indigo-400 transition-colors">
                        {entity.name}
                      </h3>
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          color: getCategoryColor(entity.category),
                          background: `${getCategoryColor(entity.category)}15`,
                        }}
                      >
                        {getCategoryLabel(entity.category)}
                      </span>
                    </div>
                    <p className="text-xs text-[rgba(200,210,255,0.35)] truncate">
                      {entity.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold" style={{ color: entity.color }}>
                      {entity.globalMetrics[0]?.globalValue?.formattedValue || 'N/A'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,210,255,0.25)]">
                      {entity.countriesAvailable}+ countries
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[rgba(200,210,255,0.15)] group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden h-16" />
    </main>
  );
}
