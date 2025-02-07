"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const google_genai_1 = require("@langchain/google-genai");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const Tokens_1 = require("../Bridge/Tokens");
const Tokens_2 = require("../Bridge/Tokens");
const systemPrompt_1 = require("./systemPrompt");
dotenv_1.default.config();
const swap = (0, tools_1.tool)(({ sourceChain, sourceToken, destinationChain, destinationToken }) => __awaiter(void 0, void 0, void 0, function* () {
    return `Swapping token ${sourceToken} on chain ${sourceChain} to token ${destinationToken} on chain ${destinationChain}`;
}), {
    name: "swap",
    description: "swap or bridges two tokens from one chain to another",
    schema: zod_1.z.object({
        sourceChain: zod_1.z.string().describe("the source chain"),
        destinationChain: zod_1.z.string().describe("the destination chain"),
        sourceToken: zod_1.z.string().describe("the starting token"),
        destinationToken: zod_1.z.string().describe("the destination token"),
    }),
});
const fetchTokenPriceInUsdTool = (0, tools_1.tool)(({ tokenAddress }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, Tokens_1.fetchTokenPriceInUsd)(tokenAddress);
        return `Current price of token: $${result.usdValue}`;
    }
    catch (error) {
        return "Sorry, I couldn't fetch the token price at this moment. Please try again later.";
    }
}), {
    name: "fetchTokenPriceInUsd",
    description: "fetches the price of a token in usd using the token Address as a parameter but calls the fetchTokenAddressTool if instead of address name is provided, if there's an error craft a sorry message yourself and return it",
    schema: zod_1.z.object({
        tokenAddress: zod_1.z
            .string()
            .describe("the token Address for which we need to find the token price in usd"),
    }),
});
const fetchTotalValueLockedTool = (0, tools_1.tool)(({ protocol }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, fetchTotalValue_1.fetchTotalValueLocked)(protocol);
        return `Total value locked in ${protocol}: $${result}`;
    }
    catch (error) {
        return "Sorry, I couldn't fetch the total value locked at this moment. Please try again later.";
    }
}), {
    name: "fetchTotalValueLocked",
    description: "fetches the TVL of a defi protocol using the protocol name as a parameter excluding the word protocol",
    schema: zod_1.z.object({
        protocol: zod_1.z
            .string()
            .describe("the protocol Name for which we need to find the TVL"),
    }),
});
const fetchTopPoolsTool = (0, tools_1.tool)(({ chain }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, fetchTopPools_1.fetchTopPools)(chain);
        if (!result) {
            return `Sorry, I couldn't find details for ${chain}`;
        }
        return result;
    }
    catch (error) {
        return `Sorry, there was an error fetching details for ${chain}`;
    }
}), {
    name: "fetchTopPools",
    description: "fetches the top pools of a chain using the chain name as a parameter",
    schema: zod_1.z.object({
        chain: zod_1.z
            .string()
            .describe("the chain Name for which we need to find the top pools. If we are fetching. If the user says ethereum as parameter take it as eth. "),
    }),
});
const fetchTrendingPoolsTool = (0, tools_1.tool)(({ chain }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, fetchTrendingPools_1.fetchTrendingPools)(chain);
        if (!result) {
            return `Sorry, I couldn't find details for ${chain}`;
        }
        return result;
    }
    catch (error) {
        return `Sorry, there was an error fetching details for ${chain}`;
    }
}), {
    name: "fetchTrendingPools",
    description: "fetches the top 5 trending pools of a chain using the chain name as a parameter",
    schema: zod_1.z.object({
        chain: zod_1.z
            .string()
            .describe("the chain Name for which we need to find the top pools. If we are fetching. If the user says ethereum as parameter take it as eth. "),
    }),
});
const fecthTokenAddressTool = (0, tools_1.tool)(({ tokenName }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, Tokens_1.fetchTokenAddress)(tokenName);
        if (!result) {
            return `Sorry, I couldn't find details for ${tokenName}`;
        }
        return result;
    }
    catch (error) {
        return `Sorry, there was an error fetching details for ${tokenName}`;
    }
}), {
    name: "fetchTokenAddress",
    description: "fetches the address of a token using the token name as a parameter",
    schema: zod_1.z.object({
        tokenName: zod_1.z
            .string()
            .describe("the token Name for which we need to find the token Address and if the user asks for the price in usd also then call the fectchTokenPriceInUsdTool otherwise just return the address, if there's an error craft a sorry message yourself and return it"),
    }),
});
const fetchTokenDetailsTool = (0, tools_1.tool)(({ tokenAddress }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, Tokens_2.fetchTokenDetails)(tokenAddress);
        if (!result) {
            return `Sorry, I couldn't find details for ${tokenAddress}`;
        }
        return result;
    }
    catch (error) {
        return `Sorry, there was an error fetching details for ${tokenAddress}`;
    }
}), {
    name: "fetchTokenDetails",
    description: "fetches the token details  of a token using the token address as a parameter",
    schema: zod_1.z.object({
        tokenAddress: zod_1.z
            .string()
            .describe("the token Address for which we need to find the token details"),
    }),
});
const fetch24HChangeTool = (0, tools_1.tool)(({ sourceChain = 1 }) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Tokens_2.fetch24HChange)(Number(sourceChain));
    return result;
}), {
    name: "fetch_24h_change",
    description: "fetches the chain or 24h change for tokens on a particular chain by extracting chainId from parameters, if the chainId is not provided take the chainId as 1 and then",
    schema: zod_1.z.object({
        sourceChain: zod_1.z.number().describe("the source chain"),
    }),
});
const model = new google_genai_1.ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: "AIzaSyDcKuuTt0a0xZlsQ7EVSCpwumXPvjfasCs",
    maxRetries: 2,
    disableStreaming: false,
});
const prebuiltAgent = (0, prebuilt_1.createReactAgent)({
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
const readline_1 = __importDefault(require("readline"));
const fetchTotalValue_1 = require("./Tools/fetchTotalValue");
const fetchTopPools_1 = require("./Tools/fetchTopPools");
const fetchTrendingPools_1 = require("./Tools/fetchTrendingPools");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const invokeAgent = (userInput) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b;
    let inputs = {
        messages: [
            {
                role: "system",
                content: systemPrompt_1.SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: userInput,
            },
        ],
    };
    let stream = yield prebuiltAgent.stream(inputs, {
        streamMode: "values",
    });
    try {
        for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
            const { messages } = stream_1_1.value;
            let msg = messages[(messages === null || messages === void 0 ? void 0 : messages.length) - 1];
            console.log(msg.usage_metadata);
            if (msg === null || msg === void 0 ? void 0 : msg.content) {
                console.log(msg.content);
            }
            else if (((_b = msg === null || msg === void 0 ? void 0 : msg.tool_calls) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                console.log(msg.tool_calls);
            }
            console.log("-----\n");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    askQuestion();
});
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
