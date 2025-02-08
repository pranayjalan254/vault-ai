import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  fetchTokenAddress,
  fetchTokenPriceInUsd,
  fetch24HChange,
  fetchTokenDetails,
} from "../Bridge/Tokens";
import { fetchTotalValueLocked } from "./Tools/fetchTotalValue";
import { fetchTopPools } from "./Tools/fetchTopPools";
import { fetchTrendingPools } from "./Tools/fetchTrendingPools";
import { fetchExchangeRate } from "./Tools/fetchExchangeRate";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { fetchChainId } from "../Bridge/Chains";
import { fetch24HChangeAgent } from "./Tools/fetch24HChange";
import { fetchTrendingCoins } from "./Tools/fetchTrendingCoin";
import { JsonSerializer, throwError } from "typescript-json-serializer";
// import { fetchChainId } from "../Bridge/Chains";
// import { Swap } from "./Swap/swap";
dotenv.config();

// const swap = tool(
//   async ({
//     sourceChain,
//     sourceToken,
//     destinationChain,
//     destinationToken,
//     amount,
//   }) => {
//     console.log(destinationChain, sourceChain);
//     try {
//       const fromChain = await fetchChainId(sourceChain);
//       const toChain = await fetchChainId(destinationChain);
//       console.log(fromChain, toChain);
//       let sourceTokenAddress = sourceToken.startsWith("0x")
//         ? sourceToken
//         : await fecthTokenAddressTool.invoke({
//             tokenName: sourceToken.toLowerCase(),
//             chainName: sourceChain.toUpperCase(),
//           });

//       let destinationTokenAddress = destinationToken.startsWith("0x")
//         ? destinationToken
//         : await fecthTokenAddressTool.invoke({
//             tokenName: destinationToken.toLowerCase(),
//             chainName: destinationChain.toUpperCase(),
//           });
//       const result = await Swap(
//         sourceTokenAddress,
//         destinationTokenAddress,
//         fromChain.toString(),
//         toChain.toString(),
//         amount
//       );
//       return result;
//     } catch (err) {
//       console.log(err);
//     }
//   },
//   {
//     name: "swap",
//     description:
//       "swap or bridges two tokens from one chain to another by extracting the 5 parameters from the prompt accurately and calling the swap function",
//     schema: z.object({
//       sourceChain: z.string().describe("the source chain"),
//       destinationChain: z.string().describe("the destination chain"),
//       sourceToken: z.string().describe("the starting token"),
//       destinationToken: z.string().describe("the destination token"),
//       amount: z.string().describe("the amount of token to swap"),
//     }),
//   }
// );

const fetchExchangeRateTool = tool(
  async ({ tokenName }) => {
    try {
      const result = await fetchExchangeRate(tokenName);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return `Sorry, I couldn't fetch the exchange rate: ${error.message}`;
      }
      return "Sorry, I couldn't fetch the exchange rate at this moment. Please try again later.";
    }
  },
  {
    name: "fetchExchangeRate",
    description:
      "fetches the exchange rate of a token against BTC using the token symbol (e.g., eth, btc, ltc)",
    schema: z.object({
      tokenName: z
        .string()
        .describe(
          "the token symbol (like eth, btc, ltc) for which we need to find the exchange rate in BTC"
        ),
    }),
  }
);

const fetchTokenPriceInUsdTool = tool(
  async ({ tokenAddress }) => {
    try {
      const result = await fetchTokenPriceInUsd(tokenAddress);
      return `Current price of token: $${result.usdValue}`;
    } catch (error) {
      return "Sorry, I couldn't fetch the token price at this moment. Please try again later.";
    }
  },
  {
    name: "fetchTokenPriceInUsd",
    description:
      "fetches the price of a token in usd using the token Address as a parameter but calls the fetchTokenAddressTool if instead of address name is provided, if there's an error craft a sorry message yourself and return it",
    schema: z.object({
      tokenAddress: z
        .string()
        .describe(
          "the token Address for which we need to find the token price in usd"
        ),
    }),
  }
);

