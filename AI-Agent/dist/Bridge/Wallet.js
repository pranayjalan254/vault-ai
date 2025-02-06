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
exports.getUserTokenBalance = void 0;
const db_1 = require("../Db/db");
const alchemy_web3_1 = require("@alch/alchemy-web3");
const dotenv_1 = __importDefault(require("dotenv"));
const enums_1 = require("../utils/enums");
dotenv_1.default.config();
const getUserTokenBalance = (walletAddress, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield db_1.prisma.token.findMany({
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
        if (Number(chainId) === enums_1.CHAIN_IDS.ETHEREUM) {
            RpcUrl =
                "https://eth-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
        }
        else if (Number(chainId) === enums_1.CHAIN_IDS.BASE) {
            RpcUrl =
                "https://base-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
        }
        else if (Number(chainId) === enums_1.CHAIN_IDS.BNB) {
            RpcUrl =
                "https://bnb-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
        }
        else if (Number(chainId) === enums_1.CHAIN_IDS.POLYGON) {
            RpcUrl =
                "https://polygon-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
        }
        else {
            RpcUrl =
                "https://arb-mainnet.g.alchemy.com/v2/EFea4UGAL1YCQXrjAcFypp0TwWstT4Tt";
        }
        const tokenAddressArray = tokens.map((item) => item.address);
        const alchemyWeb3 = (0, alchemy_web3_1.createAlchemyWeb3)(`${RpcUrl}`);
        const balance = yield alchemyWeb3.alchemy.getTokenBalances(walletAddress, tokenAddressArray);
        const getTokenBalances = balance.tokenBalances;
        const returnObjectArray = tokens.map((item) => {
            const balance = getTokenBalances.find((token) => token.contractAddress.toLowerCase() === item.address.toLowerCase());
            const tokenBalance = (balance === null || balance === void 0 ? void 0 : balance.tokenBalance) || "0";
            const adjustedBalance = (parseInt(tokenBalance) / Math.pow(10, item.decimal)).toString();
            return {
                token: item.tokenName,
                address: item.address,
                balance: adjustedBalance,
                logoUrl: item.tokenLogo,
                chainName: item.chain.name,
                chainId: item.chain.chainId,
            };
        });
        // Filter out zero balances
        const nonZeroBalances = returnObjectArray.filter((token) => parseFloat(token.balance) > 0);
        return nonZeroBalances;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUserTokenBalance = getUserTokenBalance;
