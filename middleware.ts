import NextAuth from 'next-auth';
import { authConfig } from './auth';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isAccountRoute = nextUrl.pathname.startsWith('/account');
  const isAuthRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/register';

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (req.auth?.user?.role === 'ADMIN') {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return Response.redirect(new URL('/account', nextUrl));
    }
    return;
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    if (req.auth?.user?.role !== 'ADMIN') {
      return Response.redirect(new URL('/account', nextUrl));
    }
    return;
  }

  if (isAccountRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    return;
  }

  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
