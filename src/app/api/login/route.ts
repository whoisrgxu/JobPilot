import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }
  const isPremium = user.isPremium;
  const token = signToken({ email, isPremium });

  return NextResponse.json({ token }, { status: 200 });
}
