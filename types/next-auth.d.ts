import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string;
            email?: string;
            role?: string;
            balance?:number;
            isNew: boolean;
            isGoogle?: boolean;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role?: string;
        balance?: number;
        isGoogle?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
        balance?: number;
        isNewUser: boolean;
        isGoogle?: boolean;
    }
}
