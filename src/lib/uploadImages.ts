export type UploadedImage = {
    url: string;
    publicId: string;
    width: number;
    height: number;
};

// Form mein har image ab ye object hoti hai
export type MediaItem = {
    id: string;
    preview: string; // local blob URL, turant dikhane ke liye
    status: "uploading" | "done" | "error";
    progress: number; // 0-100
    url?: string;
    publicId?: string;
    error?: string;
};

type SignData = {
    signature: string;
    timestamp: number;
    folder: string;
    cloudName: string;
    apiKey: string;
};

// Signature 10 minute cache hota hai taake har image par sign call na ho
// (Cloudinary signature ~1 ghanta valid rakhta hai)
let cached: { data: SignData; at: number } | null = null;
const CACHE_MS = 10 * 60 * 1000;

async function getSignature(): Promise<SignData> {
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

    const res = await fetch("/api/cloudinary/sign", {
        method: "POST",
        credentials: "include", // cookie sath jayegi
    });

    if (res.status === 401) throw new Error("Session expire ho gayi, dobara login karo");
    if (!res.ok) throw new Error("Upload signature fetch failed");

    const data: SignData = await res.json();
    cached = { data, at: Date.now() };
    return data;
}

type UploadOptions = {
    onProgress?: (percent: number) => void;
    signal?: AbortSignal;
};

const abortError = () => new DOMException("Upload cancelled", "AbortError");

export async function uploadImage(file: File, { onProgress, signal }: UploadOptions = {}): Promise<UploadedImage> {
    const sign = await getSignature();

    return new Promise((resolve, reject) => {
        if (signal?.aborted) return reject(abortError());

        const form = new FormData();
        form.append("file", file);
        form.append("api_key", sign.apiKey);
        form.append("timestamp", String(sign.timestamp));
        form.append("signature", sign.signature);
        form.append("folder", sign.folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`);

        let last = -1;
        xhr.upload.onprogress = (e) => {
            if (!e.lengthComputable) return;
            // 99 tak, 100% tab jab Cloudinary ka response aa jaye
            const p = Math.min(99, Math.round((e.loaded / e.total) * 100));
            if (p !== last) {
                last = p;
                onProgress?.(p);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                resolve({
                    url: data.secure_url,
                    publicId: data.public_id,
                    width: data.width,
                    height: data.height,
                });
            } else {
                reject(new Error(`Upload failed: ${file.name}`));
            }
        };

        xhr.onerror = () => reject(new Error(`Network error: ${file.name}`));
        xhr.onabort = () => reject(abortError());

        signal?.addEventListener("abort", () => xhr.abort(), { once: true });
        xhr.send(form);
    });
}

// Cloudinary se image delete (server route ke zariye). Fail ho to chup chap ignore.
export async function deleteImage(publicId: string): Promise<void> {
    try {
        await fetch("/api/cloudinary/delete", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId }),
        });
    } catch {
        /* ignore */
    }
}