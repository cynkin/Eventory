import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {checkTrainConflict} from "@/lib/conflict";

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions)
    const vendor_id = session?.user?.id;

    if (!vendor_id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const data = await req.json();

        if(!await checkTrainConflict(data, prisma)){
            return NextResponse.json({success: false, error: "Date Conflict"})
        }

        const seatLayout = [];
        for(let i = 0; i < data.compartments; i++){
            seatLayout.push({
                compartment: i+1,
                seats: data.seatLayout.layout
            })
        }

        const train = await prisma.trains.create({
            data: {
                title: data.title,
                train_id : data.trainId,
                compartments: data.compartments,
                stations: data.stations,
                additional: data.additional,
                seatLayout: seatLayout,
                vendor: {
                    connect: {id: vendor_id}
                }
            }
        })
        return NextResponse.json({success: true, train});
    }catch(err){
        console.log(err);
        return NextResponse.json({success:false, error:"Failed to register train"})
    }
}
