import React, { useState } from 'react';
import { MarketItem, AssetCategory } from '../types/market';
import { X, Search, ArrowUpDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AssetCategory;
  items: MarketItem[];
  onSelectAsset: (asset: MarketItem) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  category,
  items,
  onSelectAsset,
  currentLanguage,
  darkMode,
}) => {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  const categoryTitles = {
    EN: {
      indices: 'Global Market Indices',
      stocks: 'US Equities & Trending Stocks',
      crypto: 'Cryptocurrency Screener',
      futures: 'Futures & Global Commodities',
      forex: 'Currencies & Foreign Exchange',
      bonds: 'Sovereign Debt & Bond Yields',
      etfs: 'Exchange Traded Funds (ETFs)',
      economy: 'Macroeconomic Metrics',
    },
    IT: {
      indices: 'Indici di Mercato Globali',
      stocks: 'Azioni USA e Titoli di Tendenza',
      crypto: 'Screener Criptovalute',
      futures: 'Futures e Materie Prime Globali',
      forex: 'Valute e Cambi Esteri (Forex)',
      bonds: 'Titoli di Stato e Rendimenti',
      etfs: 'Fondi Indicizzati (ETF)',
      economy: 'Metriche Macroeconomiche',
    },
  }[currentLanguage];

  const t = {
    EN: {
      title: categoryTitles[category] || 'Market Screener',
      search: 'Search asset...',
      symbol: 'Symbol',
      price: 'Price',
      chg: 'Chg %',
      high24: '24h High',
      low24: '24h Low',
      volume: 'Volume / Cap',
    },
    IT: {
      title: categoryTitles[category] || 'Screener di Mercato',
      search: 'Cerca asset...',
      symbol: 'Simbolo',
      price: 'Prezzo',
      chg: 'Var %',
      high24: 'Max 24h',
      low24: 'Min 24h',
      volume: 'Volume / Cap',
    },
  }[currentLanguage];

  const handleSort = (field: 'symbol' | 'price' | 'changePercent') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filtered = items
    .filter((item) => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.sector && item.sector.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'symbol') comp = a.symbol.localeCompare(b.symbol);
      else if (sortBy === 'price') comp = a.price - b.price;
      else comp = a.changePercent - b.changePercent;
      return sortOrder === 'desc' ? -comp : comp;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className={`relative w-full max-w-4xl max-h-[88vh] rounded-3xl shadow-2xl border flex flex-col overflow-hidden z-10 transition-all ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.title}
            </h2>
            <span className="text-xs text-[#787b86]">
              {filtered.length} asset monitorati in tempo reale
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                darkMode ? 'bg-[#131722] border-[#363a45] text-white' : 'bg-gray-50 border-gray-200 text-black'
              }`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs text-[#787b86] sticky top-0 border-b ${
              darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
            }`}>
              <tr>
                <th 
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-6 font-semibold cursor-pointer hover:text-blue-500 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{t.symbol}</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-blue-500 select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t.price}</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-blue-500 select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{t.chg}</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">{t.high24}</th>
                <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">{t.low24}</th>
                <th className="py-3 px-6 font-semibold text-right hidden md:table-cell">{t.volume}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 font-medium">
              {filtered.map((item) => {
                const isUp = item.changePercent >= 0;
                return (
                  <tr
                    key={item.id}
                    onClick={() => {
                      onSelectAsset(item);
                      onClose();
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-[#252936] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          background: item.badgeBg,
                          color: item.badgeColor || '#ffffff',
                        }}
                      >
                        {item.badgeText}
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </div>
                        <div className="text-xs text-[#787b86] truncate max-w-[140px] sm:max-w-xs">
                          {item.name}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-semibold">
                      {item.currencySymbol}
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td
                      className={`py-3.5 px-4 text-right tabular-nums font-bold ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {(isUp ? '+' : '') + item.changePercent.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-gray-500 hidden sm:table-cell">
                      {item.currencySymbol}{item.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-gray-500 hidden sm:table-cell">
                      {item.currencySymbol}{item.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-6 text-right tabular-nums text-gray-400 font-mono text-xs hidden md:table-cell">
                      {item.volume24h || item.marketCap || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
