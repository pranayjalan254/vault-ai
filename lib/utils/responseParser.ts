export const parsePoolsResponse = (response: string) => {
  if (!response.includes("pools")) return null;

  const pools =
    response
      .match(
        /\d+\.\s+([^:]+):\s+Price\s+-\s+(\$[\d.]+),\s+24h change:\s+([-\d.]+)%/g
      )
      ?.map((pool) => {
        const [_, name, price, change] =
          pool.match(
            /\d+\.\s+([^:]+):\s+Price\s+-\s+(\$[\d.]+),\s+24h change:\s+([-\d.]+)%/
          ) || [];
        return {
          name,
          price,
          change: parseFloat(change),
        };
      }) || [];

  const chain = response.match(/pools on ([^:]+):/)?.[1] || "Unknown Chain";

  return {
    type: "pools",
    data: {
      chain,
      pools,
    },
  };
};

export const parseResponse = (response: string) => {
  const poolsData = parsePoolsResponse(response);
  if (poolsData) return poolsData;

  // Add more parsers here for different response types

  return {
    type: "text",
    data: response,
  };
};
