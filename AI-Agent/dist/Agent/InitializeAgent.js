"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAgent = void 0;
const agentkit_1 = require("@coinbase/agentkit");
const fetchBalance_1 = require("./Tools/fetchBalance");
const agentkit_langchain_1 = require("@coinbase/agentkit-langchain");
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const openai_1 = require("@langchain/openai");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = require("path");
dotenv.config();
const coinbase_sdk_1 = require("@coinbase/coinbase-sdk");
const initializeAgent = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const llm = new openai_1.ChatOpenAI({
            model: "meta-llama/Llama-3.3-70B-Instruct",
            apiKey: process.env.OPENAI_API_KEY,
            configuration: {
                baseURL: "https://api.hyperbolic.xyz/v1",
                defaultHeaders: {
                    "Content-Type": "application/json"
                }
            },
            maxTokens: 2048,
            temperature: 0.7,
            topP: 0.9
        });
        const WALLET_DATA_FILE = path.join(__dirname + "/wallet_data.txt");
        let walletDataStr = null;
        //console.log("the wallet data is:",WALLET_DATA_FILE)
        // Read existing wallet data if available
        if (fs.existsSync(WALLET_DATA_FILE)) {
            try {
                walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
                //console.log("the wallet data is to be found as :",walletDataStr)
            }
            catch (error) {
                console.error("Error reading wallet data:", error);
                // Continue without wallet data
            }
        }
        // Configure CDP Wallet Provider
        const config = {
            apiKeyName: process.env.CDP_API_KEY_NAME,
            apiKeyPrivateKey: (_a = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
            cdpWalletData: walletDataStr || undefined,
            networkId: coinbase_sdk_1.Coinbase.networks.BaseMainnet,
        };
        //console.log("the config is",config)
        const walletProvider = yield agentkit_1.CdpWalletProvider.configureWithWallet(config);
        // Initialize AgentKit
        const agentkit = yield agentkit_1.AgentKit.from({
            walletProvider,
            actionProviders: [
                (0, agentkit_1.wethActionProvider)(),
                (0, agentkit_1.pythActionProvider)(),
                (0, agentkit_1.walletActionProvider)(),
                (0, agentkit_1.erc20ActionProvider)(),
                (0, agentkit_1.cdpApiActionProvider)({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: (_b = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _b === void 0 ? void 0 : _b.replace(/\\n/g, "\n"),
                }),
                (0, agentkit_1.cdpWalletActionProvider)({
                    apiKeyName: process.env.CDP_API_KEY_NAME,
                    apiKeyPrivateKey: (_c = process.env.CDP_API_KEY_PRIVATE_KEY) === null || _c === void 0 ? void 0 : _c.replace(/\\n/g, "\n"),
                }),
                fetchBalance_1.customTokenBalanceFetch
            ],
        });
        const tools = yield (0, agentkit_langchain_1.getLangChainTools)(agentkit);
        // Store buffered conversation history in memory
        const memory = new langgraph_1.MemorySaver();
        const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };
        // Create React Agent using the LLM and CDP AgentKit tools
        const agent = (0, prebuilt_1.createReactAgent)({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `
          You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
    empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
    faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
    funds from the user. Before executing your first action, get the wallet details to see what network 
    you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
    asks you to do something you can't do with your currently available tools, you must say so, and 
    encourage them to implement it themselves using the CDP SDK + AgentKit, recommend they go to 
    docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. 

    When a user provides a swap request, extract the following details:
    - **From Token**: The asset they want to swap (e.g., ETH, USDC).
    - **To Token**: The asset they want to receive (e.g., MATIC, USDT).
    - **From Chain**: The network they are swapping from (e.g., Base, Ethereum).
    - **To Chain**: The network they are swapping to (e.g., Polygon, Optimism).
      and provide the extracted parameters as a json object. for example:
      {
        fromToken:"ETH",
        fromChain:"Base",
        toToken:"Matic",
        toChain:"Polygon"
      }
    If the input is unclear, ask follow-up questions to confirm the parameters. Example:
    - User: "Swap 10 ETH on Base to Polygon"
    - Response: "You're swapping 10 ETH from Base to Polygon. What token do you want to receive on Polygon?"
  `,
        });
        //     If user asks about token balance, use these steps:
        // 1. Extract token address and chain
        // 2. Call 'fetch balance' tool
        // 3. Return balance in JSON format:
        // {
        //   "tool": "fetch balance",
        //   "params": {
        //     "address": "0x...",
        //     "chain": "base"
        //   }
        // }
        // Example interactions:
        // - User: "What's my USDC balance on Base?"
        // - Agent extracts address, calls balance tool
        // - Returns balance details
        // Save wallet data
        const exportedWallet = yield walletProvider.exportWallet();
        fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
        return { agent, config: agentConfig };
    }
    catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error; // Re-throw to be handled by caller
    }
});
exports.initializeAgent = initializeAgent;
