'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId, role} = await req.json();

    if(role === 'user') {
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
            language: ticket.show.language,
            booking_id: ticket.id,
            theatre_id: ticket.show.theatre_id,
            show_id: ticket.show.id,
        }));

        return NextResponse.json(result);
    }
    if(role === 'vendor') {
        console.log("------ VENDOR Incoming request - Movie Tickets");
        const movies = await prisma.movies.findMany({
            where: {vendor_id: userId},
            include: {
                theatres: true,
            },
        })

        const theatres = await prisma.theatres.findMany({
            where: {vendor_id: userId},
            include:{
                shows: true,
            }
        })

        movies.map(movie => {
            console.log("Movie", movie);
        })

        console.log("Theatres", theatres.length, theatres[0]);

        // const result = theatres.map(theatre => ({
        //
        // }))

        return NextResponse.json("");
    }
}

// pg_dump \
//   -Fc \
//   -v \
//   -d postgres://postgres:hibi9010@localhost:5432/ticketSystem \
//   -n public \
//   -f db_dump.bak


