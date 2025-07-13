'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {

    const tickets = await prisma.tickets.findMany({
        include: {
            show: {
                include: {
                    movie: true,
                    theatre: true,
                },
            },
        },
    })
    return NextResponse.json(tickets);
}