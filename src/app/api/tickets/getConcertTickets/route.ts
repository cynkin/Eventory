'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    const tickets = await prisma.concert_tickets.findMany({
        include: {
            concert_show: {
                include: {
                    concert: true,
                }
            },
        },
    })
    console.log("Tickets", tickets);
    return NextResponse.json(tickets);
}