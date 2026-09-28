import React, { useState } from 'react';
import { CalendarEvent } from '../types/market';
import { CALENDAR_EVENTS } from '../data/marketData';
import { X, Calendar as CalendarIcon, Filter, AlertCircle } from 'lucide-react';

interface EconomicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: 'EN' | 'IT';
  darkMode: boolean;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  darkMode,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'tomorrow' | 'this_week'>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'med'>('all');

  if (!isOpen) return null;

  const t = {
    EN: {
      title: 'Global Economic Calendar',
      subtitle: 'Key macroeconomic announcements, central bank decisions, and high-impact volatility events',
      all: 'All',
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      highImpactOnly: 'High Volatility Only',
      time: 'Time',
      event: 'Event',
      impact: 'Impact',
      actual: 'Actual',
      forecast: 'Forecast',
      prior: 'Prior',
      country: 'Country',
    },
    IT: {
      title: 'Calendario Economico Globale',
      subtitle: 'Principali rilasci macroeconomici, decisioni delle banche centrali ed eventi ad alta volatilità',
      all: 'Tutti',
      today: 'Oggi',
      tomorrow: 'Domani',
      thisWeek: 'Questa Settimana',
      highImpactOnly: 'Solo Alta Volatilità',
      time: 'Ora',
      event: 'Evento Macro',
      impact: 'Impatto',
      actual: 'Effettivo',
      forecast: 'Previsto',
      prior: 'Precedente',
      country: 'Paese',
    },
  }[currentLanguage];

  const filteredEvents = CALENDAR_EVENTS.filter((evt) => {
    const matchesTime = timeFilter === 'all' || evt.dateCategory === timeFilter;
    const matchesImpact = impactFilter === 'all' || evt.impact === impactFilter;
    return matchesTime && matchesImpact;
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
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#2962ff]">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {t.title}
              </h2>
              <p className="text-xs text-[#787b86] mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            {(['all', 'today', 'tomorrow', 'this_week'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  timeFilter === tf
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : darkMode
                      ? 'text-gray-400 hover:bg-[#252936] hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {tf === 'all' ? t.all : tf === 'today' ? t.today : tf === 'tomorrow' ? t.tomorrow : t.thisWeek}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setImpactFilter(impactFilter === 'high' ? 'all' : 'high')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                impactFilter === 'high'
                  ? 'bg-amber-500 border-amber-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.highImpactOnly}</span>
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100 dark:divide-gray-800/80">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="py-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {evt.time} {evt.timeZone}
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    {evt.countryCode} · {evt.currency}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      evt.impact === 'high'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {evt.impactLabel}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  {evt.actual && (
                    <div>
                      <span className="text-gray-400 block text-[10px]">{t.actual}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{evt.actual}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t.forecast}</span>
                    <span className="font-bold">{evt.forecast}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">{t.prior}</span>
                    <span className="text-gray-500">{evt.prior}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#131722] dark:text-white">
                  {evt.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
