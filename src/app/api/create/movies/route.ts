import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
// import {checkMovieConflict} from "@/lib/conflict";

const prisma = new PrismaClient();

// export function normalizeString(input: string) {
//     return input.toLowerCase().replace(/\s+/g, "").trim();
// }

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)
    const vendor_id = session?.user?.id;

    console.log("------ Incoming request - Movie");
    console.log("------ Vendor ", session!.user.name);

    if (!vendor_id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const vendor = await prisma.users.findUnique({
        where: { id: vendor_id }
    });

    if (!vendor) {
        return NextResponse.json({ error: "Vendor not found in DB" }, { status: 400 });
    }

    try {
        const data = await req.json();
        console.log("This is also data", data);

        const movie = await prisma.movies.create({
            data: {
                title: data.title.trim(),
                description: data.description,
                ageRating: data.ageRating,
                duration: data.duration,
                genres: data.genres,
                image: data.image,
                commission:data.commission,

                vendor: {
                    connect: {id: vendor_id}
                }
            }
        })
        return NextResponse.json({success: true, id: movie.id});
    }catch(err : any){
        console.log(err);
        return NextResponse.json({success:false, error: err.message || "Unknown error"})
    }
}
