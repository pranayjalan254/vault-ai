import {
  ChainType,
  PortfolioResponse,
  SupportedChain,
} from "../../types/portfolio";

export const SUPPORTED_CHAINS = [
  { id: "ethereum", name: "Ethereum" },
  { id: "base", name: "Base" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "binance", name: "BNB Chain" },
  { id: "polygon", name: "Polygon" },
] as const;

// Demo data for different chains
const chainTokens = {
  ethereum: [
    { token: "Ethereum", symbol: "ETH", balance: "1.45", value: "$2,750.00", change24h: "+2.5%", logoUrl: "/eth-logo.png" },
    { token: "USD Coin", symbol: "USDC", balance: "1000.00", value: "$1,000.00", change24h: "0%", logoUrl: "/usdc-logo.png" },
  ],
  base: [
    { token: "Base", symbol: "BASE", balance: "100.00", value: "$150.00", change24h: "+5.2%", logoUrl: "/base-logo.png" },
    { token: "Toshi", symbol: "TOSHI", balance: "5000.00", value: "$500.00", change24h: "-1.2%", logoUrl: "/toshi-logo.png" },
  ],
  arbitrum: [
    { token: "Arbitrum", symbol: "ARB", balance: "200.00", value: "$300.00", change24h: "+3.1%", logoUrl: "/arb-logo.png" },
    { token: "GMX", symbol: "GMX", balance: "10.00", value: "$450.00", change24h: "+7.8%", logoUrl: "/gmx-logo.png" },
  ],
  binance: [
    { token: "BNB", symbol: "BNB", balance: "5.00", value: "$1,250.00", change24h: "+1.2%", logoUrl: "/bnb-logo.png" },
    { token: "Pancake", symbol: "CAKE", balance: "100.00", value: "$150.00", change24h: "-2.3%", logoUrl: "/cake-logo.png" },
  ],
  polygon: [
    { token: "Polygon", symbol: "MATIC", balance: "1000.00", value: "$850.00", change24h: "+4.5%", logoUrl: "/matic-logo.png" },
    { token: "QuickSwap", symbol: "QUICK", balance: "2.00", value: "$100.00", change24h: "+0.8%", logoUrl: "/quick-logo.png" },
  ],
};

export async function fetchPortfolio(address: string, chain: ChainType): Promise<PortfolioResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const tokens = chainTokens[chain];
  const totalValue = tokens.reduce((sum, token) => 
    sum + parseFloat(token.value.replace('$', '').replace(',', '')), 0);

  return {
    totalValue: `$${totalValue.toFixed(2)}`,
    tokens,
  };
}

export async function fetchAllChainPortfolio(address: string) {
  const allTokens = Object.values(chainTokens).flat();
  const totalValue = allTokens.reduce((sum, token) => 
    sum + parseFloat(token.value.replace('$', '').replace(',', '')), 0);

  return {
    totalValue: `$${totalValue.toFixed(2)}`,
    tokens: allTokens,
  };
}
