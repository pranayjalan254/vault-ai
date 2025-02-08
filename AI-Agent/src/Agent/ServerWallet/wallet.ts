import {PrivyClient} from "@privy-io/server-auth";
import dotenv from "dotenv";
import { Router } from "express";
import express from "express"
import { Request,Response } from "express";

export const walletRouter:Router=express.Router();


walletRouter.get("/",async (req: Request, res: Response) => {
    try{
      const result=await createServerWallet();
      res.send(result)
    }catch(err){
        console.log(err)
    }
});


dotenv.config()
const privy=new PrivyClient(process.env.PRIVY_APP_ID as string,process.env.PRIVY_APP_SECRET as string)


export const createServerWallet=async()=>{
    try{
        // const {id, address, chainType} = await privy.walletApi.create(
        //     {
        //     chainType: 'ethereum',
        //     // authorizationThreshold: 2, 
        // },
        // ); 
        // console.log({id, address, chainType})
        const wallet=await privy.walletApi.getWallet({
            id:'hzd8d8e7h0rpkeuofa7rz5ef'
        })
        console.log(wallet.address)
        return "hello"
    }catch(err){
        console.log(err)
    }  
}