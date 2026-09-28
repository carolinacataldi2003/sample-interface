import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { MarketItem, AssetCategory } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: MarketItem[];
  onSelectAsset: (asset: MarketItem) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset,
  currentLanguage,
  darkMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | AssetCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const t = {
    EN: {
      searchPlaceholder: 'Search symbol, company, or asset (e.g. NVDA, Bitcoin, Gold)...',
      all: 'All',
      stocks: 'Stocks',
      crypto: 'Crypto',
      indices: 'Indices',
      futures: 'Futures',
      forex: 'Forex',
      recentTrending: 'Trending Searches',
      noResults: 'No symbols found for',
      esc: 'ESC to close',
    },
    IT: {
      searchPlaceholder: 'Cerca simbolo, società o asset (es. NVDA, Bitcoin, Oro)...',
      all: 'Tutti',
      stocks: 'Azioni',
      crypto: 'Cripto',
      indices: 'Indici',
      futures: 'Futures',
      forex: 'Forex',
      recentTrending: 'Ricerche di Tendenza',
      noResults: 'Nessun asset trovato per',
      esc: 'ESC per chiudere',
    },
  }[currentLanguage];

  const filteredAssets = allAssets.filter((asset) => {
    const matchesFilter = selectedFilter === 'all' || asset.category === selectedFilter;
    const q = query.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesQuery = 
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.exchange.toLowerCase().includes(q) ||
      (asset.sector && asset.sector.toLowerCase().includes(q));

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[80vh] z-10 transition-all ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm sm:text-base focus:outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${
            darkMode ? 'bg-[#2a2e39] border-[#363a45] text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'stocks', 'crypto', 'indices', 'futures'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : darkMode
                    ? 'text-gray-400 hover:bg-[#252936] hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              {filter === 'all' ? t.all : t[filter]}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-gray-800/60">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => {
              const isUp = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252936] rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        background: asset.badgeBg,
                        color: asset.badgeColor || '#ffffff',
                      }}
                    >
                      {asset.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm group-hover:text-[#2962ff] transition-colors flex items-center gap-2">
                        <span>{asset.symbol}</span>
                        <span className="text-[11px] font-normal text-gray-400 uppercase">
                          {asset.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs sm:max-w-md">
                        {asset.name} {asset.sector ? `· ${asset.sector}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">
                      {asset.currencySymbol}
                      {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {(isUp ? '+' : '') + asset.changePercent.toFixed(2) + '%'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">{t.noResults} "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
