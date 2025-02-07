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
Object.defineProperty(exports, "__esModule", { value: true });
exports.customTokenBalanceFetch = void 0;
const agentkit_1 = require("@coinbase/agentkit");
const zod_1 = require("zod");
const tokenBalance = (address, chain) => __awaiter(void 0, void 0, void 0, function* () {
    return "fetching the token balance";
});
exports.customTokenBalanceFetch = (0, agentkit_1.customActionProvider)({
    name: "fetch balance",
    description: "fetches the balance of a particular token for user",
    schema: zod_1.z.object({
        address: zod_1.z.string().describe("Wallet address"),
        chain: zod_1.z.string().describe("Blockchain network")
    }),
    invoke: (params) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, chain } = params;
        return yield tokenBalance(address, chain);
    })
});
