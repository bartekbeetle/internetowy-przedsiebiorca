import { NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production for distributed systems)
const store: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  /**
   * Custom error message
   */
  message?: string;
}

/**
 * Rate limiter for API routes
 * Returns null if request is allowed, or NextResponse with 429 if rate limited
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): NextResponse | null {
  const { max, windowMs, message } = config;
  const now = Date.now();

  // Get or create rate limit entry
  if (!store[identifier] || store[identifier].resetTime < now) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return null; // Allow request
  }

  // Increment count
  store[identifier].count++;

  // Check if limit exceeded
  if (store[identifier].count > max) {
    const resetIn = Math.ceil((store[identifier].resetTime - now) / 1000);
    return NextResponse.json(
      {
        error:
          message ||
          `Too many requests. Please try again in ${resetIn} seconds.`,
        retryAfter: resetIn,
      },
      {
        status: 429,
        headers: {
          "Retry-After": resetIn.toString(),
          "X-RateLimit-Limit": max.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": store[identifier].resetTime.toString(),
        },
      }
    );
  }

  return null; // Allow request
}

/**
 * Get IP address from request
 */
export function getIpAddress(request: Request): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback (should not happen in production)
  return "unknown";
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
  /**
   * Strict limit for auth endpoints (login, register)
   * 5 requests per 15 minutes
   */
  AUTH: {
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message:
      "Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut.",
  },

  /**
   * Medium limit for password reset
   * 3 requests per hour
   */
  PASSWORD_RESET: {
    max: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message:
      "Zbyt wiele próśb o reset hasła. Spróbuj ponownie za godzinę.",
  },

  /**
   * Relaxed limit for API requests
   * 100 requests per minute
   */
  API: {
    max: 100,
    windowMs: 60 * 1000, // 1 minute
  },

  /**
   * Very strict for email sending
   * 2 requests per hour
   */
  EMAIL: {
    max: 2,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Zbyt wiele emaili wysłanych. Spróbuj ponownie później.",
  },
} as const;
