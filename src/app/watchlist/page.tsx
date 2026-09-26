'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { DEMO_ENTITIES } from '@/lib/demo-data';
import { getCategoryLabel, getCategoryColor, timeAgo } from '@/lib/utils';
import { Bookmark, ArrowRight, Trash2, GitCompare, Plus, Eye } from 'lucide-react';
import type { Entity } from '@/lib/types';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('datawave-watchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('datawave-watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, loaded]);

  const addToWatchlist = (id: string) => {
    setWatchlist((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((i) => i !== id));
  };

  const watchlistedEntities = DEMO_ENTITIES.filter((e) => watchlist.includes(e.id));
  const suggestedEntities = DEMO_ENTITIES.filter((e) => !watchlist.includes(e.id));

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              My <span className="gradient-text">Watchlist</span>
            </h1>
            <p className="text-[rgba(200,210,255,0.4)] text-lg">
              Track entities and get notified when new data becomes available
            </p>
          </div>

          {watchlistedEntities.length > 0 ? (
            <div className="space-y-3 mb-10">
              {watchlistedEntities.map((entity, i) => (
                <div
                  key={entity.id}
                  className="glass-panel flex items-center gap-5 p-5 group animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                >
                  <span className="text-3xl">{entity.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold">{entity.name}</h3>
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
                    <div className="text-xs text-[rgba(200,210,255,0.3)]">
                      Updated {timeAgo(entity.lastUpdated)} · {entity.countriesAvailable}+ countries
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 mr-2">
                    <div className="text-sm font-bold" style={{ color: entity.color }}>
                      {entity.globalMetrics[0]?.globalValue?.formattedValue || 'N/A'}
                    </div>
                    <div className="text-[10px] text-[rgba(200,210,255,0.25)]">
                      {entity.globalMetrics[0]?.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/entity/${entity.id}`}
                      className="p-2 rounded-lg text-[rgba(200,210,255,0.25)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => removeFromWatchlist(entity.id)}
                      className="p-2 rounded-lg text-[rgba(200,210,255,0.25)] hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Compare all button */}
              {watchlistedEntities.length >= 2 && (
                <div className="flex justify-center pt-4">
                  <Link
                    href="/compare"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors"
                  >
                    <GitCompare size={16} />
                    Compare All ({watchlistedEntities.length})
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-16 text-center mb-10">
              <Bookmark size={48} className="mx-auto text-[rgba(200,210,255,0.1)] mb-6" />
              <h3 className="text-xl font-bold mb-3">Your Watchlist is Empty</h3>
              <p className="text-[rgba(200,210,255,0.4)] max-w-md mx-auto mb-8">
                Save entities to your watchlist to track them and get updates when new data becomes available.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors"
              >
                Explore Data
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Suggested */}
          {suggestedEntities.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 text-[rgba(200,210,255,0.5)]">
                Suggested
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {suggestedEntities.map((entity) => (
                  <button
                    key={entity.id}
                    onClick={() => addToWatchlist(entity.id)}
                    className="glass-panel flex items-center gap-4 p-4 text-left hover:border-indigo-500/20 transition-all group"
                  >
                    <span className="text-2xl">{entity.logo}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{entity.name}</div>
                      <div className="text-xs text-[rgba(200,210,255,0.3)]">{getCategoryLabel(entity.category)}</div>
                    </div>
                    <Plus size={16} className="text-[rgba(200,210,255,0.2)] group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden h-16" />
    </main>
  );
}
