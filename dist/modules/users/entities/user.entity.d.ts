export declare enum UserRole {
    CLIENT = "client",
    RECEPTIONIST = "receptionist",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    failedLoginAttempts: number;
    lockedUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
