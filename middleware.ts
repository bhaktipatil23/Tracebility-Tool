import { NextRequest, NextResponse } from 'next/server';
import { hasRoutePermission } from './lib/permissions';

function matchPermissionBasePath(pathname: string): string | null {
  const bases = ['/', '/lots', '/segregation', '/packaging', '/inventory', '/orders', '/shipments', '/settlements', '/compliance', '/config'];
  let bestMatch: string | null = null;
  for (const base of bases) {
    if (pathname === base || pathname.startsWith(base + '/')) {
      if (!bestMatch || base.length > bestMatch.length) {
        bestMatch = base;
      }
    }
  }
  return bestMatch;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public') ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get('trf_role')?.value as any | undefined;

  // Require auth for everything except login and static
  if (!role) {
    if (pathname.startsWith('/api')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Page-level role authorization
  if (!pathname.startsWith('/api')) {
    const basePath = matchPermissionBasePath(pathname);
    if (basePath && !hasRoutePermission(basePath, role)) {
      // Forbidden → send to root
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|.*\\..*).*)'],
};




