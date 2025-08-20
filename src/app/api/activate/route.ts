// app/api/activate/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }
    // if emailVerificationTokenConsumed
    if (user.emailVerificationTokenConsumedAt) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/registerSuccess?premium=${user.premiumPending}`
      )
    }
    user.isActive = true;
    user.emailVerificationTokenConsumedAt = new Date();

    await user.save();
    const premiumPending = user.premiumPending;
  
    // If you want to delay premium payment until after activation, do it here or on /registerSuccess
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/registerSuccess?premium=${premiumPending}`
    );
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
