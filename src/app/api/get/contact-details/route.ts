'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId} = await req.json();

    const result = await prisma.contact.findUnique({
        where: {id: userId},
    })

    return NextResponse.json(result);
}
