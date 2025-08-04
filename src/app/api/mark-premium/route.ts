import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();

  const { email } = await req.json();

  try {
    const updated = await User.findOneAndUpdate(
      { email },
      { isPremium: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User upgraded to premium." });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user", error },
      { status: 500 }
    );
  }
}
