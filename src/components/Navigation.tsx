'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Globe, BarChart3, Bookmark, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Globe },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/compare', label: 'Compare', icon: BarChart3 },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#050510]/80 backdrop-blur-xl border-b border-[rgba(100,120,255,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
              D
            </div>
            <span className="text-lg font-bold tracking-wider">
              DATA<span className="text-indigo-400">WAVE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link flex items-center gap-1.5 ${
                  pathname === item.href ? 'active' : ''
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/explore"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"
            >
              <Search size={14} />
              <span className="text-[rgba(200,210,255,0.55)]">Search anything...</span>
            </Link>
            <span className="demo-badge">DEMO</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-[#050510]/95 backdrop-blur-xl border-t border-[rgba(100,120,255,0.08)] animate-fade-in">
            <nav className="flex flex-col p-4 gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    pathname === item.href
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-[rgba(200,210,255,0.55)] hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050510]/90 backdrop-blur-xl border-t border-[rgba(100,120,255,0.08)]">
        <nav className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 text-[10px] font-medium transition-colors ${
                pathname === item.href
                  ? 'text-indigo-400'
                  : 'text-[rgba(200,210,255,0.4)]'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
