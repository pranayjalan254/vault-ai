import express, { Router, Request, Response } from "express";
import { fetch24HChange, fetchChains, fetchTokenPriceInUsd, fetchTokens } from "./Tokens";
import { getUserTokenBalance } from "./Wallet";

export const bridgeRouter:Router=express.Router();


bridgeRouter.get("/getTokens/:chainId", async (req: Request, res: Response) => {
    const chainId = parseInt(req.params.chainId);
    const result=await fetchTokens(chainId)
    res.send(result);
});

bridgeRouter.get("/getChains",async (req: Request, res: Response) => {
     const result=await fetchChains()
    res.send(result);
});


bridgeRouter.get("/getTokenPrice/:tokenAddress",async(req:Request, res:Response)=>{
    const tokenAddress=req.params.tokenAddress;
    const {
        usdValue,
        decimals
    }=await fetchTokenPriceInUsd(tokenAddress)
    res.send({
        usdValue,
        decimals
    })
})

bridgeRouter.get("/getToken24hChange/:chainId",async(req:Request, res:Response)=>{
    try {
        const chainId = Number(req.params.chainId);
        const change24H = await fetch24HChange(chainId);
        res.send( change24H );
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch token 24h change." });
    }
})

bridgeRouter.get("/getUserTokenBalances/:walletAddress/:chainId",async(req:Request, res:Response)=>{
    const walletAddress=req.params.walletAddress;
    const chainId=req.params.chainId;
    const result=await getUserTokenBalance(walletAddress,chainId)
   res.send({
    "change":result
   })
})

bridgeRouter.post("/saveTraxn",(req: Request, res: Response) => {
    console.log(req.body)
    res.send("Successfully saved the traxn");
  });

bridgeRouter.get("/",(req: Request, res: Response) => {
    res.send("handled the route perfectly");
  })