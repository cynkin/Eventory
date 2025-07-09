import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./db";

export const otpRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(1, "60 s"),
})