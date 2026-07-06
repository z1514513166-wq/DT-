import { NextRequest, NextResponse } from 'next/server';

// 不需要登录就能访问的管理后台页面
const PUBLIC_PATHS = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路径
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // 登录页面公开访问
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // 检查登录 cookie
  const token = request.cookies.get('admin_token')?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
