import React from 'react';
import { Calendar, LayoutGrid } from 'lucide-react';
import { CalendarEvent, HeatmapStock } from '../types/market';

interface CalendarAndHeatmapProps {
  events: CalendarEvent[];
  heatmapStocks: HeatmapStock[];
  onOpenCalendarModal: () => void;
  onOpenHeatmapModal: () => void;
  onSelectStockSymbol: (symbol: string) => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const CalendarAndHeatmap: React.FC<CalendarAndHeatmapProps> = ({
  events,
  heatmapStocks,
  onOpenCalendarModal,
  onOpenHeatmapModal,
  onSelectStockSymbol,
  currentLanguage,
  darkMode,
}) => {
  const t = {
    EN: {
      calendarTitle: 'Economic Calendar',
      today: 'Today',
      openCalendar: 'Open full interactive calendar →',
      forecast: 'Forecast',
      prior: 'Prior',
      heatmapTitle: 'Market Heatmap',
      sp500View: 'S&P 500 View',
      launchHeatmap: 'Launch full screen heatmap matrix →',
    },
    IT: {
      calendarTitle: 'Calendario Economico',
      today: 'Oggi',
      openCalendar: 'Apri calendario interattivo completo →',
      forecast: 'Previsto',
      prior: 'Precedente',
      heatmapTitle: 'Mappa Termica di Mercato',
      sp500View: 'Vista S&P 500',
      launchHeatmap: 'Avvia matrice mappa termica a schermo intero →',
    },
  }[currentLanguage];

  const todayEvents = events.filter(e => e.dateCategory === 'today').slice(0, 2);

  // Top 5 stocks matching the screenshot teaser
  const nvda = heatmapStocks.find(s => s.symbol === 'NVDA') || { symbol: 'NVDA', changePercent: 3.97 };
  const aapl = heatmapStocks.find(s => s.symbol === 'AAPL') || { symbol: 'AAPL', changePercent: 0.48 };
  const tsla = heatmapStocks.find(s => s.symbol === 'TSLA') || { symbol: 'TSLA', changePercent: -1.42 };
  const msft = heatmapStocks.find(s => s.symbol === 'MSFT') || { symbol: 'MSFT', changePercent: 0.85 };
  const amzn = heatmapStocks.find(s => s.symbol === 'AMZN') || { symbol: 'AMZN', changePercent: 1.12 };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Economic Calendar Teaser Card */}
      <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-xs ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2962ff]" />
              <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                {t.calendarTitle}
              </h3>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              darkMode ? 'bg-[#2a2e39] text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {t.today}
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {todayEvents.map((evt) => (
              <div 
                key={evt.id} 
                onClick={onOpenCalendarModal}
                className="flex items-start justify-between text-xs py-1.5 hover:bg-gray-50 dark:hover:bg-[#252936] px-1 rounded cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-bold">{evt.time} {evt.timeZone}</span> •{' '}
                  <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {evt.title}
                  </span>
                  <div className="text-[#787b86] mt-0.5">
                    {t.forecast}: {evt.forecast} | {t.prior}: {evt.prior}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    evt.impact === 'high'
                      ? darkMode
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        : 'bg-amber-50 text-amber-700'
                      : darkMode
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                        : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {evt.impactLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenCalendarModal}
          type="button"
          className="mt-4 inline-flex items-center text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer text-left"
        >
          {t.openCalendar}
        </button>
      </div>

      {/* Stock Heatmap Teaser Card */}
      <div className={`border rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-xs ${
        darkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#2962ff]" />
              <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#131722]'}`}>
                {t.heatmapTitle}
              </h3>
            </div>
            <button
              onClick={onOpenHeatmapModal}
              className="text-xs font-semibold text-[#2962ff] cursor-pointer hover:underline"
            >
              {t.sp500View}
            </button>
          </div>

          {/* Heatmap Mini Grid Visual */}
          <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-1.5 h-24 text-white text-[11px] font-bold">
            {/* NVDA Big Block */}
            <div
              onClick={() => onSelectStockSymbol(nvda.symbol)}
              title={`${nvda.symbol}: +${nvda.changePercent}%`}
              className="col-span-2 row-span-2 bg-[#089981] hover:brightness-110 transition-all rounded flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs"
            >
              <span>{nvda.symbol}</span>
              <span className="text-[10px] font-normal tabular-nums">+{nvda.changePercent.toFixed(2)}%</span>
            </div>

            {/* AAPL */}
            <div
              onClick={() => onSelectStockSymbol(aapl.symbol)}
              title={`${aapl.symbol}: +${aapl.changePercent}%`}
              className="bg-[#089981]/90 hover:brightness-110 transition-all rounded flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs"
            >
              <span>{aapl.symbol}</span>
              <span className="text-[10px] font-normal tabular-nums">+{aapl.changePercent.toFixed(2)}%</span>
            </div>

            {/* TSLA (Red) */}
            <div
              onClick={() => onSelectStockSymbol(tsla.symbol)}
              title={`${tsla.symbol}: ${tsla.changePercent}%`}
              className="bg-[#f23645] hover:brightness-110 transition-all rounded flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs"
            >
              <span>{tsla.symbol}</span>
              <span className="text-[10px] font-normal tabular-nums">{tsla.changePercent.toFixed(2)}%</span>
            </div>

            {/* MSFT */}
            <div
              onClick={() => onSelectStockSymbol(msft.symbol)}
              title={`${msft.symbol}: +${msft.changePercent}%`}
              className="bg-[#089981]/80 hover:brightness-110 transition-all rounded flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs"
            >
              <span>{msft.symbol}</span>
              <span className="text-[10px] font-normal tabular-nums">+{msft.changePercent.toFixed(2)}%</span>
            </div>

            {/* AMZN */}
            <div
              onClick={() => onSelectStockSymbol(amzn.symbol)}
              title={`${amzn.symbol}: +${amzn.changePercent}%`}
              className="bg-[#089981]/70 hover:brightness-110 transition-all rounded flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs"
            >
              <span>{amzn.symbol}</span>
              <span className="text-[10px] font-normal tabular-nums">+{amzn.changePercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenHeatmapModal}
          type="button"
          className="mt-4 inline-flex items-center text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer text-left"
        >
          {t.launchHeatmap}
        </button>
      </div>
    </section>
  );
};
