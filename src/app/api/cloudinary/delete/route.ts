import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyAdmin } from "@/lib/verifyAdmin";

// sign route wala FOLDER hi hona chahiye. Is se bahar ki image delete nahi hogi.
const FOLDER = "pinacle-luxe/products";
const isDev = process.env.NODE_ENV !== "production";

export async function POST(request: NextRequest) {
    const { ok, debug } = await verifyAdmin(request);
    if (!ok) {
        return NextResponse.json(
            { error: "Unauthorized", ...(isDev ? { debug } : {}) },
            { status: 401 }
        );
    }

    let publicId = "";
    try {
        const body = await request.json();
        publicId = body?.publicId;
    } catch {
        /* invalid body */
    }

    if (typeof publicId !== "string" || !publicId.startsWith(`${FOLDER}/`) || publicId.includes("..")) {
        return NextResponse.json({ error: "Invalid publicId" }, { status: 400 });
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
        return NextResponse.json({ error: "Cloudinary env variables missing" }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    // params alphabetical order mein: public_id, timestamp
    const toSign = `public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: "POST",
        body: new URLSearchParams({
            public_id: publicId,
            timestamp: String(timestamp),
            api_key: apiKey,
            signature,
        }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ result: data?.result ?? "error" }, { status: res.ok ? 200 : 502 });
}