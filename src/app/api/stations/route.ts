import { PrismaClient } from '@prisma/client';
import {NextRequest, NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase() ?? "";

    if(!q) return NextResponse.json({success:false, error: "Invalid query"});

    const stations = await prisma.stations.findMany({
        where:{
            OR:[
                {name: {startsWith: q, mode:'insensitive'}},
                {code: {startsWith: q, mode:'insensitive'}}
            ],
        },
        take:6,
    });

    return NextResponse.json({success:true, stations});
}