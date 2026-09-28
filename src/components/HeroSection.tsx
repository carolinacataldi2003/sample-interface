import React, { useState } from 'react';
import { AssetCategory } from '../types/market';
import { ChevronDown, TrendingUp, Check } from 'lucide-react';

interface HeroSectionProps {
  activeCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  currentLanguage: 'EN' | 'IT';
  marketScope: string;
  onSelectMarketScope: (scope: string) => void;
  darkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  currentLanguage,
  marketScope,
  onSelectMarketScope,
  darkMode,
}) => {
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);

  const categories: { id: AssetCategory; labelEN: string; labelIT: string }[] = [
    { id: 'indices', labelEN: 'Indices', labelIT: 'Indici' },
    { id: 'stocks', labelEN: 'Stocks', labelIT: 'Azioni' },
    { id: 'crypto', labelEN: 'Crypto', labelIT: 'Cripto' },
    { id: 'forex', labelEN: 'Forex', labelIT: 'Forex' },
    { id: 'futures', labelEN: 'Futures', labelIT: 'Futures' },
    { id: 'bonds', labelEN: 'Bonds', labelIT: 'Obbligazioni' },
    { id: 'etfs', labelEN: 'ETFs', labelIT: 'ETF' },
    { id: 'economy', labelEN: 'Economy', labelIT: 'Economia' },
  ];

  const scopes = [
    { id: 'everywhere', labelEN: 'everywhere', labelIT: 'ovunque' },
    { id: 'us', labelEN: 'US Markets', labelIT: 'Mercati USA' },
    { id: 'europe', labelEN: 'European Hub', labelIT: 'Mercati Europei' },
    { id: 'crypto', labelEN: 'Crypto 24/7', labelIT: 'Ecosistema Cripto' },
  ];

  const currentScopeObj = scopes.find(s => s.id === marketScope) || scopes[0];
  const headlineSuffix = currentLanguage === 'IT' ? currentScopeObj.labelIT : currentScopeObj.labelEN;

  return (
    <section className="pt-8 pb-3 text-center relative">
      {/* Title with Dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setScopeDropdownOpen(!scopeDropdownOpen)}
          type="button"
          className="inline-flex items-center justify-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl px-2 py-1"
        >
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
            darkMode ? 'text-white' : 'text-[#131722]'
          }`}>
            {currentLanguage === 'IT' ? 'Mercati' : 'Markets'}, {headlineSuffix}
          </h1>
          <ChevronDown className={`w-6 h-6 mt-1 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-transform ${
            scopeDropdownOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {scopeDropdownOpen && (
          <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl shadow-xl border p-2 z-30 text-left ${
            darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
          }`}>
            <div className="text-[11px] font-semibold text-gray-400 px-3 py-1 uppercase tracking-wider">
              {currentLanguage === 'IT' ? 'Seleziona Panoramica' : 'Select Scope'}
            </div>
            {scopes.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  onSelectMarketScope(s.id);
                  setScopeDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                  marketScope === s.id 
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-[#2962ff]' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{currentLanguage === 'IT' ? `Mercati, ${s.labelIT}` : `Markets, ${s.labelEN}`}</span>
                {marketScope === s.id && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="mt-7 max-w-[1440px] mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const label = currentLanguage === 'IT' ? cat.labelIT : cat.labelEN;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                type="button"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? darkMode
                      ? 'bg-white text-black shadow-md'
                      : 'bg-black text-white shadow-sm'
                    : darkMode
                      ? 'text-[#787b86] hover:text-white hover:bg-[#1e222d]'
                      : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
