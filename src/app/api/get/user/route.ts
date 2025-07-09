'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId} = await req.json();

    const user = await prisma.users.findUnique({
        where: {id: userId},
    });

    return NextResponse.json(user);
}