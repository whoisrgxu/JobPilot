// app/api/activate/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { signToken } from "@/lib/jwt";

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
    const premiumPending = user.premiumPending;
    const paymentToken = premiumPending
      ? signToken({ email: user.email, purpose: "payment" }, 60 * 30)
      : null;
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/registerSuccess`);
    redirectUrl.searchParams.set("premium", String(premiumPending));
    if (paymentToken) {
      redirectUrl.searchParams.set("token", paymentToken);
    }
    // if emailVerificationTokenConsumed
    if (user.emailVerificationTokenConsumedAt) {
      return NextResponse.redirect(redirectUrl.toString());
    }
    user.isActive = true;
    user.emailVerificationTokenConsumedAt = new Date();

    await user.save();

    // If you want to delay premium payment until after activation, do it here or on /registerSuccess
    return NextResponse.redirect(redirectUrl.toString());
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
