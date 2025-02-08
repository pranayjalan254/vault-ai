import { NextResponse } from "next/server";
import { fetchChains } from "../../../../AI-Agent/src/Bridge/Tokens";

export async function GET() {
  try {
    const chains = await fetchChains();
    if (!chains) {
      return NextResponse.json(
        { error: "Failed to fetch chains" },
        { status: 500 }
      );
    }
    return NextResponse.json(chains);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
