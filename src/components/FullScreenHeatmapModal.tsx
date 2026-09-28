import React, { useState } from 'react';
import { HeatmapStock } from '../types/market';
import { X, Search, Filter, Layers, ZoomIn } from 'lucide-react';

interface FullScreenHeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: HeatmapStock[];
  onSelectStock: (symbol: string) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const FullScreenHeatmapModal: React.FC<FullScreenHeatmapModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
  currentLanguage,
  darkMode,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const t = {
    EN: {
      title: 'S&P 500 Market Heatmap Matrix',
      subtitle: 'Visual representation of equity market performance weighted by market capitalization',
      allSectors: 'All Sectors',
      searchStock: 'Filter stock symbol...',
      close: 'Close',
      mktCap: 'Market Cap',
      price: 'Price',
      pe: 'P/E',
      sectorLegend: 'Color scale: -3% or less (deep red) to +3% or more (deep green)',
    },
    IT: {
      title: 'Matrice Mappa Termica S&P 500',
      subtitle: 'Rappresentazione visiva delle performance di mercato azionario ponderata per capitalizzazione',
      allSectors: 'Tutti i Settori',
      searchStock: 'Filtra simbolo azione...',
      close: 'Chiudi',
      mktCap: 'Cap. di Mercato',
      price: 'Prezzo',
      pe: 'P/E',
      sectorLegend: 'Scala colori: da -3% o meno (rosso intenso) a +3% o più (verde intenso)',
    },
  }[currentLanguage];

  const sectors = ['All', 'Technology', 'Consumer Discretionary', 'Communication', 'Financial', 'Healthcare', 'Energy'];

  const filtered = stocks.filter((s) => {
    const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    return matchesSector && matchesQuery;
  });

  // Calculate color based on percentage
  const getPerformanceBg = (pct: number) => {
    if (pct >= 3.0) return '#057a55'; // intense green
    if (pct >= 1.5) return '#089981'; // standard TV green
    if (pct > 0) return '#0e9f6e'; // mild green
    if (pct === 0) return '#4b5563'; // neutral gray
    if (pct > -1.5) return '#e02424'; // mild red
    return '#c81e1e'; // intense red
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className={`relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs text-[#787b86] mt-0.5 hidden sm:block">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-3 sm:px-6 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
          {/* Sector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSector === sec
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : darkMode
                      ? 'text-gray-400 hover:bg-[#252936] hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {sec === 'All' ? t.allSectors : sec}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchStock}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-[#131722] border-[#363a45] text-white' : 'bg-gray-50 border-gray-200 text-black'
              }`}
            />
          </div>
        </div>

        {/* Treemap Matrix Grid */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 auto-rows-[100px]">
            {filtered.map((stock) => {
              const bg = getPerformanceBg(stock.changePercent);
              const isColSpan2 = stock.marketCap > 1800; // Giants like NVDA, AAPL, MSFT, GOOGL, AMZN get double tile

              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    onSelectStock(stock.symbol);
                    onClose();
                  }}
                  style={{ backgroundColor: bg }}
                  className={`rounded-xl p-3 text-white flex flex-col justify-between cursor-pointer hover:brightness-110 hover:scale-[1.02] transition-all shadow-xs relative group ${
                    isColSpan2 ? 'col-span-2 row-span-1' : 'col-span-1'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm sm:text-base tracking-tight">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] opacity-80 font-mono">
                      ${stock.marketCap}B
                    </span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold tabular-nums">
                      {(stock.changePercent >= 0 ? '+' : '') + stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] opacity-90 truncate">
                      {stock.name}
                    </div>
                  </div>

                  {/* Hover tooltip hint */}
                  <div className="absolute inset-0 bg-black/70 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <span className="text-xs font-bold">{stock.name}</span>
                    <span className="text-[10px] text-gray-300 font-mono">${stock.price.toFixed(2)} · P/E {stock.pe}</span>
                    <span className="text-[10px] text-blue-300 font-bold mt-1">Clicca per visualizzare grafico</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-[#787b86]">
          <span>{t.sectorLegend}</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#c81e1e]" />
            <span className="w-3 h-3 rounded-xs bg-[#e02424]" />
            <span className="w-3 h-3 rounded-xs bg-[#4b5563]" />
            <span className="w-3 h-3 rounded-xs bg-[#089981]" />
            <span className="w-3 h-3 rounded-xs bg-[#057a55]" />
          </div>
        </div>
      </div>
    </div>
  );
};
