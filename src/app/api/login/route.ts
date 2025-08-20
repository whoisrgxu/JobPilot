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
  if (!user.isActive) {
    return NextResponse.json({ message: "Account not activated. Please check your email." }, { status: 403 });
  }
  const isPremium = user.isPremium;
  const userName = user.userName;
  const isActive = user.isActive;
  const token = signToken({ userName, email, isPremium, isActive });
  return NextResponse.json({ token }, { status: 200 });
}
