import { connectDB } from "@/lib/db";
import User from "@/models/user";

export const checkUserUsage = async (email: string) => {
  
  const user =  await checkUserExist(email);
  if (!user) {
    return { allowed: false, reason: "User has not registered. Register first before use." };
  }
  if (user.isPremium) {
    return { allowed: true };
  }
  // Reset monthly usage if it's a new month
  const lastReset = new Date(user.lastReset);
  const now = new Date();
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    user.usageCount = 0;
    user.lastReset = now;
  }

  if (!user.isPremium && user.usageCount >= 20) {
    return { allowed: false, reason: "Limit reached." };
  }

  user.usageCount += 1;
  await user.save();
  return { allowed: true };
};

export const checkUserExist = async (email: string) => {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }
  return user;
}; 
