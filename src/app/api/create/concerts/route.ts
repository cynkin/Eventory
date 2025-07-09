import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function POST(req:NextRequest) {
    console.log("------ Incoming request - Concert");
    const session = await getServerSession(authOptions)
    const vendor_id = session?.user?.id;

    if (!vendor_id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const data = await req.json();
        console.log(data, data.details, data.seats);

        data.details.sort((a,b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        })

        const concert = await prisma.concerts.create({
            data: {
                title: data.title.trim(),
                description: data.description,
                ageRating: data.ageRating,
                seats:data.seats,
                genres: data.genres,
                languages: data.languages,
                cost: data.cost,
                duration:data.duration,
                image: data.image,
                start_date: data.details[0].date,
                end_date: data.details[data.details.length-1].date,
                vendor: {
                    connect: {id: vendor_id}
                }
            }
        })

        for(const detail of data.details){
            const show = await prisma.concert_shows.create({
                data:{
                    date: detail.date,
                    time: detail.time,
                    seats: data.seats,
                    location: detail.location,
                    concert : {
                        connect : {id: concert.id}
                    }
                }
            })
        }

        return NextResponse.json({success: true, });
    }catch(err : any){
        console.log(err);
        return NextResponse.json({success:false, error: err.message || "Unknown error"})
    }
}
