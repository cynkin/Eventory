'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId} = await req.json();

    const tickets = await prisma.concert_tickets.findMany({
        where: {user_id: userId},
        include: {
            concert_show: {
                include: {
                    concert: true,
                }
            }
            },
    });

    const result = tickets.map(ticket => ({
        id: ticket.id,
        amount: ticket.amount,
        seats: ticket.seats,
        time: ticket.concert_show.time,
        date: ticket.concert_show.date,
        location: ticket.concert_show.location,
        concert: ticket.concert_show.concert,
        noOfSeats: ticket.seats,
        image: ticket.concert_show.concert.image,
        title: ticket.concert_show.concert.title,
        cost: ticket.concert_show.concert.cost,
        concertId: ticket.concert_show.concert.id,
        showId: ticket.concert_show.id
    }));

    return NextResponse.json(result);
}
