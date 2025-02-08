import axios from "axios";

interface CoinItem {
  item: {
    name: string;
    symbol: string;
    market_cap_rank: number;
    data: {
      price: number;
      market_cap: string;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

interface TrendingResponse {
  coins: CoinItem[];
}

export const fetchTrendingCoins = async () => {
  try {
    const url = "https://api.coingecko.com/api/v3/search/trending";
    const response = await axios.get<TrendingResponse>(url, {
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-mUmSQhQhZugEAYfKtz7UbTpW",
      },
    });

    const trendingCoins = response.data.coins.slice(0, 6).map((coin) => ({
      name: coin.item.name,
      symbol: coin.item.symbol,
      market_cap_rank: coin.item.market_cap_rank,
      price_usd: coin.item.data.price,
      market_cap: coin.item.data.market_cap,
      price_change_24h_usd: coin.item.data.price_change_percentage_24h.usd,
    }));

    return JSON.stringify(
      {
        trending_coins: trendingCoins,
      },
      null,
      2
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch trending coins: ${error.message}`);
    }
    throw new Error("Failed to fetch trending coins");
  }
};
