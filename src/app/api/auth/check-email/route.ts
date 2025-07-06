import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    console.log("------ Incoming request - Check Email");

    const { email } = await req.json();


    if (!email || typeof email !== "string") {
        return NextResponse.json({ message: "Invalid Email" }, { status: 400 });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (user) {
            return NextResponse.json({ exists: true, name: user.name });
        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (err) {
        console.log("----------------\nError checking email", err);
        console.log("-----------------------------------------");
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
