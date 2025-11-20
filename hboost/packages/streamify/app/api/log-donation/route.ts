import { NextRequest, NextResponse } from "next/server";
import { server } from "@/server/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipient, usdValue, txId } = body;

    // Validate required fields
    if (!recipient || !usdValue || !txId) {
      return NextResponse.json(
        { error: "Missing required fields: recipient, usdValue, txId" },
        { status: 400 }
      );
    }

    // Log donation to Hedera Consensus Service (HCS)
    await server.logDonation({
      recipient,
      usdValue,
      txId,
    });

    return NextResponse.json({
      success: true,
      message: "Donation logged to HCS",
    });
  } catch (error) {
    console.error("Failed to log donation:", error);
    return NextResponse.json(
      { error: "Failed to log donation to HCS" },
      { status: 500 }
    );
  }
}
