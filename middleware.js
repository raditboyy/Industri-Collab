import { NextResponse } from 'next/server';

const OLD_HOSTS = new Set(['cetaklagi.cidz.web.id']);
const NEW_HOST = 'cetaklagi.id';

export function middleware(request) {
  const hostHeader = request.headers.get('host');
  const host = hostHeader ? hostHeader.split(':')[0].toLowerCase() : '';

  if (OLD_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.hostname = NEW_HOST;
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
