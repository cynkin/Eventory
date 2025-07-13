import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
       const {user_id, action} = await req.json();
    try {
        if(action !== 'suspended') {
            await prisma.users.update({
                where: {id: user_id},
                data: {
                    google_id: 'suspended'
                },
            });
        }
        else{
            await prisma.users.update({
                where: {id: user_id},
                data: {
                    google_id: 'old'
                },
            });
        }

        return NextResponse.json({success: true,});
    }
    catch (error) {
        alert(`"Error suspending user: ${error}`);
        return NextResponse.json({ error: "Failed to suspend user" }, { status: 500 });
    }
}