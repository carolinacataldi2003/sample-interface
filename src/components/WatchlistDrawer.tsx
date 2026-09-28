import React from 'react';
import { MarketItem } from '../types/market';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistItems: MarketItem[];
  onRemoveFromWatchlist: (id: string) => void;
  onSelectAsset: (asset: MarketItem) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistItems,
  onRemoveFromWatchlist,
  onSelectAsset,
  currentLanguage,
  darkMode,
}) => {
  if (!isOpen) return null;

  const t = {
    EN: {
      title: 'Watchlist',
      emptyTitle: 'Your watchlist is empty',
      emptyDesc: 'Star any index, stock, crypto, commodity, or currency pair to monitor real-time prices here.',
      remove: 'Remove',
    },
    IT: {
      title: 'Watchlist Personale',
      emptyTitle: 'La tua watchlist è vuota',
      emptyDesc: 'Aggiungi ai preferiti qualsiasi indice, azione, crypto, materia prima o valuta per monitorarla qui in tempo reale.',
      remove: 'Rimuovi',
    },
  }[currentLanguage];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md shadow-2xl flex flex-col transition-colors border-l ${
          darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}>
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <h2 className="text-lg font-bold">
                {t.title} ({watchlistItems.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 dark:divide-gray-800/80">
            {watchlistItems.length > 0 ? (
              watchlistItems.map((item) => {
                const isUp = item.changePercent >= 0;
                return (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252936] px-2 rounded-xl transition-colors group cursor-pointer"
                  >
                    <div
                      onClick={() => {
                        onSelectAsset(item);
                        onClose();
                      }}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div
                        className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
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
                        <div className="text-xs text-[#787b86] truncate max-w-[120px]">
                          {item.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => {
                          onSelectAsset(item);
                          onClose();
                        }}
                        className="text-right"
                      >
                        <div className="text-sm font-semibold tabular-nums">
                          {item.currencySymbol}{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`text-xs font-semibold tabular-nums flex items-center justify-end ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {(isUp ? '+' : '') + item.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(item.id);
                        }}
                        title={t.remove}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center px-6">
                <Star className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <h3 className="font-bold text-sm mb-1">{t.emptyTitle}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t.emptyDesc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
