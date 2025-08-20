// app/api/token/route.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(req: NextRequest) {
    await connectDB();
    const tempToken = await getToken({ req }); // get decoded JWT payload
    const email = tempToken?.email;
    const userName = tempToken?.userName;
    console.log("Decoded userName:", userName);
    let isPremium = false; // Default value
    //check db to see if user exists
    if (email) {
        const user = await User.find({ email });
        if (user && user.length > 0) {
            isPremium = user[0].isPremium; // Assuming isPremium is a boolean field in User model
        }
        else {
            isPremium = false; // Default to false if user not found
        }       
    }
    const token = signToken({ userName, email, isPremium });
  return NextResponse.json({ token }, { status: 200 });
}
