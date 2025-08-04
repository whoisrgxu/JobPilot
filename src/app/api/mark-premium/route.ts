import { connectDB } from "@/lib/db";
import User from "@/models/user";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await connectDB();
    const updated = await User.findOneAndUpdate(
      { email },
      { isPremium: true },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User upgraded to premium" });
  } catch (error) {
    console.error("Premium update failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
