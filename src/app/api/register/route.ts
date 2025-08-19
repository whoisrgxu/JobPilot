// app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { userName, email, password, isPremium } = await req.json();

    if (!userName || !email || !password) {
      return NextResponse.json({ message: "User name, Email and password are required." }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a random token and store its SHA-256 hash
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await User.create({
      userName,
      email,
      password: hashedPassword,
      usageCount: 0,
      lastReset: new Date(),
      premiumPending: !!isPremium,
      isActive: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: expires,
    });

    const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/activate?token=${token}`;
    
    // Customize the email body based on premium status
    const emailBody = isPremium
      ? `
        <p>Hi ${userName},</p>
        <p>Thanks for registering. Please activate your account and continue to the payment page:</p>
        <p><a href="${activationUrl}">Activate and Continue to Payment</a></p>
        <p>This link expires in 24 hours.</p>
      `
      : `
        <p>Hi ${userName},</p>
        <p>Thanks for registering. Please activate your account:</p>
        <p><a href="${activationUrl}">Activate account</a></p>
        <p>This link expires in 24 hours.</p>
      `;

    await sendEmail({
      to: email,
      subject: "Activate your account",
      html: emailBody,
    });

    return NextResponse.json(
      { message: "User registered. Please check your email to activate your account." },
      { status: 201 }
    );
  } catch (error) {
    console.log("Registration error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
