import { string } from "zod";
import { CHAIN_NAMES,CHAIN_IDS } from "../utils/enums";

export const fetchChainId=async (chainName:string):Promise<number>=>{
    if (!chainName) return 0;
    if(chainName.includes("eth") || chainName.includes("ethereum")){
        return CHAIN_IDS.ETHEREUM;
    }else if(chainName.includes("arb") || chainName.includes("arbitrum")){
        return CHAIN_IDS.ARBITRUM
    }else if(chainName.includes("pol") || chainName.includes("polygon")){
        return CHAIN_IDS.POLYGON
    }else if(chainName.includes("bsc") || chainName.includes("bnb") || chainName.includes("binance smart")){
        return CHAIN_IDS.BSC
    }
    return CHAIN_IDS.BASE
}