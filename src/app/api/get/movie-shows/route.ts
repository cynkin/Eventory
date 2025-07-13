'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {

    const shows = await prisma.shows.findMany({
        include: {
            movie: true,
            theatre: true,
        },
        orderBy:[
            {movie: {title : 'asc'}},
            // {theatre: {location: 'asc'}},
            {date: 'asc'},
            {time: 'asc'}
        ]
    })
    return NextResponse.json(shows);
}