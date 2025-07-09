import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {useEventStore} from "@/stores/eventStore";
// import {checkMovieConflict} from "@/lib/conflict";

// export function normalizeString(input: string) {
//     return input.toLowerCase().replace(/\s+/g, "").trim();
// }

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)
    const vendor_id = session?.user?.id;
    console.log("------ Incoming request - Movie");
    console.log("------ Vendor ", session!.user.name);

    if (!vendor_id) {
        return NextResponse.json({error: "Not authenticated"}, {status: 401});
    }

    const body = await req.json();
    console.log("This is body", body);

    const {details, theatreId, movieId} = body;
    console.log("Details\n", details,
        "TheatreId:\n", theatreId,
        "MovieId\n", movieId);

    const theatre = await prisma.theatres.findUnique({where:{id:theatreId}});
    if(!theatre) return NextResponse.json({success: false});
    const seatLayout = theatre.seatLayout;
    console.log("Seats\n", seatLayout);

    try {
        const data = details;
        for (let i = 0; i < data.length; i++) {
            const show_data = data[i];

            for(const slot of show_data.slots){

                const show = await prisma.shows.create({
                    data: {
                        date: show_data.date,
                        time: slot.time,
                        language:slot.language,
                        seats : seatLayout!,
                        cost: show_data.cost,
                        premium_cost: show_data.premiumCost,

                        theatre: {
                            connect: {id: theatreId}
                        },
                        movie: {
                            connect: {id: movieId}
                        }
                    }
                })
                console.log("Show created", show.id);
            }

        }
        return NextResponse.json({success: true});
    } catch (err:any) {
        console.log(err);
        return NextResponse.json({success: false, error: err.message || "Unknown error"})
    }
}

