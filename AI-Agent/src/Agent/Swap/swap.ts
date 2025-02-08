import { Squid } from "@0xsquid/sdk";
import { ethers, Signer } from "ethers";
import dotenv from "dotenv";
import { OnChainExecutionData, SquidData } from "@0xsquid/squid-types";
import { prisma } from "../../Db/db";

dotenv.config();
const privateKey: string = process.env.PRIVATE_KEY!;
const integratorId: string = process.env.INTEGRATOR_ID!;
const FROM_CHAIN_RPC: string = `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const provider = new ethers.providers.JsonRpcProvider(FROM_CHAIN_RPC);
const signer = new ethers.Wallet(privateKey, provider);
const approveSpending = async (
  transactionRequestTarget: string,
  fromToken: string,
  fromAmount: string,
  signer: Signer
) => {
  const erc20Abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
  ];
  const tokenContract = new ethers.Contract(fromToken, erc20Abi, signer);
  try {
    const tx = await tokenContract.approve(
      transactionRequestTarget,
      fromAmount
    );
    await tx.wait();
    console.log(
      `Approved ${fromAmount} tokens for ${transactionRequestTarget}`
    );
  } catch (error) {
    console.error("Approval failed:", error);
    throw error;
  }
};

export const Swap = async (
  sourceToken: string,
  destinationToken: string,
  sourceChain: string,
  destinationChain: string,
  amount: string
) => {
  const getSDK = (): Squid => {
    const squid = new Squid({
      baseUrl: "https://apiplus.squidrouter.com",
      integratorId: integratorId,
    });
    return squid;
  };

  const squid = getSDK();
  await squid.init();
  console.log(
    "Initialized Squid SDK",
    sourceToken,
    sourceChain,
    destinationChain,
    destinationToken
  );
  const sourceTokenDecimals = await prisma.token.findFirst({
    where: {
      address: sourceToken,
      chainId: Number(sourceChain),
    },
    select: {
      decimal: true,
    },
  });
  const AmountInUnits = (
    Number(amount) *
    10 ** (sourceTokenDecimals?.decimal as number)
  ).toString();
  console.log(AmountInUnits, sourceTokenDecimals);
  const params = {
    fromAddress: signer.address,
    fromChain: sourceChain.toString(),
    fromToken: sourceToken,
    fromAmount: AmountInUnits,
    toChain: destinationChain.toString(),
    toToken: destinationToken,
    toAddress: signer.address,
    enableBoost: false,
  };

  console.log("Parameters:", params);

  // Get the swap route using Squid SDK

  // try {
  //   const { route, requestId } = await squid.getRoute(params);
  //   console.log("Calculated route:", route.estimate.toAmount);
  //   const transactionRequest = route.transactionRequest as OnChainExecutionData;
  //   await approveSpending(
  //     transactionRequest.target,
  //     sourceToken,
  //     AmountInUnits,
  //     signer
  //   );
  //   const tx = (await squid.executeRoute({
  //     signer,
  //     route,
  //   })) as unknown as ethers.providers.TransactionResponse;
  //   const txReceipt = await tx.wait();

  //   const axelarScanLink =
  //     "https://axelarscan.io/gmp/" + txReceipt.transactionHash;
  //   console.log(`Finished! Check Axelarscan for details: ${axelarScanLink}`);
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   console.log("Swap transaction executed:", txReceipt.transactionHash);
  // } catch (err) {
  //   console.log(err);
  //   return "sorry couldn't process your transaction at the moment";
  // }
};
