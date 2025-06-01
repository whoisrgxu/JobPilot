import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  usageCount: { type: Number, default: 0 },
  lastReset: { type: Date, default: new Date() },
  isPremium: { type: Boolean, default: false },
});

const User = models.User || model("User", userSchema);
export default User;