const fecthTokenAddressTool = tool(
  async ({ tokenName, chainName }) => {
    try {
      const result = await fetchTokenAddress(tokenName, chainName);
      if (!result) {
        return `Sorry, I couldn't find details for ${tokenName}`;
      }
      return result;
    } catch (error) {
      return `Sorry, there was an error fetching details for ${tokenName}`;
    }
  },
  {
    name: "fetchTokenAddress",
    description:
      "fetches the address of a token using the token name and chain name as a parameter",
    schema: z.object({
      tokenName: z
        .string()
        .describe(
          "the token Name for which we need to find the token Address and if the user asks for the price in usd also then call the fectchTokenPriceInUsdTool otherwise just return the address, if there's an error craft a sorry message yourself and return it"
        ),
      chainName: z
        .string()
        .describe("the chain Name for the token which needs to be fetched"),
    }),
  }
);

const fetchTotalValueLockedTool = tool(
  async ({ protocol }) => {
    try {
      const result = await fetchTotalValueLocked(protocol);
      return `Total value locked in ${protocol}: $${result}`;
    } catch (error) {
      return "Sorry, I couldn't fetch the total value locked at this moment. Please try again later.";
    }
  },
  {
    name: "fetchTotalValueLocked",
    description:
      "fetches the TVL of a defi protocol using the protocol name as a parameter excluding the word protocol",
    schema: z.object({
      protocol: z
        .string()
        .describe("the protocol Name for which we need to find the TVL"),
    }),
  }
);

const fetchTopPoolsTool = tool(
  async ({ chain }) => {
    try {
      const result = await fetchTopPools(chain);
      if (!result) {
        return `Sorry, I couldn't find details for ${chain}`;
      }
      return result;
    } catch (error) {
      return `Sorry, there was an error fetching details for ${chain}`;
    }
  },
  {
    name: "fetchTopPools",
    description:
      "fetches the top pools of a chain using the chain name as a parameter",
    schema: z.object({
      chain: z
        .string()
        .describe(
          "the chain Name for which we need to find the top pools. If we are fetching. If the user says ethereum as parameter take it as eth. "
        ),
    }),
  }
);
const defaultSerializer = new JsonSerializer();
const fetchTrendingPoolsTool = tool(
  async ({ chain }) => {
    try {
      const result = await fetchTrendingPools(chain);
      if (!result) {
        return `Sorry, I couldn't find details for ${chain}`;
      }

      // const formattedPools = result
      //   .map(
      //     (
      //       pool: {
      //         name: any;
      //         baseTokenPriceUsd: string;
      //         address: any;
      //         poolCreatedAt: string | number | Date;
      //         marketCapUsd: string;
      //         priceChange24h: string;
      //       },
      //       index: number
      //     ) => ` Pool ${index + 1}:
      //           - Name: ${pool.name}
      //           - Base Token Price (USD): $${parseFloat(
      //             pool.baseTokenPriceUsd
      //           ).toFixed(6)}
      //           - Address: ${pool.address}
      //           - Created At: ${new Date(
      //             pool.poolCreatedAt
      //           ).toLocaleDateString()}
      //           - Market Cap (USD): $${parseFloat(
      //             pool.marketCapUsd
      //           ).toLocaleString()}
      //           - 24h Price Change: ${parseFloat(pool.priceChange24h).toFixed(
      //             2
      //           )}%`
      //   )
      //   .join("\n");
      // const data = defaultSerializer.serialize(formattedPools);
      // return `Top 5 Trending Pools on ${chain}:\n${data}`;
      return JSON.stringify(result);
    } catch (error) {
      return `Sorry, there was an error fetching details for ${chain}`;
    }
  },
  {
    name: "fetchTrendingPools",
    description:
      "fetches the top 5 trending pools of a chain using the chain name as a parameter",
    schema: z.object({
      chain: z
        .string()
        .describe(
          "the chain Name for which we need to find the top pools. If we are fetching. If the user says ethereum as parameter take it as eth. "
        ),
    }),
  }
);
const fetchTrendingCoinTool = tool(
  async () => {
    try {
      const result = await fetchTrendingCoins();
      if (!result) {
        return `The trending coins could not be fetched at the moment.`;
      }
      return result;
    } catch (error) {
      return `Sorry, there was an error fetching details.`;
    }
  },
  {
    name: "fetchTrendingCoins",
    description:
      "fetches the top 6 trending coins. No parameters needed but requires a dummy parameter due to API constraints",
    schema: z.object({
      dummy: z
        .string()
        .optional()
        .describe("This parameter is not required by the anyone"),
    }),
  }
);

