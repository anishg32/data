'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { searchEntities, DEMO_ENTITIES } from '@/lib/demo-data';
import { getCategoryLabel, getCategoryColor } from '@/lib/utils';
import type { Entity } from '@/lib/types';

const PLACEHOLDER_ITEMS = [
  'Netflix',
  'Spotify',
  'Tesla',
  'iPhone',
  'PlayStation',
  'Instagram',
  'YouTube',
];

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  onSelect?: (entity: Entity) => void;
  autoFocus?: boolean;
}

export default function SearchBar({ variant = 'hero', onSelect, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Entity[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cycle placeholder text
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_ITEMS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [query]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setResults(searchEntities(query));
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (entity: Entity) => {
      if (onSelect) {
        onSelect(entity);
      } else {
        router.push(`/entity/${entity.id}`);
      }
      setQuery('');
      setIsOpen(false);
    },
    [onSelect, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          size={isHero ? 22 : 16}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[rgba(200,210,255,0.3)]"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={`Search "${PLACEHOLDER_ITEMS[placeholderIndex]}"...`}
          className={`search-input pl-14 pr-6 ${
            isHero
              ? 'text-lg py-5'
              : 'text-sm py-3 rounded-xl'
          } ${placeholderVisible ? 'placeholder:opacity-100' : 'placeholder:opacity-0'} placeholder:transition-opacity`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[rgba(200,210,255,0.3)] hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel-solid overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[rgba(200,210,255,0.3)]">
              <TrendingUp size={10} />
              Search Results
              <span className="demo-badge ml-auto">DEMO DATA</span>
            </div>
            {results.map((entity, i) => (
              <button
                key={entity.id}
                onClick={() => handleSelect(entity)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  i === selectedIndex
                    ? 'bg-indigo-500/10 border border-indigo-500/20'
                    : 'border border-transparent hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{entity.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{entity.name}</div>
                  <div className="text-xs text-[rgba(200,210,255,0.4)] truncate">
                    {entity.description}
                  </div>
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded"
                  style={{
                    color: getCategoryColor(entity.category),
                    background: `${getCategoryColor(entity.category)}15`,
                  }}
                >
                  {getCategoryLabel(entity.category)}
                </span>
                <ArrowRight size={14} className="text-[rgba(200,210,255,0.2)]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending when empty and focused */}
      {isOpen && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel-solid overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <div className="px-3 py-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[rgba(200,210,255,0.3)]">
              <Clock size={10} />
              Popular Searches
            </div>
            {DEMO_ENTITIES.slice(0, 5).map((entity) => (
              <button
                key={entity.id}
                onClick={() => handleSelect(entity)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left border border-transparent hover:bg-white/5"
              >
                <span className="text-xl">{entity.logo}</span>
                <span className="text-sm font-medium">{entity.name}</span>
                <span className="text-[rgba(200,210,255,0.3)] text-xs ml-auto">
                  {entity.countriesAvailable}+ countries
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
