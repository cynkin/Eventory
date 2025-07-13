'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {

    const shows = await prisma.concert_shows.findMany({
        include: {
            concert: true,
        },
        orderBy:[
            {concert: {title : 'asc'}},
            // {theatre: {location: 'asc'}},
            {date: 'asc'},
            {time: 'asc'}
        ]
    })
    return NextResponse.json(shows);
}