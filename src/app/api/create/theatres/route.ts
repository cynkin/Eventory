import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
// import {checkMovieConflict} from "@/lib/conflict";

// export function normalizeString(input: string) {
//     return input.toLowerCase().replace(/\s+/g, "").trim();
// }

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)
    const vendor_id = session?.user?.id;

    console.log("------ Incoming request - Theatre");
    console.log("------ Vendor ", session!.user.name);

    if (!vendor_id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const data = await req.json();
        console.log("This is THEATRE data", data);

        const theatre = await prisma.theatres.create({
            data: {
                location: data.location,
                seatLayout: data.seatLayout.layout,
                movie: {
                    connect: {id: data.movieId}
                },
                vendor : {
                    connect: {id: vendor_id}
                }
            }
        })
        return NextResponse.json({success: true, id: theatre.id});
    }catch(err : any){
        console.log(err);
        return NextResponse.json({success:false, error: err.message || "Unknown error"})
    }
}
