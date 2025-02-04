export type ChainType = "ethereum" | "base";

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  value: string;
  change24h: string;
  logoUrl?: string;
}

export interface PortfolioResponse {
  totalValue: string;
  tokens: TokenBalance[];
}

export interface SupportedChain {
  id: ChainType;
  name: string;
  logoUrl: string;
}
