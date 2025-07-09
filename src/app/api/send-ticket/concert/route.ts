import { NextRequest, NextResponse } from "next/server";
import { sendConcertTicket } from "@/lib/sendConcertTicket";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {

    try {
        const { ticketData, email } = await req.json();

        const user = await prisma.users.update({
            where:{id: ticketData.userId},
            data: { balance: { decrement: ticketData.amount } }
        })

        const vendor = await prisma.users.update({
            where:{id: ticketData.vendorId},
            data: { balance: { increment: ticketData.amount } }
        })

        await prisma.concert_shows.update({
            where:{id: ticketData.showId},
            data: {
                seats: { decrement: ticketData.noOfSeats }
            }
        })

        console.log("User", user.name);
        console.log("Vendor", vendor.name);

        const ticket = await prisma.concert_tickets.create({
                data: {
                    seats : ticketData.noOfSeats,
                    amount : ticketData.amount,
                    user: {
                        connect: {id: ticketData.userId}
                    },
                    concert_show: {
                        connect: {id: ticketData.showId}
                    }
                }
            })

        await sendConcertTicket(ticketData, email, ticket.id);
        return NextResponse.json({ success: true, id: ticket.id });
    } catch (err) {
        console.error("Error sending download-ticket:", err);
        return NextResponse.json({ error: "Failed to send download-ticket" }, { status: 500 });
    }
}
