import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/account", req.url));
      }
      return null;
    }

    if (isAdminRoute) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
        if (isAuthPage) return true;
        
        // Ensure user is authenticated for /account and /admin routes
        if (req.nextUrl.pathname.startsWith("/account") || req.nextUrl.pathname.startsWith("/admin")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/register"],
};
