import { NextResponse } from "next/server";
import { fetchTokens } from "../../../../../AI-Agent/src/Bridge/Tokens";

export async function GET(
  request: Request,
  { params }: { params: { chainId: string } }
) {
  try {
    const chainId = parseInt(params.chainId);
    if (isNaN(chainId)) {
      return NextResponse.json({ error: "Invalid chain ID" }, { status: 400 });
    }

    const tokens = await fetchTokens(chainId);
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
