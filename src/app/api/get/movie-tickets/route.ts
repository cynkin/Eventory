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

        let movies;
        if(userId === "admin"){
            movies = await prisma.movies.findMany({
                include: {
                    theatres: {
                        include: {
                            shows: true,
                        }
                    },
                },
            })
        }
        else{
            movies =  await prisma.movies.findMany({
                where: {vendor_id: userId},
                include: {
                    theatres: {
                        include: {
                            shows: true,
                        }
                    },
                },
            })
        }

        let size =0;
        const result = movies.map(movie => {
            const theatreData = movie.theatres.map(theatre => {
                size++;
                const grouped: { date: string; details: { time: string; language: string }[] }[] = [];
                for (const show of theatre.shows) {
                    let group = grouped.find(g => g.date === show.date);
                    if (!group) {
                        group = { date: show.date, details: [] };
                        grouped.push(group);
                    }
                    group.details.push({ time: show.time, language: show.language });
                }

                return {
                    location: theatre.location,
                    shows: grouped,
                };
            });
            return{
                movie: movie,
                theatres: theatreData,
            }
        })


        if(userId === "admin") return NextResponse.json(result);

        const theatres = await prisma.theatres.findMany({
            where: {vendor_id: userId},
            include: {
                movie: true,
                shows: true,
            }
        })

        if(theatres.length === size) return NextResponse.json(result);

        const movieMap = new Map<string, {
            movie: typeof theatres[0]['movie'],
            theatres: {
                location: string,
                shows: { date: string, details: { time: string, language: string }[] }[]
            }[]
        }>();

        for (const theatre of theatres) {
            const movieId = theatre.movie.id;

            const grouped = [] as { date: string, details: { time: string, language: string }[] }[];

            for (const show of theatre.shows) {
                let group = grouped.find(g => g.date === show.date);

                if (!group) {
                    group = {
                        date: show.date,
                        details: [],
                    }
                    grouped.push(group);
                }
                group.details.push({time: show.time, language: show.language})
            }

            if (!movieMap.has(movieId)) {
                movieMap.set(movieId, {
                    movie: theatre.movie,
                    theatres: [],
                })
            }

            movieMap.get(movieId)!.theatres.push({
                location: theatre.location,
                shows: grouped,
            });
        }

        const value = Array.from(movieMap.values());
        return NextResponse.json(value);
    }
}

