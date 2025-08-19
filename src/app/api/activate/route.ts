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

    user.isActive = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;

    await user.save();
    // If you want to delay premium payment until after activation, do it here or on /registerSuccess
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/registerSuccess`);
  } catch {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
