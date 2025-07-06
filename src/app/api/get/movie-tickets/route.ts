'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId} = await req.json();

    const tickets = await prisma.tickets.findMany({
        where: {user_id: userId},
        include: {
            show: {
                include: {
                    movie: true,
                    theatre: true,
                },
            },
        },
    });

    const result = tickets.map(ticket => ({
        amount: ticket.amount,
        seats: ticket.seats,
        time: ticket.show.time,
        date: ticket.show.date,
        location: ticket.show.theatre.location,
        movie: ticket.show.movie,
        language:ticket.show.language,
        booking_id: ticket.id,
        theatre_id : ticket.show.theatre_id,
        show_id: ticket.show.id,
    }));

    return NextResponse.json(result);
}
