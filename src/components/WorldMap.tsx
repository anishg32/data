'use client';

import { useState, useMemo, useCallback } from 'react';
import { DEMO_COUNTRIES } from '@/lib/demo-data';
import type { Country, CountryMetric } from '@/lib/types';
import { MapPin, Plus, X, RotateCcw, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface WorldMapProps {
  countryData?: CountryMetric[];
  selectedCountries: string[];
  onCountrySelect: (code: string) => void;
  onCountryDeselect: (code: string) => void;
  onReset: () => void;
  primaryMetricKey?: string;
  entityColor?: string;
}

// Simplified world map positions for dot representation
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; size: number }> = {
  US: { x: 180, y: 180, size: 28 },
  CA: { x: 190, y: 130, size: 30 },
  MX: { x: 165, y: 225, size: 16 },
  BR: { x: 280, y: 310, size: 28 },
  GB: { x: 420, y: 140, size: 10 },
  FR: { x: 430, y: 165, size: 12 },
  DE: { x: 450, y: 150, size: 11 },
  IT: { x: 450, y: 175, size: 10 },
  ES: { x: 415, y: 180, size: 11 },
  RU: { x: 580, y: 115, size: 40 },
  IN: { x: 610, y: 230, size: 22 },
  CN: { x: 660, y: 190, size: 28 },
  JP: { x: 740, y: 185, size: 8 },
  KR: { x: 720, y: 185, size: 6 },
  AU: { x: 730, y: 360, size: 24 },
  ID: { x: 695, y: 290, size: 14 },
  NG: { x: 445, y: 260, size: 12 },
  ZA: { x: 475, y: 370, size: 12 },
  SA: { x: 530, y: 230, size: 14 },
  AE: { x: 555, y: 235, size: 6 },
};

