import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  userName: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, unique: false }, // Ensure password is unique
  usageCount: { type: Number, default: 0 },
  lastReset: { type: Date, default: new Date() },
  isPremium: { type: Boolean, default: false },
  premiumPending: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false }, // This is new.Has to adjust the login page and api so that it can handle this
  emailVerificationTokenHash: { type: String, default: null }, // New
  emailVerificationExpires: { type: Date, default: null }, // New
});

const User = models.User || model("User", userSchema);
export default User;
