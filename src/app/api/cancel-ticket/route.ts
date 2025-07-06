import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    const data = await req.json();

    if(data.movie) {
        try {
            const ticket = await prisma.tickets.findUnique({
                where: {id: data.booking_id}
            })
            if (!ticket) {
                return NextResponse.json({success: false, error: "Ticket not found"}, {status: 404});
            }

            const theatre = await prisma.theatres.findUnique({
                where: {id: data.theatre_id}
            })
            if (!theatre) return NextResponse.json({success: false, error: "Theatre not found"});

            const show = await prisma.shows.findUnique({
                where: {id: data.show_id}
            })
            if (!show) return NextResponse.json({success: false, error: "Show not found"});

            const refundAmt = (100 - data.movie.commission) * data.seats.length;

            const user = await prisma.users.findUnique({
                where: {id: ticket.user_id},
            })
            const vendor = await prisma.users.findUnique({
                where: {id: theatre.vendor_id}
            })

            if (!user || !vendor) {
                return NextResponse.json({success: false, error: "User or vendor not found"}, {status: 404});
            }

            const codes = data.seats;
            console.log("Codes", codes);
            const seatLayout = show.seats as any[][];
            const updatedSeats = seatLayout.map(row =>
                row.map(seat =>
                    codes.includes(seat.code) ? {...seat, status: "available"} : seat
                )
            );

            await prisma.$transaction([

                prisma.users.update({
                    where: {id: user.id},
                    data: {balance: {increment: refundAmt}}
                }),

                prisma.users.update({
                    where: {id: vendor.id},
                    data: {balance: {decrement: refundAmt}}
                }),

                prisma.tickets.delete({
                    where: {id: data.booking_id}
                }),

                prisma.shows.update({
                    where: {id: show.id},
                    data: {seats: updatedSeats}
                }),
            ]);

            return NextResponse.json({
                success: true,
                message: "Ticket cancelled and amount refunded",
                refund: refundAmt
            });

        } catch (err) {
            console.error("Cancel ticket error:", err);
            return NextResponse.json({success: false, error: "Something went wrong"}, {status: 500});
        }
    }
    else{
        console.log(data);
        try {
            const ticket = await prisma.concert_tickets.findUnique({
                where: {id: data.id}
            })
            if (!ticket) {
                return NextResponse.json({success: false, error: "Ticket not found"}, {status: 404});
            }

            const show = await prisma.concert_shows.findUnique({
                where: {id: data.showId}
            })
            if (!show) return NextResponse.json({success: false, error: "Show not found"});

            const user = await prisma.users.findUnique({
                where:{id: ticket.user_id}
            })

            const vendor = await prisma.users.findUnique({
                where: {id: data.concert.vendor_id}
            })

            if (!user || !vendor) {
                return NextResponse.json({success: false, error: "User or vendor not found"}, {status: 404});
            }

            await prisma.$transaction([

                prisma.users.update({
                    where: {id: user.id},
                    data: {balance: {increment: data.amount}}
                }),

                prisma.users.update({
                    where: {id: vendor.id},
                    data: {balance: {decrement: data.amount}}
                }),

                prisma.concert_tickets.delete({
                    where: {id: data.id}
                }),

                prisma.concert_shows.update({
                    where: {id: data.showId},
                    data: {seats: {increment: data.seats}}
                }),
            ]);

            return NextResponse.json({
                success: true,
                message: "Ticket cancelled and amount refunded",
                refund: data.amount
            });
    }
    catch(err){
        console.error("Cancel ticket error:", err);
        return NextResponse.json({success: false, error: "Something went wrong"}, {status: 500});
        }
    }
}