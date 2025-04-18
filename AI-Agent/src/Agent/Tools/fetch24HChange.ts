import { prisma } from "../../Db/db";
import axios from "axios";

export const fetch24HChangeAgent = async (
  chainId: Number,
  tokenName: string
) => {
  try {
    const tokensArray = await prisma.token.findMany({
      where: {
        chainId: Number(chainId),
        tokenName: {
          contains: tokenName,
          mode: "insensitive",
        },
      },
      select: {
        address: true,
        chain: true,
        tokenName: true,
      },
    });

    const formattedTokens = tokensArray //@ts-ignore
      .map((item) => {
        let chainForInput;
        const chainName = item.chain.name.toLowerCase();
        if (chainName === "bnb") {
          chainForInput = "bsc";
        } else {
          chainForInput = chainName;
        }
        return `${chainForInput}:${item.address}`;
      })
      .join(",");
    const response = await axios.get(
      `https://coins.llama.fi/percentage/${formattedTokens}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const extractedData = Object.entries(response.data.coins).map(
      ([key, change]) => {
        const tokenAddress = key.split(":")[1];
        const tokenDetails = tokensArray.filter(
          //@ts-ignore
          (item) => item.address === tokenAddress
        );
        return {
          tokenAddress: tokenAddress,
          change24H: change,
          name: tokenDetails[0].tokenName,
          chainId: tokenDetails[0].chain.chainId,
        };
      }
    );
    return extractedData;
  } catch (err) {
    console.log(err);
    throw new Error("Failed fetching the 24hr change");
  }
};
