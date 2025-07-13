import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(req: NextRequest) {
    const {user_id} = await req.json();
    try {
            await prisma.users.delete({
                where: {id: user_id},
            });
        return NextResponse.json({success: true,});
    }
    catch (error) {
        alert(`"Error suspending user: ${error}`);
        return NextResponse.json({ error: "Failed to suspend user" }, { status: 500 });
    }
}