const fetchTokenDetailsTool = tool(
  async ({ tokenAddress }) => {
    try {
      const result = await fetchTokenDetails(tokenAddress);
      if (!result) {
        return `Sorry, I couldn't find details for ${tokenAddress}`;
      }
      return result;
    } catch (error) {
      return `Sorry, there was an error fetching details for ${tokenAddress}`;
    }
  },
  {
    name: "fetchTokenDetails",
    description:
      "fetches the token details  of a token using the token address as a parameter",
    schema: z.object({
      tokenAddress: z
        .string()
        .describe(
          "the token Address for which we need to find the token details"
        ),
    }),
  }
);

const fetch24HChangeTool = tool(
  async ({ sourceToken, sourceChain }) => {
    const fromChain = await fetchChainId(sourceChain);
    const result = await fetch24HChangeAgent(Number(fromChain), sourceToken);
    return result;
  },
  {
    name: "fetch24HChange",
    description:
      "fetches the chain or 24h change for tokens on a particular chain by extracting chainId and token name from parameters, if the chainId is not provided take the chainId as 1 and then proceed",
    schema: z.object({
      sourceChain: z.string().describe("the name of the source chain"),
      sourceToken: z
        .string()
        .describe(
          "the name of the token for which we need to fetch the 24h change for"
        ),
    }),
  }
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey: "AIzaSyDcKuuTt0a0xZlsQ7EVSCpwumXPvjfasCs",
  maxRetries: 2,
  disableStreaming: false,
});

const prebuiltAgent = createReactAgent({
  llm: model,
  tools: [
    // swap,
    fetch24HChangeTool,
    fetchTokenPriceInUsdTool,
    fecthTokenAddressTool,
    fetchTokenDetailsTool,
    fetchTotalValueLockedTool,
    fetchTopPoolsTool,
    fetchTrendingPoolsTool,
    fetchExchangeRateTool,
    fetchTrendingCoinTool,
  ],
});

export const invokeAgent = async (userInput: string): Promise<string> => {
  let inputs = {
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
  };

  let finalResponse = "";
  let toolOutputs: string[] = [];

  let stream = await prebuiltAgent.stream(inputs, {
    streamMode: "values",
  });

  for await (const { messages } of stream) {
    let msg = messages[messages?.length - 1];
    if (msg?.content && !msg?.tool_calls?.length) {
      finalResponse = msg.content;
    } else if (msg?.tool_calls?.length > 0) {
      const toolResults = msg.tool_calls
        .map((call: { output: any }) => call.output)
        .join("\n");
      toolOutputs.push(toolResults);
    }
  }

  if (toolOutputs.length > 0 && !finalResponse) {
    const summaryInputs = {
      messages: [
        {
          role: "system",
          content:
            "Please summarize the following information in a clear and concise way:",
        },
        {
          role: "user",
          content: toolOutputs.join("\n"),
        },
      ],
    };

    const summaryResponse = await model.invoke(summaryInputs.messages);
    finalResponse =
      typeof summaryResponse.content === "string"
        ? summaryResponse.content
        : summaryResponse.content.join(" ");
  }

  return finalResponse || "I'm sorry, I couldn't process your request.";
};
