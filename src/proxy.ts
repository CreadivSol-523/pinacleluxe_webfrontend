import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/adminSession";

const LOGIN_PATH = "/admin/login";
const DASHBOARD_PATH = "/admin/dashboard";
const ALLOWED_ROLES = ["Admin"];

// Valid admin hai to uska role, warna null
async function getRole(req: NextRequest): Promise<string | null> {
    // Backend ka accessToken expire ho gaya to cookie hi nahi hogi => logged out
    if (!req.cookies.get("accessToken")) return null;

    const admin = await decryptSession(req.cookies.get(SESSION_COOKIE)?.value);
    return admin?.role ?? null;
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const role = await getRole(req);
    const isAllowed = !!role && ALLOWED_ROLES.includes(role);

    // Login page: pehle se logged in hai to dashboard par bhej do
    if (pathname === LOGIN_PATH) {
        if (isAllowed) return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url));
        return NextResponse.next();
    }

    // Baaki saare /admin/* pages: login zaroori
    if (!isAllowed) {
        const res = NextResponse.redirect(new URL(LOGIN_PATH, req.url));
        res.cookies.delete(SESSION_COOKIE); // kharab/purani session cookie saaf
        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};