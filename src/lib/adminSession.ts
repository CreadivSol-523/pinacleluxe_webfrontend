import { EncryptJWT, jwtDecrypt } from "jose";
import type { Admin } from "@/Types/Admin/AdminType";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // seconds (7 din, refresh token jitna)

// .env.local ki base64 key ko 32 bytes me badalta hai
const getKey = () => Uint8Array.from(atob(process.env.ADMIN_SESSION_SECRET || ""), (c) => c.charCodeAt(0));

// Admin data ko encrypt karke ek string banata hai (cookie me yehi jayegi)
export const encryptSession = (admin: Admin) =>
    new EncryptJWT({ admin })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .encrypt(getKey());

// Cookie string ko wapas admin object me badalta hai (galat/expired ho to null)
export const decryptSession = async (token?: string): Promise<Admin | null> => {
    if (!token) return null;
    try {
        const { payload } = await jwtDecrypt(token, getKey());
        return (payload.admin as Admin) ?? null;
    } catch {
        return null;
    }
};