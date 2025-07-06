import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req:NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session)  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    try{
        const contact = await prisma.contact.upsert({
            where:{id : session.user.id},
            update:{...data},
            create:{
                id: session.user.id,
                ...data}
        })
        return NextResponse.json(contact);
    }
    catch(error){
        console.log("Error updating contact", error);
        return NextResponse.json({error: "update contact details failed"}, {status : 500});
    }
}