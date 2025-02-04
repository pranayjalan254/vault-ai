import {
  ChainType,
  PortfolioResponse,
  SupportedChain,
} from "../../types/portfolio";

export const SUPPORTED_CHAINS: SupportedChain[] = [
  { id: "ethereum", name: "Ethereum", logoUrl: "/eth-logo.png" },
  { id: "base", name: "Base", logoUrl: "/base-logo.png" },
];

export async function fetchPortfolio(
  address: string,
  chain: ChainType
): Promise<PortfolioResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const mockData: Record<ChainType, PortfolioResponse> = {
    ethereum: {
      totalValue: "$15,234.56",
      tokens: [
        {
          token: "Ethereum",
          symbol: "ETH",
          balance: "5.2",
          value: "$10,234.56",
          change24h: "+2.3%",
          logoUrl: "/eth-logo.png",
        },
        {
          token: "USD Coin",
          symbol: "USDC",
          balance: "5000",
          value: "$5,000.00",
          change24h: "0%",
          logoUrl: "/usdc-logo.png",
        },
      ],
    },
    base: {
      totalValue: "$8,432.12",
      tokens: [
        {
          token: "Ethereum",
          symbol: "ETH",
          balance: "2.1",
          value: "$4,132.12",
          change24h: "+1.2%",
          logoUrl: "/eth-logo.png",
        },
        {
          token: "USD Coin",
          symbol: "USDC",
          balance: "3000",
          value: "$3,000.00",
          change24h: "0%",
          logoUrl: "/usdc-logo.png",
        },
        {
          token: "Aerodrome",
          symbol: "AERO",
          balance: "1300",
          value: "$1,300.00",
          change24h: "-0.5%",
          logoUrl: "/aero-logo.png",
        },
      ],
    },
  };

  return mockData[chain];
}
