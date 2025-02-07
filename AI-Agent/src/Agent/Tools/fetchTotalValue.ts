import axios from "axios";

export const fetchTotalValueLocked = async (protocol: string) => {
  const result = await axios.get(`https://api.llama.fi/tvl/${protocol}`);
  console.log(result.data);
  return result.data;
};
