import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const { userName, email, password, isPremium } = await req.json();

    if (!userName || !email || !password) {
      return NextResponse.json({ message: "User name, Email and password are required." }, { status: 400 });
    }
    await connectDB();
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({
      userName,
      email,
      password: hashedPassword,
      usageCount: 0,
      lastReset: new Date(),
      isPremium: isPremium,
    });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.log("Registration error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
