// admin\middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const access = req.cookies.get('access');

  // Protect admin routes
  if (!access && req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
