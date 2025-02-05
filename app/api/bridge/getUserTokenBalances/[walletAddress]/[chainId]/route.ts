import { NextResponse } from "next/server";
import { getUserTokenBalance } from "../../../../../../Agentic_Backend/src/Bridge/Wallet";

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string; chainId: string } }
) {
  try {
    const balances = await getUserTokenBalance(
      params.walletAddress,
      params.chainId
    );
    return NextResponse.json({ change: balances });
  } catch (error) {
    console.error("Error fetching token balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balances" },
      { status: 500 }
    );
  }
}
