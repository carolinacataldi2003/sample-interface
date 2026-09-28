import React, { useState, useRef, useEffect } from 'react';
import { MarketItem, Timeframe } from '../types/market';
import { Star, X, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AssetDetailModalProps {
  asset: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: string) => void;
  userBalance: number;
  userHoldingShares: number;
  onExecuteTrade: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  userBalance,
  userHoldingShares,
  onExecuteTrade,
  currentLanguage,
  darkMode,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; time?: string; index: number } | null>(null);
  const [tradeShares, setTradeShares] = useState('1');
  const [tradeActionMessage, setTradeActionMessage] = useState<string | null>(null);

  if (!asset) return null;

  const t = {
    EN: {
      timeframe: 'Timeframe',
      areaChart: 'Line',
      candlesChart: 'Candles',
      marketStats: 'Market Statistics',
      high24: '24h High',
      low24: '24h Low',
      volume: 'Volume',
      marketCap: 'Market Cap',
      peRatio: 'P/E Ratio',
      dividend: 'Dividend Yield',
      communitySentiment: 'Community Sentiment',
      bullish: 'Bullish',
      bearish: 'Bearish',
      virtualTrade: 'Paper Trade Order',
      availableCash: 'Virtual Cash',
      yourHolding: 'Your Holdings',
      shares: 'Shares / Units',
      totalCost: 'Estimated Value',
      buy: 'BUY',
      sell: 'SELL',
      insufficientFunds: 'Insufficient virtual cash to buy',
      insufficientShares: 'You do not own enough units to sell',
      orderSuccess: 'Order simulated successfully!',
      aboutAsset: 'About',
    },
    IT: {
      timeframe: 'Intervallo temporale',
      areaChart: 'Linea',
      candlesChart: 'Candele',
      marketStats: 'Statistiche di Mercato',
      high24: 'Max 24h',
      low24: 'Min 24h',
      volume: 'Volume',
      marketCap: 'Cap. di Mercato',
      peRatio: 'Rapporto P/E',
      dividend: 'Rendimento Dividendo',
      communitySentiment: 'Sentiment della Community',
      bullish: 'Rialzista',
      bearish: 'Ribassista',
      virtualTrade: 'Simulatore Ordine Virtuale',
      availableCash: 'Liquidità Virtuale',
      yourHolding: 'La tua Posizione',
      shares: 'Quote / Unità',
      totalCost: 'Valore Stimato',
      buy: 'COMPRA',
      sell: 'VENDI',
      insufficientFunds: 'Liquidità virtuale insufficiente per acquistare',
      insufficientShares: 'Non possiedi abbastanza quote da vendere',
      orderSuccess: 'Ordine simulato con successo!',
      aboutAsset: 'Informazioni su',
    },
  }[currentLanguage];

  const sparklineData = asset.sparklines[selectedTimeframe] || asset.sparklines['1D'];
  const minPrice = Math.min(...sparklineData);
  const maxPrice = Math.max(...sparklineData);
  const range = maxPrice - minPrice || 1;
  const isUp = sparklineData[sparklineData.length - 1] >= sparklineData[0];

  const currentDisplayPrice = hoveredPoint ? hoveredPoint.price : asset.price;
  const priceColor = isUp ? 'text-[#089981]' : 'text-[#f23645]';

  // Order trade calculation
  const numShares = parseFloat(tradeShares) || 0;
  const estimatedTotal = numShares * asset.price;

  const handleBuy = () => {
    if (numShares <= 0) return;
    if (estimatedTotal > userBalance) {
      setTradeActionMessage(t.insufficientFunds);
      return;
    }
    onExecuteTrade(asset.symbol, 'buy', numShares, asset.price);
    setTradeActionMessage(`${t.orderSuccess} (+${numShares} ${asset.symbol})`);
    setTimeout(() => setTradeActionMessage(null), 3000);
  };

  const handleSell = () => {
    if (numShares <= 0) return;
    if (numShares > userHoldingShares) {
      setTradeActionMessage(t.insufficientShares);
      return;
    }
    onExecuteTrade(asset.symbol, 'sell', numShares, asset.price);
    setTradeActionMessage(`${t.orderSuccess} (-${numShares} ${asset.symbol})`);
    setTimeout(() => setTradeActionMessage(null), 3000);
  };

  // Sparkline coordinates
  const points = sparklineData.map((val, idx) => {
    const x = (idx / (sparklineData.length - 1)) * 500;
    const y = 180 - ((val - minPrice) / range) * 150 - 15;
    return { x, y, val };
  });

  let lineSvg = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    lineSvg += ` Q ${prev.x + (cx - prev.x) / 2} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }
  const areaSvg = `${lineSvg} L 500 200 L 0 200 Z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border flex flex-col z-10 transition-all ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className="w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center shadow-sm"
              style={{
                background: asset.badgeBg,
                color: asset.badgeColor || '#ffffff',
              }}
            >
              {asset.badgeText}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {asset.symbol}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono">
                  {asset.exchange}
                </span>
                {asset.sector && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    · {asset.sector}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#787b86]">
                {asset.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isWatchlisted
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-500'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
              }`}
            >
              <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price & Chart Controls */}
        <div className="p-5 sm:p-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold tabular-nums">
                  {asset.currencySymbol}{currentDisplayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-sm sm:text-base font-bold tabular-nums flex items-center ${priceColor}`}>
                  {isUp ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                  {(isUp ? '+' : '')}{asset.change.toFixed(2)} ({(isUp ? '+' : '')}{asset.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1 font-mono">
                {asset.currency} · Prezzo in tempo reale · Spread 0.02%
              </div>
            </div>

            {/* Timeframes and Chart Style Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`flex rounded-xl p-0.5 text-xs font-semibold ${
                darkMode ? 'bg-[#131722]' : 'bg-gray-100'
              }`}>
                {(['1D', '5D', '1M', '1Y', '5Y', 'All'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedTimeframe === tf
                        ? darkMode
                          ? 'bg-[#2a2e39] text-white shadow-xs'
                          : 'bg-white text-black shadow-xs font-bold'
                        : 'text-gray-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className={`flex rounded-xl p-0.5 text-xs font-semibold ${
                darkMode ? 'bg-[#131722]' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setChartType('area')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    chartType === 'area'
                      ? darkMode ? 'bg-[#2a2e39] text-white' : 'bg-white text-black font-bold'
                      : 'text-gray-500'
                  }`}
                >
                  {t.areaChart}
                </button>
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    chartType === 'candles'
                      ? darkMode ? 'bg-[#2a2e39] text-white' : 'bg-white text-black font-bold'
                      : 'text-gray-500'
                  }`}
                >
                  {t.candlesChart}
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display Container */}
          <div 
            className="w-full h-56 sm:h-64 relative border rounded-2xl p-2 select-none overflow-hidden"
            style={{
              borderColor: darkMode ? '#2a2e39' : '#e0e3eb',
              backgroundColor: darkMode ? '#131722' : '#fafbfe',
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const idx = Math.round(relX * (sparklineData.length - 1));
              setHoveredPoint({ price: sparklineData[idx], index: idx });
            }}
          >
            {chartType === 'area' ? (
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isUp ? '#089981' : '#f23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke={darkMode ? '#1e222d' : '#edf0f7'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke={darkMode ? '#1e222d' : '#edf0f7'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="500" y2="150" stroke={darkMode ? '#1e222d' : '#edf0f7'} strokeWidth="1" strokeDasharray="3 3" />

                {/* Area Gradient */}
                <path d={areaSvg} fill="url(#modalGradient)" />

                {/* Main Curve */}
                <path
                  d={lineSvg}
                  fill="none"
                  stroke={isUp ? '#089981' : '#f23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Candlestick visualizer */
              <div className="w-full h-full flex items-end justify-between px-3 py-4 gap-2">
                {asset.candles.map((candle, idx) => {
                  const candleUp = candle.close >= candle.open;
                  const cColor = candleUp ? '#089981' : '#f23645';
                  const heightPct = Math.max(12, Math.min(85, ((candle.high - minPrice) / range) * 85));
                  const bodyHeightPct = Math.max(6, (Math.abs(candle.close - candle.open) / range) * 85);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group/candle relative">
                      {/* High-Low Wick */}
                      <div
                        className="w-[1.5px] rounded-full transition-all"
                        style={{
                          backgroundColor: cColor,
                          height: `${heightPct}%`,
                        }}
                      />
                      {/* Real Body */}
                      <div
                        className="w-full max-w-[20px] rounded-xs absolute transition-all"
                        style={{
                          backgroundColor: cColor,
                          height: `${bodyHeightPct}%`,
                          bottom: `${((Math.min(candle.open, candle.close) - minPrice) / range) * 75}%`,
                        }}
                      />
                      <span className="text-[9px] text-gray-400 mt-1 font-mono">{candle.time}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hover Crosshair */}
            {hoveredPoint && (
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-blue-500 pointer-events-none"
                style={{ left: `${(hoveredPoint.index / (sparklineData.length - 1)) * 100}%` }}
              >
                <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg">
                  {asset.currencySymbol}{hoveredPoint.price.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Split Grid: Metrics & Paper Trading Simulator */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Financial Statistics */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-gray-100'
          }`}>
            <h3 className="font-bold text-sm mb-3.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2962ff]" />
              <span>{t.marketStats}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#787b86] block">{t.high24}</span>
                <span className="font-semibold tabular-nums">
                  {asset.currencySymbol}{asset.high24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block">{t.low24}</span>
                <span className="font-semibold tabular-nums">
                  {asset.currencySymbol}{asset.low24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block">{t.volume}</span>
                <span className="font-semibold font-mono">{asset.volume24h || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#787b86] block">{t.marketCap}</span>
                <span className="font-semibold font-mono">{asset.marketCap || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#787b86] block">{t.peRatio}</span>
                <span className="font-semibold font-mono">{asset.peRatio || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#787b86] block">{t.dividend}</span>
                <span className="font-semibold font-mono">{asset.dividendYield || 'N/A'}</span>
              </div>
            </div>

            {/* Sentiment Gauge */}
            {asset.sentiment && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.bullish} {asset.sentiment.bullish}%</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{t.bearish} {asset.sentiment.bearish}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-rose-500 flex">
                  <div 
                    className="bg-[#089981] h-full transition-all"
                    style={{ width: `${asset.sentiment.bullish}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Paper Trading Simulator Box */}
          <div className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-gray-100'
          }`}>
            <h3 className="font-bold text-sm mb-3.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#2962ff]" />
                {t.virtualTrade}
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {t.availableCash}: ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#787b86]">{t.yourHolding}:</span>
                <span className="font-bold tabular-nums">{userHoldingShares} {asset.symbol}</span>
              </div>

              <div>
                <label className="block text-xs text-[#787b86] mb-1">
                  {t.shares}
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={tradeShares}
                  onChange={(e) => setTradeShares(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-white' : 'bg-white border-gray-200 text-black'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#787b86]">{t.totalCost}:</span>
                <span className="font-extrabold text-sm tabular-nums">
                  ${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {tradeActionMessage && (
                <div className={`p-2 rounded-lg text-xs font-semibold text-center ${
                  tradeActionMessage.includes('insufficient') || tradeActionMessage.includes('insufficiente')
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {tradeActionMessage}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleBuy}
                  className="py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#089981] hover:brightness-110 shadow-sm transition-all"
                >
                  {t.buy} {asset.symbol}
                </button>
                <button
                  onClick={handleSell}
                  disabled={userHoldingShares <= 0}
                  className={`py-2.5 rounded-xl font-extrabold text-xs text-white transition-all shadow-sm ${
                    userHoldingShares > 0
                      ? 'bg-[#f23645] hover:brightness-110'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {t.sell} {asset.symbol}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="p-5 sm:p-6 pt-0">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#787b86] mb-1.5">
            {t.aboutAsset} {asset.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {asset.description}
          </p>
        </div>
      </div>
    </div>
  );
};
