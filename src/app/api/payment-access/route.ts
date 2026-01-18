import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get("token");
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;
    const token = queryToken || bearerToken;

    if (!token) {
      return NextResponse.json({ allowed: false, message: "Missing token" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || typeof payload === "string") {
      return NextResponse.json({ allowed: false, message: "Invalid token" }, { status: 401 });
    }

    const email = payload.email as string | undefined;
    if (!email) {
      return NextResponse.json({ allowed: false, message: "Missing email" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return NextResponse.json({ allowed: false, message: "User not active" }, { status: 403 });
    }

    if (!user.premiumPending) {
      return NextResponse.json({ allowed: false, message: "No premium payment pending" }, { status: 403 });
    }

    return NextResponse.json({ allowed: true, email }, { status: 200 });
  } catch (error) {
    console.error("Payment access check failed:", error);
    return NextResponse.json({ allowed: false, message: "Server error" }, { status: 500 });
  }
}
