import React, { useState } from 'react';
import { MarketItem, Timeframe } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface IndicesShowcaseProps {
  indices: MarketItem[];
  selectedTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  onSelectAsset: (item: MarketItem) => void;
  onViewAllIndices: () => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const IndicesShowcase: React.FC<IndicesShowcaseProps> = ({
  indices,
  selectedTimeframe,
  onTimeframeChange,
  onSelectAsset,
  onViewAllIndices,
  currentLanguage,
  darkMode,
}) => {
  const [hoveredPoints, setHoveredPoints] = useState<Record<string, { value: number; index: number } | null>>({});

  const timeframes: Timeframe[] = ['1D', '5D', '1M', '1Y', '5Y', 'All'];

  // Helper to generate SVG path for a sparkline
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return { linePath: '', areaPath: '', isUp: true };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 25;
    const padding = 2;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x, y, val };
    });

    // Create smooth bezier or straight line path
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      linePath += ` Q ${prev.x + (cx - prev.x) / 2} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
    }

    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
    const isUp = data[data.length - 1] >= data[0];

    return { linePath, areaPath, isUp, points };
  };

  return (
    <section>
      {/* Header and Timeframe Filter */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onViewAllIndices}
          className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight hover:text-[#2962ff] group transition-colors text-left focus:outline-none"
        >
          <span className={darkMode ? 'text-white group-hover:text-[#2962ff]' : 'text-[#131722] group-hover:text-[#2962ff]'}>
            {currentLanguage === 'IT' ? 'Indici' : 'Indices'}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-[#2962ff] transition-transform" />
        </button>

        {/* Period Selectors */}
        <div className={`flex items-center rounded-lg p-0.5 text-xs font-semibold ${
          darkMode ? 'bg-[#1e222d] text-[#787b86]' : 'bg-gray-100 text-gray-600'
        }`}>
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              type="button"
              className={`px-2.5 py-1 rounded transition-all ${
                selectedTimeframe === tf
                  ? darkMode
                    ? 'bg-[#2a2e39] text-white shadow-xs'
                    : 'bg-white rounded shadow-sm text-black'
                  : darkMode
                    ? 'hover:text-white'
                    : 'hover:text-black'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Major Indices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index) => {
          const sparklineData = index.sparklines[selectedTimeframe] || index.sparklines['1D'];
          const { linePath, areaPath, isUp } = generateSparklinePath(sparklineData);
          const hovered = hoveredPoints[index.id];

          // Dynamic price & change based on selected timeframe
          const currentPrice = hovered ? hovered.value : index.price;
          const displayChange = isUp ? `+${Math.abs(index.change).toFixed(2)}` : `-${Math.abs(index.change).toFixed(2)}`;
          const displayPct = isUp ? `+${Math.abs(index.changePercent).toFixed(2)}%` : `-${Math.abs(index.changePercent).toFixed(2)}%`;

          return (
            <article
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden group cursor-pointer ${
                darkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] hover:border-gray-600 hover:shadow-lg'
                  : 'bg-white border-[#e0e3eb] hover:shadow-md hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                    style={{ backgroundColor: index.badgeBg }}
                  >
                    {index.badgeText}
                  </span>
                  <div>
                    <h3 className="font-bold text-base leading-tight group-hover:text-[#2962ff] transition-colors">
                      {index.symbol}
                    </h3>
                    <span className="text-xs text-[#787b86] uppercase font-mono tracking-tight">
                      {index.exchange}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold tabular-nums ${
                    isUp
                      ? darkMode
                        ? 'bg-emerald-950/60 text-[#089981] border border-emerald-800/40'
                        : 'bg-emerald-50 text-[#089981]'
                      : darkMode
                        ? 'bg-rose-950/60 text-[#f23645] border border-rose-800/40'
                        : 'bg-rose-50 text-[#f23645]'
                  }`}
                >
                  {displayPct}
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold tabular-nums">
                    {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`text-xs font-semibold ml-1.5 tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {displayChange}
                  </span>
                </div>
              </div>

              {/* Sparkline Mini Chart */}
              <div 
                className="mt-3 h-11 w-full relative"
                onMouseLeave={() => setHoveredPoints(prev => ({ ...prev, [index.id]: null }))}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const xRel = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  const idx = Math.round(xRel * (sparklineData.length - 1));
                  setHoveredPoints(prev => ({
                    ...prev,
                    [index.id]: { value: sparklineData[idx], index: idx }
                  }));
                }}
              >
                <svg
                  className={`w-full h-full ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 25"
                >
                  <defs>
                    <linearGradient id={`grad-${index.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={linePath}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path
                    d={areaPath}
                    fill={`url(#grad-${index.id})`}
                  />
                </svg>

                {hovered && (
                  <div
                    className="absolute top-0 bottom-0 w-[1px] bg-gray-400 dark:bg-gray-500 pointer-events-none"
                    style={{ left: `${(hovered.index / (sparklineData.length - 1)) * 100}%` }}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
