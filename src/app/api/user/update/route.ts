import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, role } = await req.json();

    try {
        const updatedUser = await prisma.users.update({
            where: {id: session.user.id},
            data: {
                ...(name && {name}),
                ...(role && {role}),
            },
        });

        return NextResponse.json({success: true, updatedUser});
    }
    catch (error) {
            console.error("Error updating user:", error);
            return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}