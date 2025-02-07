import { prisma } from "../Db/db";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import dotenv from "dotenv";
import { CHAIN_IDS } from "../utils/enums";
dotenv.config();
export const getUserTokenBalance = async (
  walletAddress: string,
  chainId: string
) => {
  try {
    const tokens = await prisma.token.findMany({
      select: {
        address: true,
        tokenName: true,
        decimal: true,
        tokenLogo: true,
        chain: {
          select: {
            name: true,
            chainId: true,
          },
        },
      },
      where: {
        chainId: Number(chainId),
      },
    });
    let RpcUrl;
    if (Number(chainId) === CHAIN_IDS.ETHEREUM) {
      RpcUrl =
        "https://eth-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
    } else if (Number(chainId) === CHAIN_IDS.BASE) {
      RpcUrl =
        "https://base-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
    } else if (Number(chainId) === CHAIN_IDS.BNB) {
      RpcUrl =
        "https://bnb-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
    } else if (Number(chainId) === CHAIN_IDS.POLYGON) {
      RpcUrl =
        "https://polygon-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
    } else {
      RpcUrl =
        "https://arb-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
    }
    const tokenAddressArray = tokens.map(
      (item: { address: any }) => item.address
    );
    const alchemyWeb3 = createAlchemyWeb3(`${RpcUrl}`);
    const balance = await alchemyWeb3.alchemy.getTokenBalances(
      walletAddress,
      tokenAddressArray
    );
    const getTokenBalances = balance.tokenBalances;
    const returnObjectArray = tokens.map(
      (item: {
        address: string;
        decimal: number;
        tokenName: any;
        tokenLogo: any;
        chain: { name: any; chainId: any };
      }) => {
        const balance = getTokenBalances.find(
          (token: { contractAddress: string }) =>
            token.contractAddress.toLowerCase() === item.address.toLowerCase()
        );
        const tokenBalance = balance?.tokenBalance || "0";
        const adjustedBalance = (
          parseInt(tokenBalance) / Math.pow(10, item.decimal)
        ).toString();

        return {
          token: item.tokenName,
          address: item.address,
          balance: adjustedBalance,
          logoUrl: item.tokenLogo,
          chainName: item.chain.name,
          chainId: item.chain.chainId,
        };
      }
    );

    // Filter out zero balances
    const nonZeroBalances = returnObjectArray.filter(
      (token: { balance: string }) => parseFloat(token.balance) > 0
    );

    return nonZeroBalances;
  } catch (err) {
    console.log(err);
  }
};
