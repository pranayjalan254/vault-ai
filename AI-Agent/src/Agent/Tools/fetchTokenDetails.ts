import axios from "axios";

export const getTokenDetails = async (network: string, address: string) => {
  const result = await axios.get(
    `https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${address}`
  );
};
