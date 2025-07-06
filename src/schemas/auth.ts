import { z } from "zod";

export const emailSchema = z.object({
    email: z.string().email(),
});

export const loginSchema = emailSchema.extend({
    password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
    name: z.string().min(3),
    role: z.enum(["user", "vendor", "admin"]),
});