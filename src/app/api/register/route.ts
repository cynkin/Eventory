import { registerSchema } from "@/schemas/auth";
import prisma from "@/lib/db";
import { hashPassword } from "@/utils/hash";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const body = await req.json();
    const {email, password, name, role} = registerSchema.parse(body);

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "User exists" }, { status: 400 });

    const hashedPassword = await hashPassword(password);

    await prisma.users.create({
        data: { email, password: hashedPassword, name, role },
    });

    console.log("\nREGISTERED\n")
    return NextResponse.json({ message: "User registered" }, {status: 200});
}