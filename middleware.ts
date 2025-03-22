import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  // Protect all routes except:
  // - root page (/)
  // - login page (/login)
  // - api routes (/api/)
  // - static files (_next/static)
  // - images (_next/image)
  // - favicon.ico
  // - socket.io polling
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|socket.io|$).*)',
  ],
};
