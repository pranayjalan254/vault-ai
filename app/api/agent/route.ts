import { NextResponse } from "next/server";
import { invokeAgent } from "../../../AI-Agent/src/Agent/NewAgent"; // Adjust the import path as necessary

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await invokeAgent(message);

    return NextResponse.json({
      response,
      success: true,
    });
  } catch (error) {
    console.error("Agent error:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
