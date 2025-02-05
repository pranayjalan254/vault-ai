import { NextResponse } from "next/server";
import { fetch24HChange } from "../../../../../Agentic_Backend/src/Bridge/Tokens";

export async function GET(
  request: Request,
  { params }: { params: { chainId: string } }
) {
  try {
    const changes = await fetch24HChange(Number(params.chainId));
    return NextResponse.json(changes);
  } catch (error) {
    console.error("Error fetching 24h changes:", error);
    return NextResponse.json(
      { error: "Failed to fetch token changes" },
      { status: 500 }
    );
  }
}
