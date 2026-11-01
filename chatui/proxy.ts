import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refreshToken")?.value;
  
  const isLoginPage = pathname === "/login";
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/chat/:path*", "/login"],
};