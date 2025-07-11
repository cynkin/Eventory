import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Seat = {
    code: string;
    type: string;
    status: string;
};

type Compartment = {
    compartment: number;
    seats: Seat[][];
};


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

                prisma.tickets.update({
                    where: {id: data.booking_id},
                    data: {status: "cancelled"}
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
            console.error("Cancel download-ticket error:", err);
            return NextResponse.json({success: false, error: "Something went wrong"}, {status: 500});
        }
    }
    if(data.concert) {
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
        console.error("Cancel download-ticket error:", err);
        return NextResponse.json({success: false, error: "Something went wrong"}, {status: 500});
        }
    }
    // {
    //     amount: 600,
    //         from: {
    //     cost: 0,
    //         date: '2025-07-08',
    //         time: '10:00',
    //         location: 'KANYAKUMARI - CAPE'
    // },
    //     to: {
    //         cost: 300,
    //             date: '2025-07-11',
    //             time: '18:00',
    //             location: 'Kolar - KQZ'
    //     },
    //     title: 'Vandhe Bharath',
    //         trainId: 18974,
    //     id: '95f1969b-3dd9-48fb-b846-4238909abc43',
    //     bookedSeats: [ 'A 1', 'A 2' ],
    //     passengers: [
    //     { age: 53, name: 'Vijaya Baskar M', gender: 'Male' },
    //     { age: 48, name: 'Deepa B', gender: 'Female' }
    // ]
    // }
    if(data.passengers) {
        console.log(data);
        try {
            const ticket = await prisma.train_tickets.findUnique({
                where: {id: data.id}
            })
            if (!ticket) {
                return NextResponse.json({success: false, error: "Ticket not found"}, {status: 404});
            }

            const train = await prisma.trains.findUnique({
                where: {id: ticket.train_id}
            })
            if (!train) return NextResponse.json({success: false, error: "Train not found"});


            const refundAmt = ticket.amount;

            const user = await prisma.users.findUnique({
                where: {id: ticket.user_id},
            })
            const vendor = await prisma.users.findUnique({
                where: {id: train.vendor_id}
            })

            if (!user || !vendor) {
                return NextResponse.json({success: false, error: "User or vendor not found"}, {status: 404});
            }

            const codes = ticket.seats;
            const seatLayout = train.seatLayout as Compartment[];
            const compartment = seatLayout.find(c => c.compartment === 1);

            if (!compartment) {
                return NextResponse.json({ success: false, error: "Compartment not found" });
            }

            const updatedSeats = compartment.seats.map(row =>
                row.map(seat =>
                    codes.includes(seat.code) ? {...seat, status: "available"} : seat
                )
            );

            const updatedLayout = seatLayout.map(c =>
                c.compartment === 1
                    ? { ...c, seats: updatedSeats }
                    : c
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

                prisma.train_tickets.delete({
                    where: {id: ticket.id}
                }),

                prisma.trains.update({
                    where: {id: train.id},
                    data: {seatLayout: updatedLayout}
                }),
            ]);

            return NextResponse.json({
                success: true,
                message: "Ticket cancelled and amount refunded",
                refund: refundAmt
            });

        } catch (err) {
            console.error("Cancel download-ticket error:", err);
            return NextResponse.json({success: false, error: "Something went wrong"}, {status: 500});
        }
    }
}