import { NextResponse } from 'next/server';

// Store in-memory IP timestamps for basic rate-limiting
const rateLimitMap = new Map();

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all API routes under /api
  if (pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // 1. Prevent Cross-Site Request Forgery (CSRF): Block requests originating outside your app
    if (origin && !origin.includes(host)) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized request origin' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. IP Rate Limiting (Prevents API spamming & DDoS attacks)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1-minute window
    const maxRequests = 15;      // Max 15 API calls per minute per IP

    const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > userRecord.resetTime) {
      userRecord.count = 1;
      userRecord.resetTime = now + windowMs;
    } else {
      userRecord.count += 1;
    }

    rateLimitMap.set(ip, userRecord);

    if (userRecord.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};