import { NextResponse } from "next/server";
import { fetchTokenPriceInUsd } from "../../../../../Agentic_Backend/src/Bridge/Tokens";

export async function GET(
  request: Request,
  { params }: { params: { tokenAddress: string } }
) {
  try {
    const price = await fetchTokenPriceInUsd(params.tokenAddress);
    return NextResponse.json(price);
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 }
    );
  }
}
