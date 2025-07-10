'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {

        const users = await prisma.users.findMany();
        console.log("Users", users);
        return NextResponse.json(users);

    } catch (error) {

        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });

    }
}