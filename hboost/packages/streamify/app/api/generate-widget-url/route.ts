import { NextRequest, NextResponse } from "next/server";
import { server } from "@/server/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fiatAmount, fiatCurrency, walletAddress } = body;

    // Validate required fields
    if (!fiatAmount || !fiatCurrency || !walletAddress) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: fiatAmount, fiatCurrency, walletAddress",
        },
        { status: 400 }
      );
    }

    // Generate widget URL using HboostServer
    const widgetUrl = await server.generateWidgetUrl({
      fiatAmount,
      fiatCurrency,
      cryptoCurrencyCode: "HBAR",
      walletAddress,
    });

    return NextResponse.json({ widgetUrl });
  } catch (error) {
    console.error("Failed to generate widget URL:", error);
    return NextResponse.json(
      { error: "Failed to generate widget URL" },
      { status: 500 }
    );
  }
}
