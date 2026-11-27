import { NextRequest } from "next/server";

export type VerifyResult = {
    ok: boolean;
    debug?: Record<string, unknown>;
};

export async function verifyAdmin(request: NextRequest): Promise<VerifyResult> {
    const backendUrl = process.env.BACKEND_API_URL;
    const verifyPath = process.env.BACKEND_VERIFY_PATH || "/api/auth/verify";
    const cookieName = process.env.ACCESS_COOKIE_NAME || "accessToken";

    if (!backendUrl) {
        return { ok: false, debug: { reason: "BACKEND_API_URL missing" } };
    }

    // Pehle cookie se token, warna Authorization header (fallback)
    const cookieToken = request.cookies.get(cookieName)?.value;
    const headerAuth = request.headers.get("authorization");
    const bearer = cookieToken ? `Bearer ${cookieToken}` : headerAuth;

    if (!bearer) {
        return {
            ok: false,
            debug: {
                reason: `Cookie "${cookieName}" nahi mili`,
                cookiesReceived: request.cookies.getAll().map((c) => c.name),
            },
        };
    }

    const url = `${backendUrl}${verifyPath}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { Authorization: bearer },
            cache: "no-store",
        });
        const body = await res.text();
        return {
            ok: res.ok,
            debug: { calledUrl: url, backendStatus: res.status, backendBody: body.slice(0, 300) },
        };
    } catch (err) {
        return {
            ok: false,
            debug: { calledUrl: url, reason: "Backend unreachable", error: String(err) },
        };
    }
}