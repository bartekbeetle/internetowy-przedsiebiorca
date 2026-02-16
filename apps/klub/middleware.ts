import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking attacks
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection (legacy but still useful)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy - only send referrer for same-origin
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy - restrict access to browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy (basic - adjust as needed)
  const isDev = process.env.NODE_ENV === "development";
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isDev ? "'unsafe-eval'" : ""} 'unsafe-inline'`, // unsafe-inline needed for Next.js
    "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Tailwind
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Onboarding flow
    if (token && !token.onboardingCompleted) {
      // Jeśli nie na /onboarding → redirect
      if (!pathname.startsWith("/onboarding") && !pathname.startsWith("/api")) {
        const response = NextResponse.redirect(new URL("/onboarding", req.url));
        return addSecurityHeaders(response);
      }
    }

    // Jeśli onboarding completed a próbuje wejść na /onboarding
    if (token?.onboardingCompleted && pathname.startsWith("/onboarding")) {
      const response = NextResponse.redirect(new URL("/feed", req.url));
      return addSecurityHeaders(response);
    }

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      const response = NextResponse.redirect(new URL("/feed", req.url));
      return addSecurityHeaders(response);
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/feed/:path*",
    "/courses/:path*",
    "/reels/:path*",
    "/members/:path*",
    "/profile/:path*",
    "/leaderboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/badges/:path*",
    "/challenges/:path*",
  ],
};
