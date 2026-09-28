export type AssetCategory = 
  | 'indices' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'futures' 
  | 'bonds' 
  | 'etfs' 
  | 'economy';

export type Timeframe = '1D' | '5D' | '1M' | '1Y' | '5Y' | 'All';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  badgeText: string;
  badgeBg: string;
  badgeColor?: string;
  price: number;
  currency: string;
  currencySymbol: string;
  change: number;
  changePercent: number;
  sparklines: Record<Timeframe, number[]>;
  candles: CandlePoint[];
  high24h: number;
  low24h: number;
  volume24h?: string;
  marketCap?: string;
  bid?: number;
  ask?: number;
  description: string;
  sector?: string;
  peRatio?: string;
  dividendYield?: string;
  sentiment?: {
    bullish: number;
    bearish: number;
  };
}

export interface CalendarEvent {
  id: string;
  time: string;
  timeZone: string;
  title: string;
  country: string;
  countryCode: string;
  currency: string;
  impact: 'high' | 'med' | 'low';
  impactLabel: string;
  forecast: string;
  prior: string;
  actual?: string;
  description: string;
  dateCategory: 'today' | 'tomorrow' | 'this_week';
}

export interface HeatmapStock {
  symbol: string;
  name: string;
  sector: 'Technology' | 'Consumer Discretionary' | 'Communication' | 'Financial' | 'Healthcare' | 'Energy';
  marketCap: number; // in billions
  changePercent: number;
  price: number;
  pe: string;
}

export interface UserHolding {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  timestamp: string;
}
