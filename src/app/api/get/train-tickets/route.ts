'use server'
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const {userId, role} = await req.json();

    if(role === 'user') {
        const tickets = await prisma.train_tickets.findMany({
            where: {user_id: userId},
            include: {
                train: true
            },
        });

        const result = tickets.map(ticket => ({
            amount: ticket.amount,
            from: ticket.from_station,
            to: ticket.to_station,
            title: ticket.train.title,
            trainId: ticket.train.train_id,
            id: ticket.id,
            bookedSeats: ticket.seats,
            passengers: ticket.passengers,
        }));

        return NextResponse.json(result);
    }
    if(role === 'vendor'){
        const trains = await prisma.trains.findMany({
            where:{vendor_id: userId},
            include:{
                train_tickets: true
            }
        })

        const result = trains.map(train =>{

            const stations = train.stations;

            const start = stations[0];
            const end = stations[stations.length - 1];

            // const from = start.location.substring(0, start.location.indexOf("-"));
            // const to = end.location.substring(0, end.location.indexOf("-"));

            const startDateTime = new Date(`${start.date}T${start.time}`);
            const endDateTime = new Date(`${end.date}T${end.time}`);

            const msDiff = endDateTime.getTime() - startDateTime.getTime();
            const totalMinutes = Math.floor(msDiff / 1000 / 60);
            const days = Math.floor(totalMinutes / (60 * 24));
            const hours = Math.floor((totalMinutes %(60*24)/60));
            const minutes = totalMinutes % 60;
            let duration = "";
            if (days > 0) duration += `${days}d `;
            if (hours > 0 || days > 0) duration += `${hours}h `;
            if (minutes > 0 || (days === 0 && hours === 0)) duration += `${minutes}m`
            duration = duration.trim();

            return {
                title: train.title,
                number: train.train_id,
                from: start,
                to: end,
                duration: duration,
            }

        })
        return NextResponse.json(result);
    }
}
