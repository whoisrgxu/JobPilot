// lib/rateLimiter.ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 20 requests per day per user/email
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "1d"),
  analytics: true,
  prefix: "ratelimit",
});
