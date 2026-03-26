import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const redis = createRedis();

function createLimiter(
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  tokens: number,
  prefix: string
) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
  });
}

export const anonCreateLimiter = createLimiter("24 h", 5, "rl:anon-create");
export const authCreateLimiter = createLimiter("1 m", 10, "rl:auth-create");
export const redirectLimiter = createLimiter("1 m", 60, "rl:redirect");
export const authLimiter = createLimiter("1 m", 5, "rl:auth");

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!limiter) {
    return { success: true, remaining: Infinity, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}
