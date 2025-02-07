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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTokenDetails = exports.fetchChains = exports.fetch24HChange = exports.fetchTokenPriceInUsd = exports.fetchTokenAddress = exports.fetchTokens = void 0;
const db_1 = require("../Db/db");
const axios_1 = __importDefault(require("axios"));
const enums_1 = require("../utils/enums");
const fetchTokens = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield db_1.prisma.token.findMany({
            where: {
                chain: {
                    chainId: chainId,
                },
            },
        });
        return tokens;
    }
    catch (error) {
        console.log(error);
    }
});
exports.fetchTokens = fetchTokens;
const fetchTokenAddress = (tokenName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenDetails = yield db_1.prisma.token.findFirst({
            where: {
                tokenName: {
                    equals: tokenName,
                },
            },
            select: {
                address: true,
            },
        });
        return tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.address;
    }
    catch (error) {
        console.log(error);
        return "Couldn't fetch the token details at the moment";
    }
});
exports.fetchTokenAddress = fetchTokenAddress;
const fetchTokenPriceInUsd = (tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenDetails = yield db_1.prisma.token.findFirst({
            where: {
                address: tokenAddress,
            },
            select: {
                geckoTerminalAddress: true,
                tokenName: true,
                chain: true,
            },
        });
        const chainName = enums_1.CHAIN_NAMES[tokenDetails === null || tokenDetails === void 0 ? void 0 : tokenDetails.chain.name];
        const url = `https://api.geckoterminal.com/api/v2/networks/${chainName}/tokens/${tokenAddress}`;
        const result = yield axios_1.default.get(url);
        const usdValue = result.data.data.attributes.price_usd;
        const decimals = result.data.data.attributes.decimals;
        return {
            usdValue,
            decimals,
        };
    }
    catch (err) {
        console.log(err);
        return {
            usdValue: "0",
            decimals: "0",
        };
    }
});
exports.fetchTokenPriceInUsd = fetchTokenPriceInUsd;
const fetch24HChange = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokensArray = yield db_1.prisma.token.findMany({
            where: {
                chainId: Number(chainId),
            },
            select: {
                address: true,
                chain: true,
                tokenName: true,
            },
        });
        const formattedTokens = tokensArray
            .map((item) => {
            let chainForInput;
            const chainName = item.chain.name.toLowerCase();
            if (chainName === "bnb") {
                chainForInput = "bsc";
            }
            else {
                chainForInput = chainName;
            }
            return `${chainForInput}:${item.address}`;
        })
            .join(",");
        // console.log("Formatted Tokens:", formattedTokens);
        const response = yield axios_1.default.get(`https://coins.llama.fi/percentage/${formattedTokens}`, {
            headers: {
                Accept: "application/json",
            },
        });
        const extractedData = Object.entries(response.data.coins).map(([key, change]) => {
            const tokenAddress = key.split(":")[1];
            const tokenDetails = tokensArray.filter((item) => item.address === tokenAddress);
            return {
                tokenAddress: tokenAddress,
                change24H: change,
                name: tokenDetails[0].tokenName,
                chainId: tokenDetails[0].chain.chainId,
            };
        });
        return extractedData;
    }
    catch (err) {
        console.log(err);
        throw new Error("Failed fetching the 24hr change");
    }
});
exports.fetch24HChange = fetch24HChange;
const fetchChains = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.prisma.chain.findMany();
        return result;
    }
    catch (err) {
        console.log(err);
    }
});
exports.fetchChains = fetchChains;
const fetchTokenDetails = (tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.prisma.token.findFirst({
            where: {
                address: tokenAddress,
            },
        });
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
exports.fetchTokenDetails = fetchTokenDetails;
