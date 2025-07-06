import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params;
    const show = await prisma.shows.findUnique({ where: { id } });
    if (!show) {
        return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }
    return NextResponse.json({ seats: show.seats });
}