export default function WorldMap({
  countryData = [],
  selectedCountries,
  onCountrySelect,
  onCountryDeselect,
  onReset,
  primaryMetricKey,
  entityColor = '#6366f1',
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countryDataMap = useMemo(() => {
    const map = new Map<string, CountryMetric>();
    countryData.forEach((cd) => map.set(cd.countryCode, cd));
    return map;
  }, [countryData]);

  const getCountryValue = useCallback(
    (code: string) => {
      const cd = countryDataMap.get(code);
      if (!cd || !primaryMetricKey) return null;
      const metric = cd.metrics[primaryMetricKey];
      return metric?.value ?? null;
    },
    [countryDataMap, primaryMetricKey]
  );

  const maxValue = useMemo(() => {
    if (!primaryMetricKey) return 0;
    let max = 0;
    countryData.forEach((cd) => {
      const val = cd.metrics[primaryMetricKey]?.value;
      if (val && val > max) max = val;
    });
    return max;
  }, [countryData, primaryMetricKey]);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Map header */}
      <div className="flex items-center justify-between p-5 border-b border-[rgba(100,120,255,0.08)]">
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-indigo-400" />
          <h3 className="text-sm font-medium uppercase tracking-wider text-[rgba(200,210,255,0.6)]">
            Global Map
          </h3>
          {selectedCountries.length > 0 && (
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {selectedCountries.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="demo-badge">DEMO DATA</span>
          {selectedCountries.length > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-[rgba(200,210,255,0.5)] hover:text-rose-400 transition-all"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative p-4" style={{ aspectRatio: '2/1' }}>
        <svg viewBox="0 0 860 450" className="w-full h-full">
          {/* Grid lines */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * 50 + 25}
              x2={860}
              y2={i * 50 + 25}
              stroke="rgba(100,120,255,0.04)"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 18 }, (_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50 + 25}
              y1={0}
              x2={i * 50 + 25}
              y2={450}
              stroke="rgba(100,120,255,0.04)"
              strokeWidth={0.5}
            />
          ))}

          {/* Equator */}
          <line x1={0} y1={225} x2={860} y2={225} stroke="rgba(100,120,255,0.06)" strokeWidth={1} strokeDasharray="5,5" />

          {/* Country dots */}
          {DEMO_COUNTRIES.map((country) => {
            const pos = COUNTRY_POSITIONS[country.code];
            if (!pos) return null;

            const isSelected = selectedCountries.includes(country.code);
            const isHovered = hoveredCountry === country.code;
            const hasData = countryDataMap.has(country.code);
            const value = getCountryValue(country.code);
            const intensity = maxValue > 0 && value ? value / maxValue : 0;

            return (
              <g key={country.code}>
                {/* Glow ring for selected */}
                {isSelected && (
                  <>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={pos.size * 0.6 + 12}
                      fill="none"
                      stroke={entityColor}
                      strokeWidth={1}
                      opacity={0.2}
                    >
                      <animate
                        attributeName="r"
                        values={`${pos.size * 0.6 + 8};${pos.size * 0.6 + 16};${pos.size * 0.6 + 8}`}
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.1;0.3"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* Country circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={pos.size * 0.6}
                  fill={
                    isSelected
                      ? entityColor
                      : hasData
                        ? `rgba(99, 102, 241, ${0.1 + intensity * 0.4})`
                        : 'rgba(100, 120, 255, 0.05)'
                  }
                  stroke={
                    isSelected
                      ? entityColor
                      : isHovered
                        ? 'rgba(200,210,255,0.3)'
                        : hasData
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(100, 120, 255, 0.08)'
                  }
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredCountry(country.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    if (isSelected) {
                      onCountryDeselect(country.code);
                    } else {
                      onCountrySelect(country.code);
                    }
                  }}
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 8px ${entityColor}50)`
                      : isHovered
                        ? 'drop-shadow(0 0 4px rgba(99,102,241,0.3))'
                        : 'none',
                  }}
                />

                {/* Country label */}
                <text
                  x={pos.x}
                  y={pos.y + pos.size * 0.6 + 14}
                  textAnchor="middle"
                  fill={isSelected ? entityColor : 'rgba(200,210,255,0.3)'}
                  fontSize={9}
                  fontWeight={isSelected ? 600 : 400}
                  className="pointer-events-none select-none"
                >
                  {country.code}
                </text>

                {/* Value label for selected countries */}
                {isSelected && value && (
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={8}
                    fontWeight={700}
                    className="pointer-events-none select-none"
                  >
                    {formatNumber(value)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Connection lines between selected countries */}
          {selectedCountries.length >= 2 &&
            selectedCountries.slice(0, -1).map((code, i) => {
              const nextCode = selectedCountries[i + 1];
              const pos1 = COUNTRY_POSITIONS[code];
              const pos2 = COUNTRY_POSITIONS[nextCode];
              if (!pos1 || !pos2) return null;

              const midX = (pos1.x + pos2.x) / 2;
              const midY = Math.min(pos1.y, pos2.y) - 30;

              return (
                <path
                  key={`${code}-${nextCode}`}
                  d={`M ${pos1.x} ${pos1.y} Q ${midX} ${midY} ${pos2.x} ${pos2.y}`}
                  fill="none"
                  stroke={entityColor}
                  strokeWidth={1}
                  opacity={0.2}
                  strokeDasharray="4,4"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-8"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              );
            })}
        </svg>

        {/* Hover tooltip */}
        {hoveredCountry && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: COUNTRY_POSITIONS[hoveredCountry]?.x
                ? `${(COUNTRY_POSITIONS[hoveredCountry].x / 860) * 100}%`
                : '50%',
              top: COUNTRY_POSITIONS[hoveredCountry]?.y
                ? `${(COUNTRY_POSITIONS[hoveredCountry].y / 450) * 100 - 12}%`
                : '50%',
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-[#0a0a1a]/95 backdrop-blur-lg border border-[rgba(100,120,255,0.15)] rounded-xl px-3 py-2 animate-fade-in shadow-xl">
              <div className="text-xs font-semibold text-white">
                {DEMO_COUNTRIES.find((c) => c.code === hoveredCountry)?.name}
              </div>
              {countryDataMap.has(hoveredCountry) && primaryMetricKey && (
                <div className="text-[10px] text-[rgba(200,210,255,0.5)] mt-0.5">
                  {formatNumber(getCountryValue(hoveredCountry) || 0)}
                </div>
              )}
              <div className="text-[9px] text-indigo-400 mt-0.5">Click to select</div>
            </div>
          </div>
        )}
      </div>

      {/* Selected countries bar */}
      {selectedCountries.length > 0 && (
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((code) => {
              const country = DEMO_COUNTRIES.find((c) => c.code === code);
              return (
                <button
                  key={code}
                  onClick={() => onCountryDeselect(code)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all"
                  style={{
                    borderColor: `${entityColor}30`,
                    background: `${entityColor}10`,
                    color: entityColor,
                  }}
                >
                  {country?.name || code}
                  <X size={12} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
