import React from 'react';
import { MarketItem } from '../types/market';

interface ThreeColumnMoversProps {
  stocks: MarketItem[];
  crypto: MarketItem[];
  commodities: MarketItem[];
  onSelectAsset: (item: MarketItem) => void;
  onOpenScreener: (category: 'stocks' | 'crypto' | 'futures') => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const ThreeColumnMovers: React.FC<ThreeColumnMoversProps> = ({
  stocks,
  crypto,
  commodities,
  onSelectAsset,
  onOpenScreener,
  currentLanguage,
  darkMode,
}) => {
  const t = {
    EN: {
      trendingStocks: 'Trending stocks',
      viewAll: 'View all',
      exploreAllStocks: 'Explore all trending US stocks',
      cryptoMovers: 'Crypto movers',
      coins: 'Coins',
      openCryptoScreener: 'Open crypto screener',
      futuresCommodities: 'Futures & Commodities',
      contracts: 'Contracts',
      viewCommoditiesBoard: 'View full commodities board',
    },
    IT: {
      trendingStocks: 'Azioni di tendenza',
      viewAll: 'Vedi tutte',
      exploreAllStocks: 'Esplora tutte le azioni USA di tendenza',
      cryptoMovers: 'Cripto in movimento',
      coins: 'Monete',
      openCryptoScreener: 'Apri screener criptovalute',
      futuresCommodities: 'Futures e Materie Prime',
      contracts: 'Contratti',
      viewCommoditiesBoard: 'Visualizza tabellone materie prime',
    },
  }[currentLanguage];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Column 1: Most Active Stocks */}
      <div className={`p-5 border rounded-2xl flex flex-col justify-between transition-colors shadow-xs ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              {t.trendingStocks}
            </h2>
            <button
              onClick={() => onOpenScreener('stocks')}
              className="text-xs font-semibold text-[#2962ff] hover:underline"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {stocks.slice(0, 4).map((stock) => {
              const isUp = stock.changePercent >= 0;
              const formattedPrice = stock.currencySymbol + stock.price.toFixed(2);
              const formattedChange = (isUp ? '+' : '') + stock.changePercent.toFixed(2) + '%';

              return (
                <div
                  key={stock.id}
                  onClick={() => onSelectAsset(stock)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252936] -mx-2 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: stock.badgeBg }}
                    >
                      {stock.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight group-hover:text-[#2962ff] transition-colors">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-[130px]">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">
                      {formattedPrice}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {formattedChange}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onOpenScreener('stocks')}
          className={`mt-4 w-full py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'bg-[#2a2e39] text-[#d1d4dc] hover:bg-[#363a45]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t.exploreAllStocks}
        </button>
      </div>

      {/* Column 2: Crypto High Flyers */}
      <div className={`p-5 border rounded-2xl flex flex-col justify-between transition-colors shadow-xs ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              {t.cryptoMovers}
            </h2>
            <button
              onClick={() => onOpenScreener('crypto')}
              className="text-xs font-semibold text-[#2962ff] hover:underline"
            >
              {t.coins}
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {crypto.slice(0, 4).map((coin) => {
              const isUp = coin.changePercent >= 0;
              const formattedPrice = '$' + coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              const formattedChange = (isUp ? '+' : '') + coin.changePercent.toFixed(2) + '%';

              return (
                <div
                  key={coin.id}
                  onClick={() => onSelectAsset(coin)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252936] -mx-2 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        background: coin.badgeBg,
                        color: coin.badgeColor || '#ffffff',
                      }}
                    >
                      {coin.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight group-hover:text-[#2962ff] transition-colors">
                        {coin.symbol}
                      </div>
                      <div className="text-xs text-[#787b86]">
                        {coin.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">
                      {formattedPrice}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {formattedChange}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onOpenScreener('crypto')}
          className={`mt-4 w-full py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'bg-[#2a2e39] text-[#d1d4dc] hover:bg-[#363a45]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t.openCryptoScreener}
        </button>
      </div>

      {/* Column 3: Futures & Commodities */}
      <div className={`p-5 border rounded-2xl flex flex-col justify-between transition-colors shadow-xs ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
              {t.futuresCommodities}
            </h2>
            <button
              onClick={() => onOpenScreener('futures')}
              className="text-xs font-semibold text-[#2962ff] hover:underline"
            >
              {t.contracts}
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {commodities.slice(0, 4).map((item) => {
              const isUp = item.changePercent >= 0;
              const formattedPrice = item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              const formattedChange = (isUp ? '+' : '') + item.changePercent.toFixed(2) + '%';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAsset(item)}
                  className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#252936] -mx-2 px-2 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeColor || '#ffffff',
                      }}
                    >
                      {item.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-[#787b86]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">
                      {formattedPrice}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {formattedChange}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onOpenScreener('futures')}
          className={`mt-4 w-full py-2.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            darkMode
              ? 'bg-[#2a2e39] text-[#d1d4dc] hover:bg-[#363a45]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t.viewCommoditiesBoard}
        </button>
      </div>
    </section>
  );
};
