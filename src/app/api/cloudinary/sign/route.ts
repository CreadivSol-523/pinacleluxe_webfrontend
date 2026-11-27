import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyAdmin } from "@/lib/verifyAdmin";

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

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
        return NextResponse.json({ error: "Cloudinary env variables missing" }, { status: 500 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const toSign = `folder=${FOLDER}&timestamp=${timestamp}`;
    const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

    return NextResponse.json({ signature, timestamp, folder: FOLDER, cloudName, apiKey });
}