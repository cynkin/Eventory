'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId} = await req.json();

    const tickets = await prisma.train_tickets.findMany({
        where: {user_id: userId},
        include: {
            train: true
        },
    });

    const result = tickets.map(ticket => ({
        amount: ticket.amount,
        from : ticket.from_station,
        to : ticket.to_station,
        title : ticket.train.title,
        trainId: ticket.train.train_id,
        id: ticket.id,
        bookedSeats: ticket.seats,
        passengers: ticket.passengers,
    }));

    return NextResponse.json(result);
}
