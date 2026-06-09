import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dashboard.irembopay.com https://dashboard.sandbox.irembopay.com https://*.tawk.to https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.googleusercontent.com https://images.unsplash.com https://unsplash.com https://res.cloudinary.com https://cdn.discordapp.com https://i.scdn.co https://i.pinimg.com https://via.placeholder.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.cloudinary.com https://api.groq.com https://api.anthropic.com wss://*.tawk.to",
  "frame-src 'self' https://dashboard.irembopay.com https://dashboard.sandbox.irembopay.com",
  "worker-src 'self' blob:",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
];

const SECURITY_HEADERS: [string, string][] = [
  ["Content-Security-Policy", CSP_DIRECTIVES.join("; ")],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()"],
];

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/og") || request.nextUrl.pathname.startsWith("/api/payment-callback")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  for (const [key, value] of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
