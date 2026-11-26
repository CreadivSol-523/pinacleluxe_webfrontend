export type Admin = {
    _id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    profilePicture: string;
    createdAt: string;
};

export type AdminLoginPayload = {
    email: string;
    password: string;
    deviceId?: string;
};

export type AdminLoginResponse = {
    success: boolean;
    message: string;
    deviceId: string;
    admin: Admin;
};