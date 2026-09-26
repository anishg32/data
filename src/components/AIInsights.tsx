'use client';

import { useMemo } from 'react';
import { Brain, Lightbulb, AlertTriangle, Info, Sparkles } from 'lucide-react';
import type { Entity, CountryMetric } from '@/lib/types';

interface AIInsightsProps {
  entity: Entity;
  selectedCountries: string[];
}

export default function AIInsights({ entity, selectedCountries }: AIInsightsProps) {
  const insights = useMemo(() => {
    const results: {
      keyFinding: string;
      whyItMatters: string;
      dataLimitation: string;
    }[] = [];

    const primaryMetric = entity.globalMetrics[0];
    if (!primaryMetric) return results;

    // Growth analysis across selected countries
    if (selectedCountries.length > 0 && primaryMetric.countryValues.length > 0) {
      const selectedData = primaryMetric.countryValues.filter((cv) =>
        selectedCountries.includes(cv.countryCode)
      );

      if (selectedData.length > 0) {
        // Find highest growth
        let highestGrowth = { name: '', value: 0 };
        let highestValue = { name: '', value: 0 };

        selectedData.forEach((cd) => {
          const growth = cd.metrics['growth']?.value;
          const mainVal = Object.values(cd.metrics).find((m) => m.unit === 'users')?.value;

          if (growth && growth > highestGrowth.value) {
            highestGrowth = { name: cd.countryName, value: growth };
          }
          if (mainVal && mainVal > highestValue.value) {
            highestValue = { name: cd.countryName, value: mainVal };
          }
        });

        if (highestGrowth.name) {
          results.push({
            keyFinding: `Among the selected countries, ${highestGrowth.name} shows the highest available growth rate at ${highestGrowth.value.toFixed(1)}% for the reported period.`,
            whyItMatters: `Higher growth rates in emerging markets may indicate expanding user adoption and market opportunity, based on the available demo data.`,
            dataLimitation: `Growth figures are demo estimates. Actual growth rates may vary based on the official reporting methodology used by the company.`,
          });
        }

        if (highestValue.name && highestValue.name !== highestGrowth.name) {
          results.push({
            keyFinding: `${highestValue.name} leads in total volume among selected countries, based on available demo data.`,
            whyItMatters: `Market size does not always correlate with growth rate. Mature markets tend to show lower growth percentages.`,
            dataLimitation: `Country-level breakdowns are demo estimates. Official breakdowns may not be publicly available for all markets.`,
          });
        }
      }
    }

    // Time series analysis
    if (primaryMetric.timeSeries.length >= 2) {
      const recent = primaryMetric.timeSeries[primaryMetric.timeSeries.length - 1];
      const previous = primaryMetric.timeSeries[primaryMetric.timeSeries.length - 2];
      const oldest = primaryMetric.timeSeries[0];

      const recentGrowth = ((recent.value - previous.value) / previous.value) * 100;
      const totalGrowth = ((recent.value - oldest.value) / oldest.value) * 100;

      results.push({
        keyFinding: `${entity.name} shows a ${totalGrowth.toFixed(0)}% increase from ${oldest.date} to ${recent.date} in the available demo data, with recent period-over-period growth of ${recentGrowth.toFixed(1)}%.`,
        whyItMatters: `Long-term growth trends provide context for evaluating current momentum. A sustained upward trend suggests consistent market demand.`,
        dataLimitation: `These figures are from the demo dataset and represent estimated values. Actual historical figures may differ.`,
      });
    }

    // Default insight if none generated
    if (results.length === 0) {
      results.push({
        keyFinding: `${entity.name} is available in ${entity.countriesAvailable}+ countries based on available data.`,
        whyItMatters: `Global availability is one indicator of market presence, though availability does not directly indicate market performance.`,
        dataLimitation: `This is demo data. Connect real data sources for verified insights.`,
      });
    }

    return results;
  }, [entity, selectedCountries]);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(100,120,255,0.08)] bg-gradient-to-r from-indigo-500/5 to-cyan-500/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center">
            <Brain size={16} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              What Does the Data Say?
              <Sparkles size={12} className="text-cyan-400" />
            </h3>
            <p className="text-[10px] text-[rgba(200,210,255,0.3)] mt-0.5">
              Analysis based only on retrieved demo dataset
            </p>
          </div>
          <span className="demo-badge ml-auto">DEMO ANALYSIS</span>
        </div>
      </div>

      {/* Insights */}
      <div className="p-5 space-y-6">
        {insights.map((insight, i) => (
          <div key={i} className="space-y-3">
            {/* Key Finding */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center mt-0.5">
                <Lightbulb size={12} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold mb-1">
                  Key Finding
                </div>
                <p className="text-sm text-[rgba(200,210,255,0.7)] leading-relaxed">
                  {insight.keyFinding}
                </p>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center mt-0.5">
                <Info size={12} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                  Why It Matters
                </div>
                <p className="text-sm text-[rgba(200,210,255,0.5)] leading-relaxed">
                  {insight.whyItMatters}
                </p>
              </div>
            </div>

            {/* Data Limitation */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center mt-0.5">
                <AlertTriangle size={12} className="text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Data Limitation
                </div>
                <p className="text-xs text-[rgba(200,210,255,0.4)] leading-relaxed">
                  {insight.dataLimitation}
                </p>
              </div>
            </div>

            {i < insights.length - 1 && (
              <div className="border-b border-[rgba(100,120,255,0.06)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
