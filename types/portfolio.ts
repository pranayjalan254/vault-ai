export type ChainType = "1" | "8453" | "42161" | "56" | "137";

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
  chainId: string;
}
