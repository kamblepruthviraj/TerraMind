import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (path.startsWith("/farmer-dashboard") && token?.role !== "farmer") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (path.startsWith("/counsellor-dashboard") && token?.role !== "counsellor") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (path.startsWith("/admin-dashboard") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/farmer-dashboard/:path*", "/counsellor-dashboard/:path*", "/admin-dashboard/:path*"],
};
