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
exports.fetchTopPools = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchTopPools = (chain) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield axios_1.default.get(`https://api.geckoterminal.com/api/v2/networks/${chain}/pools?page=1`);
    return result.data.data.slice(0, 5).map((pool) => ({
        name: pool.attributes.name,
        baseTokenPriceUsd: pool.attributes.base_token_price_usd,
        address: pool.attributes.address,
        poolCreatedAt: pool.attributes.pool_created_at,
        marketCapUsd: pool.attributes.market_cap_usd,
        priceChange24h: pool.attributes.price_change_percentage.h24,
    }));
});
exports.fetchTopPools = fetchTopPools;
