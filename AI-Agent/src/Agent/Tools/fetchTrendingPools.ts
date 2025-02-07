import axios from "axios";

export const fetchTrendingPools = async (chain: string) => {
  const result = await axios.get(
    `https://api.geckoterminal.com/api/v2/networks/${chain}/trending_pools?page=1`
  );

  return result.data.data.slice(0, 5).map(
    (pool: {
      attributes: {
        name: any;
        base_token_price_usd: any;
        address: any;
        pool_created_at: any;
        market_cap_usd: any;
        price_change_percentage: { h24: any };
      };
    }) => ({
      name: pool.attributes.name,
      baseTokenPriceUsd: pool.attributes.base_token_price_usd,
      address: pool.attributes.address,
      poolCreatedAt: pool.attributes.pool_created_at,
      marketCapUsd: pool.attributes.market_cap_usd,
      priceChange24h: pool.attributes.price_change_percentage.h24,
    })
  );
};
