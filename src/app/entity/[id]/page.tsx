'use client';

import { useState, useMemo, useCallback, use } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import MetricCard from '@/components/MetricCard';
import DataChart from '@/components/DataChart';
import WorldMap from '@/components/WorldMap';
import CountryComparison from '@/components/CountryComparison';
import Timeline from '@/components/Timeline';
import AIInsights from '@/components/AIInsights';
import { getEntityById, DEMO_COUNTRIES } from '@/lib/demo-data';
import { getCategoryLabel, getCategoryColor, timeAgo, formatNumber } from '@/lib/utils';
import {
  ArrowLeft,
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function EntityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const entity = getEntityById(id);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const handleCountrySelect = useCallback((code: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(code)) return prev;
      return [...prev, code];
    });
  }, []);

  const handleCountryDeselect = useCallback((code: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== code));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCountries([]);
  }, []);

  const handleToggleWatchlist = useCallback(() => {
    setIsWatchlisted((prev) => !prev);
    // In production, this would save to localStorage or database
  }, []);

  if (!entity) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-24 px-6 text-center">
          <div className="max-w-md mx-auto">
            <Globe size={48} className="mx-auto text-[rgba(200,210,255,0.15)] mb-6" />
            <h1 className="text-2xl font-bold mb-3">Entity Not Found</h1>
            <p className="text-[rgba(200,210,255,0.4)] mb-6">
              No reliable public data available for this search.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 font-medium hover:bg-indigo-500/30 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Explore
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const primaryMetric = entity.globalMetrics[0];
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    entity.globalMetrics.forEach((m) => {
      m.timeSeries.forEach((ts) => {
        const year = ts.date.split('-')[0].split('Q')[0];
        years.add(year);
      });
    });
    return Array.from(years).sort();
  }, [entity]);

  // Determine primary metric key for map
  const primaryMetricKey = useMemo(() => {
    if (!primaryMetric?.countryValues.length) return undefined;
    const firstCountry = primaryMetric.countryValues[0];
    const keys = Object.keys(firstCountry.metrics);
    // Find the non-growth key
    return keys.find((k) => k !== 'growth') || keys[0];
  }, [primaryMetric]);

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[rgba(200,210,255,0.3)] mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <ChevronRight size={12} />
            <span className="text-[rgba(200,210,255,0.5)]">{entity.name}</span>
          </div>

          {/* Entity Header */}
          <div className="glass-panel p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                  style={{
                    background: `${entity.color}15`,
                    border: `1px solid ${entity.color}25`,
                  }}
                >
                  {entity.logo}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{entity.name}</h1>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded"
                      style={{
                        color: getCategoryColor(entity.category),
                        background: `${getCategoryColor(entity.category)}15`,
                      }}
                    >
                      {getCategoryLabel(entity.category)}
                    </span>
                    <span className="demo-badge">DEMO DATA</span>
                  </div>
                  <p className="text-sm text-[rgba(200,210,255,0.4)]">{entity.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[rgba(200,210,255,0.25)]">
                    <span className="flex items-center gap-1">
                      <Globe size={10} />
                      {entity.countriesAvailable}+ countries
                    </span>
                    <span>Updated {timeAgo(entity.lastUpdated)}</span>
                    <span>{entity.sources.length} source{entity.sources.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWatchlist}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isWatchlisted
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-white/5 text-[rgba(200,210,255,0.5)] border border-white/10 hover:border-indigo-500/30'
                  }`}
                >
                  {isWatchlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 text-[rgba(200,210,255,0.5)] border border-white/10 hover:border-white/20 transition-all">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>

            {/* Global headline */}
            <div className="mt-6 pt-6 border-t border-[rgba(100,120,255,0.08)]">
              <div className="text-[10px] uppercase tracking-widest text-[rgba(200,210,255,0.25)] mb-2">
                GLOBAL INTELLIGENCE
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {entity.globalMetrics.map((metric, i) => (
              <MetricCard
                key={metric.id}
                label={metric.name}
                value={metric.globalValue}
                color={entity.color}
                delay={i * 100}
                icon={
                  metric.category === 'Users' ? (
                    <Users size={14} />
                  ) : metric.category === 'Financial' ? (
                    <DollarSign size={14} />
                  ) : metric.category === 'Reach' ? (
                    <Globe size={14} />
                  ) : (
                    <TrendingUp size={14} />
                  )
                }
              />
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* World Map - spans 2 cols */}
            <div className="lg:col-span-2">
              <WorldMap
                countryData={primaryMetric?.countryValues || []}
                selectedCountries={selectedCountries}
                onCountrySelect={handleCountrySelect}
                onCountryDeselect={handleCountryDeselect}
                onReset={handleReset}
                primaryMetricKey={primaryMetricKey}
                entityColor={entity.color}
              />
            </div>

            {/* Country Comparison */}
            <div className="lg:col-span-1">
              <CountryComparison
                countryData={primaryMetric?.countryValues || []}
                selectedCountries={selectedCountries}
                metricKey={primaryMetricKey || 'subscribers'}
                metricLabel={primaryMetric?.name || 'Value'}
                entityColor={entity.color}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <Timeline
              availableYears={availableYears}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {entity.globalMetrics
              .filter((m) => m.timeSeries.length > 0)
              .map((metric) => (
                <DataChart
                  key={metric.id}
                  data={metric.timeSeries}
                  title={`${metric.name} Over Time`}
                  unit={metric.globalValue?.unit || 'users'}
                  color={entity.color}
                  type={metric.category === 'Financial' ? 'bar' : 'area'}
                />
              ))}
          </div>

          {/* AI Insights */}
          <div className="mb-6">
            <AIInsights entity={entity} selectedCountries={selectedCountries} />
          </div>

          {/* Sources */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <ExternalLink size={14} className="text-indigo-400" />
              <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)]">
                Data Sources
              </h3>
              <span className="demo-badge ml-auto">DEMO SOURCES</span>
            </div>
            <div className="space-y-3">
              {entity.sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <div className="text-sm font-medium">{source.name}</div>
                    <div className="text-xs text-[rgba(200,210,255,0.3)] mt-0.5">
                      Period: {source.dataPeriod} · Collected: {source.collectionDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      source.dataType === 'REPORTED' ? 'badge-reported' : 'badge-estimated'
                    }`}>
                      {source.dataType}
                    </span>
                    <span className="text-xs text-[rgba(200,210,255,0.3)]">
                      {Math.round(source.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-xs text-amber-400/60 flex items-center gap-2">
                <span>⚠️</span>
                All data shown is from the demo dataset. Connect real public data sources for verified intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden h-16" />
    </main>
  );
}
