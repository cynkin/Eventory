import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {hashPassword} from "@/utils/hash";

export async function POST(req: Request) {
    const {email, password} = await req.json();

    console.log("------ Incoming request - Update Password");
    console.log("------ Email", email);
    console.log("------ Password", password);

    const user = await prisma.users.findUnique({
        where: {email},
    });

    if(!user) return NextResponse.json({error: "User not found"});

    const hashedPassword = await hashPassword(password);
    await prisma.users.update({
        where:{email : email},
        data:{password: hashedPassword}
    })
    return NextResponse.json({user, hashedPassword});
}