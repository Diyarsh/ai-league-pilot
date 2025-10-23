// Token mapping from UI symbols to Hyperliquid symbols
export const HYPERLIQUID_SYMBOLS = {
  'BTC': 'BTC-USD',
  'ETH': 'ETH-USD', 
  'SOL': 'SOL-USD',
  'PEPE': 'PEPE-USD',
  'DOGE': 'DOGE-USD'
} as const;

export type SupportedToken = keyof typeof HYPERLIQUID_SYMBOLS;

export const getHyperliquidSymbol = (token: string): string => {
  return HYPERLIQUID_SYMBOLS[token as SupportedToken] || `${token}-USD`;
};

export const isSupportedToken = (token: string): token is SupportedToken => {
  return token in HYPERLIQUID_SYMBOLS;
};

// Risk levels for different tokens
export const TOKEN_RISK_LEVELS = {
  'BTC': 'LOW',
  'ETH': 'LOW', 
  'SOL': 'MEDIUM',
  'PEPE': 'HIGH',
  'DOGE': 'HIGH'
} as const;

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export const getTokenRiskLevel = (token: string): RiskLevel => {
  return TOKEN_RISK_LEVELS[token as SupportedToken] || 'HIGH';
};

// Minimum order sizes for different tokens
export const MIN_ORDER_SIZES = {
  'BTC': 0.001,
  'ETH': 0.01,
  'SOL': 0.1,
  'PEPE': 1000,
  'DOGE': 100
} as const;

export const getMinOrderSize = (token: string): number => {
  return MIN_ORDER_SIZES[token as SupportedToken] || 1;
};
