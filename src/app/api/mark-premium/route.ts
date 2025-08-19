//connect to database and update isPremium status to true
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user"; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.isPremium = true;
    user.premiumPending = false; // Mark premium as active
    await user.save();

    return NextResponse.json({ message: "User marked as premium successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error marking user as premium:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}