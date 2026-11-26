import { useNotification } from "@/context/NotificationContext";
import { useLoginAdminMutation, useLogoutAdminMutation } from "@/redux/Admin/AdminSlice";
import { Admin } from "@/Types/Admin/AdminType";

const DEVICE_KEY = "admin_device_id";

const getDeviceId = () => {
    try {
        return localStorage.getItem(DEVICE_KEY) || undefined;
    } catch {
        return undefined;
    }
};

const saveDeviceId = (id: string) => {
    try {
        localStorage.setItem(DEVICE_KEY, id);
    } catch { }
};

export const useLoginAdminHandler = () => {
    const [LoginAdmin, { isLoading }] = useLoginAdminMutation();
    const { show } = useNotification();

    const handleLoginAdmin = async ({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{ success: boolean; message?: string; admin?: Admin }> => {
        try {
            if (!email || !password) {
                return { success: false, message: "Email and password are required." };
            }

            const res = await LoginAdmin({ email, password, deviceId: getDeviceId() });

            if (res.error) {
                const message = (res.error as any)?.data?.message || "Login failed! Please try again.";
                return { success: false, message };
            }

            saveDeviceId(res.data.deviceId);

            // Encrypted session cookie (Next.js server banata hai)
            const sessionRes = await fetch("/api/admin/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ admin: res.data.admin }),
            });

            if (!sessionRes.ok) {
                return { success: false, message: "Session could not be created. Please try again." };
            }

            show({
                type: "banner",
                variant: "success",
                message: "Login successful.",
            });

            return { success: true, admin: res.data.admin };
        } catch (error) {
            return { success: false, message: "Something went wrong! Please try again." };
        }
    };

    return { handleLoginAdmin, isLoading };
};

export const useLogoutAdminHandler = () => {
    const [LogoutAdmin, { isLoading }] = useLogoutAdminMutation();

    const handleLogoutAdmin = async (): Promise<{ success: boolean }> => {
        try {
            // Backend: cookies hataye aur DB se refresh token nikaale
            await LogoutAdmin();
        } catch {
            // network fail ho to bhi neeche local session saaf karenge
        }

        try {
            // Next.js ki encrypted admin_session cookie
            await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
        } catch { }

        return { success: true };
    };

    return { handleLogoutAdmin, isLoading };
};