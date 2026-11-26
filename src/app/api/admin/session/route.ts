import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { encryptSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/adminSession";

// Login ke baad call hota hai: encrypted session cookie banata hai
export async function POST(req: NextRequest) {
    const jar = await cookies();
    const accessToken = jar.get("accessToken")?.value;
    if (!accessToken) {
        return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 });
    }

    // Backend ka token verify karo (role yahin se milega, client se nahi)
    let verified;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
        verified = (await jwtVerify(accessToken, secret)).payload;
    } catch {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const a = body?.admin;

    // Client ka bheja hua admin wahi hona chahiye jiska token hai
    if (!a || String(a._id) !== String(verified.id)) {
        return NextResponse.json({ success: false, message: "Admin mismatch" }, { status: 400 });
    }

    // Sirf zaroori fields, aur role token se
    const admin = {
        _id: a._id,
        username: a.username,
        email: a.email,
        phone: a.phone,
        role: String(verified.role),
        profilePicture: a.profilePicture,
        createdAt: a.createdAt,
    };

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, await encryptSession(admin), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });
    return res;
}

// Logout par call hota hai: session cookie hata deta hai
export async function DELETE() {
    const res = NextResponse.json({ success: true });
    res.cookies.delete(SESSION_COOKIE);
    return res;
}