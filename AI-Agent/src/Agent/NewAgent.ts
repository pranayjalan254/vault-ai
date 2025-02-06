import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { fetchTokenAddress, fetchTokenPriceInUsd } from "../Bridge/Tokens";
import { fetch24HChange, fetchTokenDetails } from "../Bridge/Tokens";
import { SYSTEM_PROMPT } from "./systemPrompt";

dotenv.config();

const swap = tool(
  async ({ sourceChain, sourceToken, destinationChain, destinationToken }) => {
    return `Swapping token ${sourceToken} on chain ${sourceChain} to token ${destinationToken} on chain ${destinationChain}`;
  },
  {
    name: "swap",
    description: "swap or bridges two tokens from one chain to another",
    schema: z.object({
      sourceChain: z.string().describe("the source chain"),
      destinationChain: z.string().describe("the destination chain"),
      sourceToken: z.string().describe("the starting token"),
      destinationToken: z.string().describe("the destination token"),
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

const fetchTrendingPoolsTool = tool(
  async ({ chain }) => {
    try {
      const result = await fetchTrendingPools(chain);
      if (!result) {
        return `Sorry, I couldn't find details for ${chain}`;
      }
      return result;
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

const fecthTokenAddressTool = tool(
  async ({ tokenName }) => {
    try {
      const result = await fetchTokenAddress(tokenName);
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
      "fetches the address of a token using the token name as a parameter",
    schema: z.object({
      tokenName: z
        .string()
        .describe(
          "the token Name for which we need to find the token Address and if the user asks for the price in usd also then call the fectchTokenPriceInUsdTool otherwise just return the address, if there's an error craft a sorry message yourself and return it"
        ),
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
  async ({ sourceChain = 1 }) => {
    const result = await fetch24HChange(Number(sourceChain));
    return result;
  },
  {
    name: "fetch_24h_change",
    description:
      "fetches the chain or 24h change for tokens on a particular chain by extracting chainId from parameters, if the chainId is not provided take the chainId as 1 and then",
    schema: z.object({
      sourceChain: z.number().describe("the source chain"),
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
    swap,
    fetch24HChangeTool,
    fetchTokenPriceInUsdTool,
    fecthTokenAddressTool,
    fetchTokenDetailsTool,
    fetchTotalValueLockedTool,
    fetchTopPoolsTool,
    fetchTrendingPoolsTool,
  ],
});

import readline from "readline";
import { fetchTotalValueLocked } from "./Tools/fetchTotalValue";
import { fetchTopPools } from "./Tools/fetchTopPools";
import { fetchTrendingPools } from "./Tools/fetchTrendingPools";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const invokeAgent = async (userInput: string) => {
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
  let stream = await prebuiltAgent.stream(inputs, {
    streamMode: "values",
  });

  for await (const { messages } of stream) {
    let msg = messages[messages?.length - 1];
    console.log(msg.usage_metadata);
    if (msg?.content) {
      console.log(msg.content);
    } else if (msg?.tool_calls?.length > 0) {
      console.log(msg.tool_calls);
    }
    console.log("-----\n");
  }
  askQuestion();
};

const askQuestion = () => {
  rl.question('Enter your query (or "exit" to quit): ', (answer) => {
    if (answer.toLowerCase() === "exit" || answer.toLowerCase() === "clear") {
      rl.close();
      return;
    }
    invokeAgent(answer);
  });
};

askQuestion();
