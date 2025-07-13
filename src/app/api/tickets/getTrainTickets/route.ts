'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {

    const tickets = await prisma.train_tickets.findMany({
        include: {
            train: true,
        },
    })
    return NextResponse.json(tickets);
}