export type ChainType = "ethereum" | "base" | "arbitrum" | "binance" | "polygon";

export interface TokenData {
  token: string;
  symbol: string;
  balance: string;
  value: string;
  change24h: string;
  logoUrl?: string;
}

export interface PortfolioResponse {
  totalValue: string;
  tokens: TokenData[];
}

export interface SupportedChain {
  id: ChainType;
  name: string;
  logoUrl: string;
}
