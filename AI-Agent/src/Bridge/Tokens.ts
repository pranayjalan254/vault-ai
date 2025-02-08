import { prisma } from "../Db/db";
import axios from "axios";
import { CHAIN_IDS, CHAIN_NAMES } from "../utils/enums";
import { fetchChainId } from "./Chains";

export const fetchTokens = async (chainId: number) => {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        chain: {
          chainId: chainId,
        },
      },
    });
    return tokens;
  } catch (error) {
    console.log(error);
  }
};

export const fetchTokenAddress=async (tokenName:string,chainName:string):Promise<string>=>{
  try{
      const chainId=await fetchChainId(chainName.toLowerCase());
      const tokenDetails=await prisma.token.findFirst({
          where:{
              tokenName:{
                  search:tokenName
              },
              chainId:chainId
          },
          select:{
              address:true,
          }
      })
      return tokenDetails?.address as string
  }catch(error){
      console.log(error)
      return "Couldn't fetch the token details at the moment"
  }
}


export const fetchTokenPriceInUsd=async (tokenAddress:string):Promise<{
  usdValue:string,
  decimals:string
}>=>{
  try{ 
      const tokenDetails=await prisma.token.findFirst({
          where:{
              address:tokenAddress
          },
          select:{
              chain:true,
          }
      })
      console.log(tokenDetails?.chain.name)
      const chainName=CHAIN_NAMES[tokenDetails?.chain.name as string]
      console.log(chainName)
      const url=`https://api.geckoterminal.com/api/v2/networks/${chainName}/tokens/${tokenAddress}`
      const result=await axios.get(url);
      const usdValue=result.data.data.attributes.price_usd;
      const decimals=result.data.data.attributes.decimals;
      return {
          usdValue,
          decimals
      }
  }catch(err){
      console.log(err)
      return {
          usdValue: "0",
          decimals: "0",
        };
    
  }  
}

export const fetch24HChange=async(chainId:Number)=>{
  try{
      const tokensArray=await prisma.token.findMany({
          where:{
              chainId:Number(chainId)
          },
          select:{
              address:true,
              chain:true,
              tokenName:true
          }
      })
      const formattedTokens = tokensArray.map((item) => {
        let chainForInput;
        const chainName = item.chain.name.toLowerCase();
        if(chainName==="bnb"){
          chainForInput="bsc"
        }else{
          chainForInput=chainName
        }
        return `${chainForInput}:${item.address}`;
      }).join(",");
      // console.log("Formatted Tokens:", formattedTokens);
      const response=await axios.get(`https://coins.llama.fi/percentage/${formattedTokens}`,{
          headers:{
              "Accept":"application/json"
          }
      })
      const extractedData = Object.entries(response.data.coins).map(([key, change]) => {
          const tokenAddress = key.split(':')[1];
          const tokenDetails=tokensArray.filter((item)=>item.address===tokenAddress)
          return { 
              tokenAddress:tokenAddress,
              change24H:change,
              name:tokenDetails[0].tokenName,
              chainId:tokenDetails[0].chain.chainId,
          };
        });
        return extractedData;
  }catch(err){
      console.log(err)
      throw new Error("Failed fetching the 24hr change")
  }  
}



export const fetchChains=async()=>{
    try{
        const result=await prisma.chain.findMany()
        return result
    }catch(err){
        console.log(err)
        
    }
}

export const fetchTokenDetails=async(tokenAddress:string,chainName?:string)=>{
    try{
        if(chainName && chainName!==""){
            const chainId=await fetchChainId(chainName);
            const result=await prisma.token.findFirst({
                where:{
                    address:tokenAddress,
                    chainId:chainId
                }
            })
            return result;
        }else{
            const result=await prisma.token.findFirst({
                where:{
                    address:tokenAddress,
                }
            })
            return result;
        }
    }catch(error){
        console.log(error)
    }
}
