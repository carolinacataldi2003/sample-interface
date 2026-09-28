import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Star, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentLanguage: 'EN' | 'IT';
  onLanguageChange: (lang: 'EN' | 'IT') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  darkMode,
  onToggleDarkMode,
  currentLanguage,
  onLanguageChange,
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = {
    EN: {
      searchPlaceholder: 'Search (Ctrl+K)',
      products: 'Products',
      community: 'Community',
      markets: 'Markets',
      brokers: 'Brokers',
      more: 'More',
      getStarted: 'Get started',
      account: 'Account',
      watchlist: 'Watchlist',
      profile: 'User Profile',
      demoTrader: 'Virtual Paper Trader',
      signInTitle: 'Welcome to Markets Hub',
      signInDesc: 'Access real-time global financial quotes, customized watchlists, and virtual trading.',
      demoLogin: 'Start Demo Session',
      loggedInAs: 'Connected as Trader',
      activeStatus: 'Markets Live / Session Open',
    },
    IT: {
      searchPlaceholder: 'Cerca (Ctrl+K)',
      products: 'Prodotti',
      community: 'Community',
      markets: 'Mercati',
      brokers: 'Broker',
      more: 'Altro',
      getStarted: 'Inizia ora',
      account: 'Account',
      watchlist: 'Watchlist',
      profile: 'Profilo Utente',
      demoTrader: 'Trading Virtuale',
      signInTitle: 'Benvenuto su Markets Hub',
      signInDesc: 'Accedi a quotazioni globali in tempo reale, watchlist personalizzate e simulatore di mercato.',
      demoLogin: 'Avvia Sessione Demo',
      loggedInAs: 'Connesso come Trader',
      activeStatus: 'Mercati Aperti / Sessione Regolare',
    }
  }[currentLanguage];

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors border-b ${
        darkMode ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Search Left Container */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-3xl">
            {/* Logo TradingView Icon */}
            <a 
              href="#" 
              aria-label="TradingView Markets Hub" 
              className="flex items-center gap-2 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <svg className={`w-9 h-6 transition-transform group-hover:scale-105 ${darkMode ? 'text-white' : 'text-black'}`} fill="currentColor" viewBox="0 0 36 28">
                <path d="M14 0H8L0 28H6L14 0Z"></path>
                <path d="M22 0H16L24 28H30L22 0Z"></path>
                <path d="M27 6C27 2.68629 29.6863 0 33 0C36.3137 0 39 2.68629 39 6C39 9.31371 36.3137 12 33 12C29.6863 12 27 9.31371 27 6Z"></path>
              </svg>
            </a>

            {/* Global Search Field */}
            <div className="relative w-full max-w-[260px] md:max-w-xs">
              <button 
                onClick={onOpenSearch}
                type="button" 
                className={`w-full h-9 flex items-center justify-between px-3 text-sm rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  darkMode 
                    ? 'bg-[#1e222d] text-[#787b86] hover:bg-[#2a2e39] hover:text-[#d1d4dc]' 
                    : 'bg-[#f0f3fa] text-[#787b86] hover:bg-[#e4e7ee] hover:text-[#131722]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.searchPlaceholder}</span>
                </div>
                <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded shrink-0 border ${
                  darkMode ? 'bg-[#2a2e39] text-[#787b86] border-[#363a45]' : 'bg-white text-gray-500 border-gray-200'
                }`}>
                  Ctrl+K
                </kbd>
              </button>
            </div>

            {/* Primary Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm shrink-0">
              <a 
                href="#products" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-[#787b86] hover:text-white hover:bg-[#1e222d]' : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {t.products}
              </a>
              <a 
                href="#community" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-[#787b86] hover:text-white hover:bg-[#1e222d]' : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {t.community}
              </a>
              <a 
                href="#markets" 
                aria-current="page" 
                className="px-3 py-1.5 rounded-lg text-[#2962ff] font-semibold bg-blue-50/70 dark:bg-blue-900/30"
              >
                {t.markets}
              </a>
              <a 
                href="#brokers" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-[#787b86] hover:text-white hover:bg-[#1e222d]' : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {t.brokers}
              </a>
              <a 
                href="#more" 
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-[#787b86] hover:text-white hover:bg-[#1e222d]' : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                {t.more}
              </a>
            </nav>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Watchlist Quick Button */}
            <button
              onClick={onOpenWatchlist}
              title={t.watchlist}
              className={`relative p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Star className={`w-4 h-4 ${watchlistCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{t.watchlist}</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-[#1e222d] text-amber-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-gray-100 text-gray-700'
                }`}
                type="button"
              >
                <Globe className="w-4 h-4 text-gray-500" />
                <span>{currentLanguage}</span>
              </button>

              {showLanguageDropdown && (
                <div className={`absolute right-0 mt-1 w-32 rounded-xl shadow-lg border py-1.5 z-50 ${
                  darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-gray-800'
                }`}>
                  <button
                    onClick={() => {
                      onLanguageChange('EN');
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-500/10 ${
                      currentLanguage === 'EN' ? 'text-[#2962ff] font-bold' : ''
                    }`}
                  >
                    <span>English (EN)</span>
                    {currentLanguage === 'EN' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onLanguageChange('IT');
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blue-500/10 ${
                      currentLanguage === 'IT' ? 'text-[#2962ff] font-bold' : ''
                    }`}
                  >
                    <span>Italiano (IT)</span>
                    {currentLanguage === 'IT' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <button 
              onClick={() => setShowUserModal(true)}
              aria-label={t.account} 
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-[#1e222d] text-[#d1d4dc]' : 'hover:bg-gray-100 text-gray-700'
              }`} 
              type="button"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Call to Action: Get Started */}
            <button 
              onClick={() => setShowUserModal(true)}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-sm transition-all whitespace-nowrap"
            >
              {t.getStarted}
            </button>
          </div>
        </div>
      </header>

      {/* User / Demo Trading Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
            darkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2962ff]" />
                <h3 className="font-bold text-lg">{t.signInTitle}</h3>
              </div>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {t.signInDesc}
              </p>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#2962ff]">Virtual Paper Trading Account</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                    $100,000.00
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300">
                  Simula ordini su azioni, criptovalute e materie prime in tempo reale senza rischiare capitale reale.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Nome Trader / Display Name
                </label>
                <input
                  type="text"
                  placeholder="Es. Carolina Trader"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-[#131722] border-[#363a45] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                Chiudi
              </button>
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  setShowUserModal(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#2962ff] hover:bg-blue-700 rounded-lg shadow-sm"
              >
                {t.demoLogin}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
