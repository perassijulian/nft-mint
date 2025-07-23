import { NextResponse } from "next/server";
import { createWalletAndSendNFT } from "@/lib/thirdweb";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const result = await createWalletAndSendNFT(email);
    return NextResponse.json({ message: "Success", result });
  } catch (err) {
    console.error("❌ Error in /subscribe:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
