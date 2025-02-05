import { ChainType, PortfolioResponse } from "../../types/portfolio";

export const SUPPORTED_CHAINS = [
  { id: "1", name: "Ethereum", chainId: "1", logoUrl: "/eth-logo.png" },
  { id: "8453", name: "Base", chainId: "8453", logoUrl: "/base-logo.png" },
  { id: "42161", name: "Arbitrum", chainId: "42161", logoUrl: "/arb-logo.png" },
  { id: "56", name: "BNB Chain", chainId: "56", logoUrl: "/bnb-logo.png" },
  { id: "137", name: "Polygon", chainId: "137", logoUrl: "/polygon-logo.png" },
] as const;

export async function fetchPortfolio(
  address: string,
  chain: ChainType
): Promise<PortfolioResponse> {
  try {
    const balanceResponse = await fetch(
      `http://localhost:5173/bridge/getUserTokenBalances/${address}/${chain}`
    );
    const balanceData = await balanceResponse.json();
    const changeResponse = await fetch(
      `http://localhost:5173/bridge/getToken24hChange/${chain}`
    );
    const changeData = await changeResponse.json();

    const chainInfo = SUPPORTED_CHAINS.find((c) => c.id === chain);

    const tokens = await Promise.all(
      balanceData.change.map(async (token: any) => {
        const priceResponse = await fetch(
          `http://localhost:5173/bridge/getTokenPrice/${token.address}`
        );
        const priceData = await priceResponse.json();
        const tokenChange = changeData.find(
          (change: any) => change.name === token.token
        );

        const value = (
          parseFloat(token.balance) * parseFloat(priceData.usdValue)
        ).toFixed(2);

        return {
          token: token.token,
          symbol: token.symbol || token.token,
          balance: token.balance,
          value: `$${value}`,
          change24h: tokenChange
            ? `${tokenChange.change24H.toFixed(2)}%`
            : "0%",
          logoUrl: token.logoUrl,
          chainName: chainInfo?.name || "Unknown Chain",
        };
      })
    );

    const totalValue = tokens.reduce(
      (sum, token) =>
        sum + parseFloat(token.value.replace("$", "").replace(",", "")),
      0
    );

    return {
      totalValue: `$${totalValue.toFixed(2)}`,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return {
      totalValue: "$0.00",
      tokens: [],
    };
  }
}

export async function fetchAllChainPortfolio(address: string) {
  try {
    const chainResponses = await Promise.all(
      SUPPORTED_CHAINS.map((chain) =>
        fetchPortfolio(address, chain.id as ChainType)
      )
    );

    const allTokens = chainResponses.flatMap((response) => response.tokens);
    const totalValue = allTokens.reduce(
      (sum, token) =>
        sum + parseFloat(token.value.replace("$", "").replace(",", "")),
      0
    );

    return {
      totalValue: `$${totalValue.toFixed(2)}`,
      tokens: allTokens,
    };
  } catch (error) {
    console.error("Error fetching all chain portfolio:", error);
    return {
      totalValue: "$0.00",
      tokens: [],
    };
  }
}
