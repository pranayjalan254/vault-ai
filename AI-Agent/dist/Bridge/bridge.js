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
exports.bridgeRouter = void 0;
const express_1 = __importDefault(require("express"));
const Tokens_1 = require("./Tokens");
const Wallet_1 = require("./Wallet");
exports.bridgeRouter = express_1.default.Router();
exports.bridgeRouter.get("/getTokens/:chainId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chainId = parseInt(req.params.chainId);
    const result = yield (0, Tokens_1.fetchTokens)(chainId);
    res.send(result);
}));
exports.bridgeRouter.get("/getChains", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Tokens_1.fetchChains)();
    res.send(result);
}));
exports.bridgeRouter.get("/getTokenPrice/:tokenAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenAddress = req.params.tokenAddress;
    const { usdValue, decimals } = yield (0, Tokens_1.fetchTokenPriceInUsd)(tokenAddress);
    res.send({
        usdValue,
        decimals
    });
}));
exports.bridgeRouter.get("/getToken24hChange/:chainId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chainId = Number(req.params.chainId);
        const change24H = yield (0, Tokens_1.fetch24HChange)(chainId);
        res.send(change24H);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch token 24h change." });
    }
}));
exports.bridgeRouter.get("/getUserTokenBalances/:walletAddress/:chainId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletAddress = req.params.walletAddress;
    const chainId = req.params.chainId;
    const result = yield (0, Wallet_1.getUserTokenBalance)(walletAddress, chainId);
    res.send({
        "change": result
    });
}));
exports.bridgeRouter.post("/saveTraxn", (req, res) => {
    console.log(req.body);
    res.send("Successfully saved the traxn");
});
exports.bridgeRouter.get("/", (req, res) => {
    res.send("handled the route perfectly");
});
