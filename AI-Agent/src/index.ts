import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { bridgeRouter } from "./Bridge/bridge";
import { walletRouter } from "./Agent/ServerWallet/wallet";
import cors from "cors";
dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.PORT || 5174;

app.use("/bridge", bridgeRouter);
app.use("/wallet", walletRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
