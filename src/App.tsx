import React, { useState, useEffect } from 'react';
import { 
  MAJOR_INDICES, 
  TRENDING_STOCKS, 
  CRYPTO_MOVERS, 
  FUTURES_COMMODITIES, 
  FOREX_PAIRS, 
  CALENDAR_EVENTS, 
  HEATMAP_DATA,
  ALL_ASSETS,
  ForexPair
} from './data/marketData';
import { AssetCategory, MarketItem, Timeframe } from './types/market';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesShowcase } from './components/IndicesShowcase';
import { ThreeColumnMovers } from './components/ThreeColumnMovers';
import { ForexTable } from './components/ForexTable';
import { CalendarAndHeatmap } from './components/CalendarAndHeatmap';
import { SearchModal } from './components/SearchModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { FullScreenHeatmapModal } from './components/FullScreenHeatmapModal';
import { EconomicCalendarModal } from './components/EconomicCalendarModal';
import { ScreenerModal } from './components/ScreenerModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { Footer } from './components/Footer';

export default function App() {
  // Theme & Language
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'IT'>('IT');

  // Navigation & Category state
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('indices');
  const [marketScope, setMarketScope] = useState<string>('everywhere');
  const [selectedIndicesTimeframe, setSelectedIndicesTimeframe] = useState<Timeframe>('1D');

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [screenerCategory, setScreenerCategory] = useState<AssetCategory | null>(null);

  // Selected Asset for Detailed Interactive Chart Modal
  const [selectedAsset, setSelectedAsset] = useState<MarketItem | null>(null);

  // User Watchlist & Virtual Paper Trading State
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['spx', 'nvda', 'btc']);
  const [userBalance, setUserBalance] = useState<number>(100000.0);
  const [userHoldings, setUserHoldings] = useState<Record<string, number>>({
    'NVDA': 10,
    'BTC/USD': 0.25,
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExecuteTrade = (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => {
    const totalCost = shares * price;
    if (type === 'buy') {
      setUserBalance(prev => prev - totalCost);
      setUserHoldings(prev => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + shares,
      }));
    } else {
      setUserBalance(prev => prev + totalCost);
      setUserHoldings(prev => {
        const current = prev[symbol] || 0;
        const remaining = Math.max(0, current - shares);
        const updated = { ...prev };
        if (remaining <= 0) delete updated[symbol];
        else updated[symbol] = remaining;
        return updated;
      });
    }
  };

  // Convert Forex pair to standard MarketItem for Detail Modal
  const handleSelectForexPair = (pair: ForexPair) => {
    const item: MarketItem = {
      id: pair.id,
      symbol: pair.ticker,
      name: pair.name,
      category: 'forex',
      exchange: 'FX SPOT',
      badgeText: pair.ticker.split('/')[0],
      badgeBg: '#2563eb',
      price: pair.bid,
      currency: pair.quoteCurrency,
      currencySymbol: pair.quoteCurrency === 'USD' ? '$' : pair.quoteCurrency === 'EUR' ? '€' : pair.quoteCurrency === 'JPY' ? '¥' : '',
      change: pair.bid * (pair.changePercent / 100),
      changePercent: pair.changePercent,
      high24h: pair.high,
      low24h: pair.low,
      bid: pair.bid,
      ask: pair.ask,
      description: `Coppia di valute estere ${pair.name} scambiata sul mercato interbancario globale dei cambi 24 ore su 24.`,
      sparklines: {
        '1D': [pair.low, (pair.low + pair.high) / 2, pair.bid],
        '5D': [pair.low * 0.998, pair.bid * 0.999, pair.bid],
        '1M': [pair.low * 0.995, pair.high * 1.002, pair.bid],
        '1Y': [pair.low * 0.96, pair.high * 1.04, pair.bid],
        '5Y': [pair.low * 0.92, pair.high * 1.08, pair.bid],
        'All': [pair.low * 0.85, pair.high * 1.15, pair.bid],
      },
      candles: [
        { time: '04:00', open: pair.low, high: pair.high, low: pair.low, close: (pair.low + pair.bid) / 2, volume: 50000 },
        { time: '12:00', open: (pair.low + pair.bid) / 2, high: pair.high, low: pair.low, close: pair.bid, volume: 85000 },
      ]
    };
    setSelectedAsset(item);
  };

  const handleSelectStockSymbol = (symbol: string) => {
    const found = ALL_ASSETS.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
    if (found) {
      setSelectedAsset(found);
    } else {
      // Find from heatmap
      const heat = HEATMAP_DATA.find(h => h.symbol === symbol);
      if (heat) {
        setSelectedAsset({
          id: heat.symbol.toLowerCase(),
          symbol: heat.symbol,
          name: heat.name,
          category: 'stocks',
          exchange: 'S&P 500',
          badgeText: heat.symbol.slice(0, 2),
          badgeBg: '#059669',
          price: heat.price,
          currency: 'USD',
          currencySymbol: '$',
          change: heat.price * (heat.changePercent / 100),
          changePercent: heat.changePercent,
          high24h: heat.price * 1.02,
          low24h: heat.price * 0.98,
          marketCap: `${heat.marketCap}B`,
          sector: heat.sector,
          peRatio: heat.pe,
          description: `${heat.name} è una società componente dell'indice S&P 500 nel settore ${heat.sector}.`,
          sparklines: {
            '1D': [heat.price * 0.98, heat.price * 0.99, heat.price],
            '5D': [heat.price * 0.96, heat.price * 0.98, heat.price],
            '1M': [heat.price * 0.92, heat.price * 0.97, heat.price],
            '1Y': [heat.price * 0.80, heat.price * 0.95, heat.price],
            '5Y': [heat.price * 0.50, heat.price * 0.85, heat.price],
            'All': [heat.price * 0.20, heat.price * 0.60, heat.price],
          },
          candles: [
            { time: '09:30', open: heat.price * 0.99, high: heat.price * 1.01, low: heat.price * 0.985, close: heat.price * 0.995, volume: 1200000 },
            { time: '15:30', open: heat.price * 0.995, high: heat.price * 1.02, low: heat.price * 0.99, close: heat.price, volume: 2400000 },
          ]
        });
      }
    }
  };

  const handleCategorySelect = (category: AssetCategory) => {
    setActiveCategory(category);
    if (category === 'economy') {
      setIsCalendarOpen(true);
    } else if (category === 'stocks' || category === 'crypto' || category === 'futures' || category === 'indices') {
      // Scroll to that section smoothly or open screener
      const elementId = category === 'indices' ? 'section-indices' : category === 'stocks' ? 'section-movers' : category === 'crypto' ? 'section-movers' : 'section-movers';
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (category === 'forex') {
      const el = document.getElementById('section-forex');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setScreenerCategory(category);
    }
  };

  const watchlistItems = ALL_ASSETS.filter(item => watchlistIds.includes(item.id));

  // Determine screener items
  const getScreenerItems = () => {
    if (!screenerCategory) return [];
    if (screenerCategory === 'stocks') return TRENDING_STOCKS;
    if (screenerCategory === 'crypto') return CRYPTO_MOVERS;
    if (screenerCategory === 'futures') return FUTURES_COMMODITIES;
    if (screenerCategory === 'indices') return MAJOR_INDICES;
    return ALL_ASSETS.filter(a => a.category === screenerCategory);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Top Navigation */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlistIds.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      {/* Hero Headline & Category Filter Pills */}
      <HeroSection
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        currentLanguage={currentLanguage}
        marketScope={marketScope}
        onSelectMarketScope={setMarketScope}
        darkMode={darkMode}
      />

      {/* Main Content Sections */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 pb-16 space-y-12">
        {/* Indices Showcase */}
        <div id="section-indices">
          <IndicesShowcase
            indices={MAJOR_INDICES}
            selectedTimeframe={selectedIndicesTimeframe}
            onTimeframeChange={setSelectedIndicesTimeframe}
            onSelectAsset={setSelectedAsset}
            onViewAllIndices={() => setScreenerCategory('indices')}
            currentLanguage={currentLanguage}
            darkMode={darkMode}
          />
        </div>

        {/* 3 Columns: Trending stocks, Crypto movers, Futures & Commodities */}
        <div id="section-movers">
          <ThreeColumnMovers
            stocks={TRENDING_STOCKS}
            crypto={CRYPTO_MOVERS}
            commodities={FUTURES_COMMODITIES}
            onSelectAsset={setSelectedAsset}
            onOpenScreener={(cat) => setScreenerCategory(cat)}
            currentLanguage={currentLanguage}
            darkMode={darkMode}
          />
        </div>

        {/* Currencies & Foreign Exchange Table */}
        <div id="section-forex">
          <ForexTable
            onSelectPairAsAsset={handleSelectForexPair}
            onViewAllPairs={() => setScreenerCategory('forex')}
            currentLanguage={currentLanguage}
            darkMode={darkMode}
          />
        </div>

        {/* Economic Calendar & Stock Heatmap Teaser */}
        <CalendarAndHeatmap
          events={CALENDAR_EVENTS}
          heatmapStocks={HEATMAP_DATA}
          onOpenCalendarModal={() => setIsCalendarOpen(true)}
          onOpenHeatmapModal={() => setIsHeatmapOpen(true)}
          onSelectStockSymbol={handleSelectStockSymbol}
          currentLanguage={currentLanguage}
          darkMode={darkMode}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      {/* Modals & Slide-overs */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allAssets={ALL_ASSETS}
        onSelectAsset={setSelectedAsset}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlistIds.includes(selectedAsset.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        userBalance={userBalance}
        userHoldingShares={selectedAsset ? (userHoldings[selectedAsset.symbol] || 0) : 0}
        onExecuteTrade={handleExecuteTrade}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      <FullScreenHeatmapModal
        isOpen={isHeatmapOpen}
        onClose={() => setIsHeatmapOpen(false)}
        stocks={HEATMAP_DATA}
        onSelectStock={handleSelectStockSymbol}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      <EconomicCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      <ScreenerModal
        isOpen={screenerCategory !== null}
        onClose={() => setScreenerCategory(null)}
        category={screenerCategory || 'stocks'}
        items={getScreenerItems()}
        onSelectAsset={setSelectedAsset}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistItems={watchlistItems}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectAsset={setSelectedAsset}
        currentLanguage={currentLanguage}
        darkMode={darkMode}
      />
    </div>
  );
}
