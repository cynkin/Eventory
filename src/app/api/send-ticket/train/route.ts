import { NextRequest, NextResponse } from "next/server";
import { sendTrainTicket } from "@/lib/sendTrainTicket";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {

    try {
        const { ticketData, email } = await req.json();
        console.log("Ticket data", ticketData);

        console.log("Ticket data Seats", ticketData.seats);
        const bookedSeats = [];
        for(const compartment of ticketData.seats){
            for(const row of compartment.seats){
                for(const seat of row){
                    if(seat.status === "available"){
                        seat.status = "booked";
                        bookedSeats.push(seat.code);
                        if(bookedSeats.length === ticketData.noOfSeats){
                            break;
                        }
                    }
                }
                if(bookedSeats.length === ticketData.noOfSeats){
                    break;
                }
            }
            if(bookedSeats.length === ticketData.noOfSeats){
                break;
            }
        }

        if(!bookedSeats){
            console.log("Some error");
            return NextResponse.json({ error: "Some error" }, { status: 500 });
        }

        if(bookedSeats.length !== ticketData.noOfSeats){
            return NextResponse.json({ error: "Seats not available" }, { status: 500 });
        }

        const train = await prisma.trains.update({
            where:{id: ticketData.id},
            data: {seatLayout: ticketData.seats}
        })


        const user = await prisma.users.update({
            where:{id: ticketData.userId},
            data: { balance: { decrement: ticketData.amount } }
        })

        const vendor = await prisma.users.update({
            where:{id: ticketData.vendorId},
            data: { balance: { increment: ticketData.amount } }
        })

        console.log("User", user.name);
        console.log("Vendor", vendor.name);

        const ticket = await prisma.train_tickets.create({
            data: {
                amount : ticketData.amount,
                seats : bookedSeats,
                passengers : ticketData.passengers,
                from_station : ticketData.from,
                to_station: ticketData.to,
                user:{
                    connect : {id: ticketData.userId},
                },
                train :{
                    connect : {id: ticketData.id},
                }
            }
        })

        await sendTrainTicket(ticketData, email, ticket.id, bookedSeats);
        return NextResponse.json({ success: true, id: ticket.id });
    } catch (err) {
        console.error("Error sending ticket:", err);
        return NextResponse.json({ error: "Failed to send ticket" }, { status: 500 });
    }
}
