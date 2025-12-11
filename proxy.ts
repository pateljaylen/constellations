import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("sb-access-token");

  const protectedRoutes = ["/create-group", "/group"];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    return Response.redirect(loginUrl);
  }

  return;
}

export const config = {
  matcher: ["/create-group/:path*", "/group/:path*"],
};
