import React, { useState, useEffect } from 'react';
import { ForexPair, FOREX_PAIRS } from '../data/marketData';
import { MarketItem } from '../types/market';
import { ArrowRight } from 'lucide-react';

interface ForexTableProps {
  onSelectPairAsAsset: (pair: ForexPair) => void;
  onViewAllPairs: () => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const ForexTable: React.FC<ForexTableProps> = ({
  onSelectPairAsAsset,
  onViewAllPairs,
  currentLanguage,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'Majors' | 'Minors' | 'Exotics'>('Majors');
  const [pairs, setPairs] = useState<ForexPair[]>(FOREX_PAIRS);
  const [flashingPair, setFlashingPair] = useState<{ id: string; dir: 'up' | 'down' } | null>(null);

  const t = {
    EN: {
      title: 'Currencies & Foreign Exchange',
      subtitle: 'Real-time quote rates for the most actively traded international FX pairs',
      majors: 'Majors',
      minors: 'Minors',
      exotics: 'Exotics',
      seeAll: 'See all pairs →',
      ticker: 'Ticker',
      bid: 'Bid',
      ask: 'Ask',
      chg: 'Chg %',
      high: 'High',
      low: 'Low',
      trend: 'Trend (24h)',
    },
    IT: {
      title: 'Valute e Cambi Esteri (Forex)',
      subtitle: 'Tassi di cambio in tempo reale per le coppie valutarie internazionali più scambiate',
      majors: 'Principali',
      minors: 'Minori',
      exotics: 'Esotiche',
      seeAll: 'Vedi tutte le coppie →',
      ticker: 'Ticker',
      bid: 'Denaro (Bid)',
      ask: 'Lettera (Ask)',
      chg: 'Var %',
      high: 'Massimo',
      low: 'Minimo',
      trend: 'Trend (24h)',
    },
  }[currentLanguage];

  // Realistic FX tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const target = prev[randomIndex];
        const isUp = Math.random() > 0.48;
        const tickAmount = target.bid > 50 ? (isUp ? 0.008 : -0.008) : (isUp ? 0.00003 : -0.00003);
        const newBid = +(target.bid + tickAmount).toFixed(target.bid > 50 ? 3 : 5);
        const spread = +(target.ask - target.bid).toFixed(target.bid > 50 ? 3 : 5);
        const newAsk = +(newBid + spread).toFixed(target.bid > 50 ? 3 : 5);

        setFlashingPair({ id: target.id, dir: isUp ? 'up' : 'down' });
        setTimeout(() => setFlashingPair(null), 800);

        return prev.map((p, idx) => idx === randomIndex ? { ...p, bid: newBid, ask: newAsk } : p);
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const filteredPairs = pairs.filter((p) => p.pairType === activeTab);

  return (
    <section className={`border rounded-2xl p-6 shadow-xs transition-colors ${
      darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
    }`}>
      {/* Table Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
            {t.title}
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('Majors')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'Majors'
                ? darkMode
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'bg-gray-100 text-black font-bold'
                : darkMode
                  ? 'text-[#787b86] hover:bg-[#252936] hover:text-white'
                  : 'text-[#787b86] hover:bg-gray-100'
            }`}
          >
            {t.majors}
          </button>
          <button
            onClick={() => setActiveTab('Minors')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'Minors'
                ? darkMode
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'bg-gray-100 text-black font-bold'
                : darkMode
                  ? 'text-[#787b86] hover:bg-[#252936] hover:text-white'
                  : 'text-[#787b86] hover:bg-gray-100'
            }`}
          >
            {t.minors}
          </button>
          <button
            onClick={() => setActiveTab('Exotics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'Exotics'
                ? darkMode
                  ? 'bg-[#2a2e39] text-white shadow-xs'
                  : 'bg-gray-100 text-black font-bold'
                : darkMode
                  ? 'text-[#787b86] hover:bg-[#252936] hover:text-white'
                  : 'text-[#787b86] hover:bg-gray-100'
            }`}
          >
            {t.exotics}
          </button>
          <button
            onClick={onViewAllPairs}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-[#2962ff] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.seeAll}</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm mt-2">
          <thead>
            <tr className="text-xs text-[#787b86] border-b border-gray-100 dark:border-gray-800">
              <th className="py-3 font-semibold">{t.ticker}</th>
              <th className="py-3 font-semibold text-right">{t.bid}</th>
              <th className="py-3 font-semibold text-right">{t.ask}</th>
              <th className="py-3 font-semibold text-right">{t.chg}</th>
              <th className="py-3 font-semibold text-right hidden sm:table-cell">{t.high}</th>
              <th className="py-3 font-semibold text-right hidden sm:table-cell">{t.low}</th>
              <th className="py-3 font-semibold text-center">{t.trend}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/70 font-medium">
            {filteredPairs.map((pair) => {
              const isUp = pair.changePercent >= 0;
              const isFlashing = flashingPair?.id === pair.id;
              const flashDir = flashingPair?.dir;

              return (
                <tr
                  key={pair.id}
                  onClick={() => onSelectPairAsAsset(pair)}
                  className="hover:bg-gray-50/80 dark:hover:bg-[#252936]/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 flex items-center gap-3">
                    <span className="font-bold text-sm text-[#2962ff] group-hover:underline">
                      {pair.ticker}
                    </span>
                    <span className="text-xs text-[#787b86] hidden md:inline">
                      {pair.name}
                    </span>
                  </td>

                  <td className={`py-3.5 text-right tabular-nums transition-colors ${
                    isFlashing ? (flashDir === 'up' ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold') : ''
                  }`}>
                    {pair.bid > 50 ? pair.bid.toFixed(3) : pair.bid.toFixed(5)}
                  </td>

                  <td className={`py-3.5 text-right tabular-nums transition-colors ${
                    isFlashing ? (flashDir === 'up' ? 'text-[#089981] font-bold' : 'text-[#f23645] font-bold') : ''
                  }`}>
                    {pair.ask > 50 ? pair.ask.toFixed(3) : pair.ask.toFixed(5)}
                  </td>

                  <td
                    className={`py-3.5 text-right tabular-nums font-bold ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {(isUp ? '+' : '') + pair.changePercent.toFixed(2) + '%'}
                  </td>

                  <td className="py-3.5 text-right tabular-nums text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {pair.high > 50 ? pair.high.toFixed(3) : pair.high.toFixed(5)}
                  </td>

                  <td className="py-3.5 text-right tabular-nums text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {pair.low > 50 ? pair.low.toFixed(3) : pair.low.toFixed(5)}
                  </td>

                  <td className="py-3.5 w-28">
                    <svg
                      className={`h-5 w-24 mx-auto ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}
                      fill="none"
                      viewBox="0 0 100 20"
                    >
                      <path
                        d={pair.trendPath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
