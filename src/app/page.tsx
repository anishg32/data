'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  Search,
  Globe,
  ArrowRight,
  ChevronDown,
  Zap,
  Eye,
  BarChart3,
  MapPin,
  Clock,
  Brain,
  TrendingUp,
  Layers,
  Shield,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import { DEMO_ENTITIES } from '@/lib/demo-data';
import { useInView } from '@/hooks/useAnimations';
import { formatNumber } from '@/lib/utils';

const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 animate-pulse" />
    </div>
  ),
});

// Animated counter component
function AnimatedStat({ value, label, suffix = '' }: { value: string; label: string; suffix?: string }) {
  const { ref, isInView } = useInView(0.3);
  return (
    <div ref={ref} className={`text-center transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-4xl md:text-6xl font-bold gradient-text mb-2">
        {value}{suffix}
      </div>
      <div className="text-xs md:text-sm text-[rgba(200,210,255,0.4)] uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

// Feature card
function FeatureCard({ icon: Icon, title, description, delay }: { icon: any; title: string; description: string; delay: number }) {
  const { ref, isInView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`glass-panel p-6 group hover:glow-accent transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={20} className="text-indigo-400" />
      </div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[rgba(200,210,255,0.4)] leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [heroPhase, setHeroPhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timers = [
      setTimeout(() => setHeroPhase(1), 500),
      setTimeout(() => setHeroPhase(2), 1500),
      setTimeout(() => setHeroPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Globe */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - scrollY / 800),
          }}
        >
          <Globe3D className="w-full h-full opacity-60" />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050510]/40 via-transparent to-[#050510]" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Logo mark */}
          <div className={`transition-all duration-1000 ${heroPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                D
              </div>
              <span className="text-2xl font-bold tracking-wider">
                DATA<span className="text-indigo-400">WAVE</span>
              </span>
            </div>
          </div>

          {/* Animated headlines */}
          <h1 className="mb-6">
            <span
              className={`block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 ${
                heroPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              SEARCH THE WORLD.
            </span>
            <span
              className={`block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight gradient-text mt-2 transition-all duration-1000 ${
                heroPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              SEE THE DATA.
            </span>
          </h1>

          <p
            className={`text-lg md:text-xl text-[rgba(200,210,255,0.45)] max-w-2xl mx-auto mb-10 transition-all duration-1000 ${
              heroPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Discover how apps, products, entertainment and technology are used around the world.
          </p>

          {/* Search */}
          <div
            className={`max-w-2xl mx-auto transition-all duration-1000 ${
              heroPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <SearchBar variant="hero" />
          </div>

          {/* Quick explore */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 mt-8 transition-all duration-1000 ${
              heroPhase >= 3 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-[rgba(200,210,255,0.25)]">
              Explore:
            </span>
            {DEMO_ENTITIES.slice(0, 4).map((entity) => (
              <Link
                key={entity.id}
                href={`/entity/${entity.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[rgba(200,210,255,0.5)] hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
              >
                <span>{entity.logo}</span>
                {entity.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
          <ChevronDown size={24} className="text-[rgba(200,210,255,0.2)]" />
        </div>
      </section>

      {/* ===== SHOCK MARKETING SECTION ===== */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block text-[rgba(200,210,255,0.3)]">YOU SEE AN APP.</span>
              <span className="block gradient-text mt-2">WE SHOW YOU THE WORLD BEHIND IT.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
            <AnimatedStat value="ONE" label="Search" />
            <AnimatedStat value="190" label="Countries" suffix="+" />
            <AnimatedStat value="∞" label="Data Points" />
            <AnimatedStat value="∞" label="Stories" />
          </div>

          {/* Steps */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base font-bold tracking-widest text-[rgba(200,210,255,0.25)]">
            {['SEARCH', 'SELECT', 'COMPARE', 'DISCOVER', 'UNDERSTAND'].map((step, i) => (
              <span key={step} className="flex items-center gap-4">
                <span className="hover:text-indigo-400 transition-colors cursor-default">
                  {step}
                </span>
                {i < 4 && <ArrowRight size={14} className="text-[rgba(200,210,255,0.15)]" />}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORYTELLING SECTIONS ===== */}

      {/* Section: Every App Has A Story */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="text-[rgba(200,210,255,0.3)]">EVERY APP HAS</span>
                <br />
                <span className="gradient-text">A STORY.</span>
              </h2>
              <p className="text-lg text-[rgba(200,210,255,0.4)] leading-relaxed mb-8">
                Behind every download, every subscription, every view — there&#39;s a world of publicly available data waiting to be explored.
              </p>
              <div className="space-y-4">
                {DEMO_ENTITIES.slice(0, 3).map((entity) => (
                  <Link
                    key={entity.id}
                    href={`/entity/${entity.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all group"
                  >
                    <span className="text-3xl">{entity.logo}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{entity.name}</div>
                      <div className="text-xs text-[rgba(200,210,255,0.3)]">{entity.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-400">
                        {entity.globalMetrics[0]?.globalValue?.formattedValue}
                      </div>
                      <div className="text-[10px] text-[rgba(200,210,255,0.25)]">
                        {entity.countriesAvailable}+ countries
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[rgba(200,210,255,0.15)] group-hover:text-indigo-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] hidden lg:block">
              <Globe3D className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Compare What Matters */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-[rgba(200,210,255,0.3)]">COMPARE</span>
            <br />
            <span className="gradient-text">WHAT MATTERS.</span>
          </h2>
          <p className="text-lg text-[rgba(200,210,255,0.35)] mb-12 max-w-2xl mx-auto">
            Country vs country. App vs app. Product vs product. See how they stack up using publicly available data.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { a: '🎬 Netflix', b: '📺 YouTube', metric: 'Subscribers vs MAU' },
              { a: '🇺🇸 USA', b: '🇮🇳 India', metric: 'Market Comparison' },
              { a: '🎵 Spotify', b: '🎮 PlayStation', metric: 'User Base' },
            ].map((comp, i) => (
              <div key={i} className="glass-panel p-6 text-center group hover:glow-accent transition-all">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-lg">{comp.a}</span>
                  <span className="text-xs text-indigo-400 font-bold">VS</span>
                  <span className="text-lg">{comp.b}</span>
                </div>
                <div className="text-xs text-[rgba(200,210,255,0.3)]">{comp.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              UNDERSTAND THE <span className="gradient-text">SIGNAL</span>
            </h2>
            <p className="text-[rgba(200,210,255,0.4)] max-w-xl mx-auto">
              Powerful tools to explore, analyze, and visualize global data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={Search} title="Universal Search" description="Search any app, product, movie, company or service. Find available public data instantly." delay={0} />
            <FeatureCard icon={MapPin} title="Interactive World Map" description="Select countries, compare regions, and visualize data geographically." delay={100} />
            <FeatureCard icon={Clock} title="Time Machine" description="Travel through historical data. See how metrics have changed over time." delay={200} />
            <FeatureCard icon={BarChart3} title="Smart Comparison" description="Compare entities side-by-side across all available metrics and countries." delay={300} />
            <FeatureCard icon={Brain} title="AI Insights" description="Automatic analysis of trends, outliers, and key findings from the data." delay={400} />
            <FeatureCard icon={Shield} title="Verified Sources" description="Every data point is sourced, dated, and labeled. No hidden assumptions." delay={500} />
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            YOUR WORLD.
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold gradient-text mb-8">
            YOUR DATA.
          </h2>
          <p className="text-lg text-[rgba(200,210,255,0.4)] mb-10">
            Stop guessing. Start exploring the data.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-lg hover:from-indigo-500 hover:to-cyan-500 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105"
          >
            EXPLORE DATA
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[rgba(100,120,255,0.06)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[10px]">
              D
            </div>
            <span className="text-sm font-bold tracking-wider">
              DATA<span className="text-indigo-400">WAVE</span>
            </span>
            <span className="demo-badge ml-2">DEMO</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[rgba(200,210,255,0.25)]">
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
            <span>Only publicly available data</span>
          </div>
          <div className="text-xs text-[rgba(200,210,255,0.15)]">
            © 2026 DATATO · Global Data Intelligence
          </div>
        </div>
      </footer>

      {/* Bottom spacing for mobile nav */}
      <div className="md:hidden h-16" />
    </main>
  );
}
