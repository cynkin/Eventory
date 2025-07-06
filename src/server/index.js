'use server';
import { Server } from "socket.io";
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();
import 'dotenv/config';
const io = new Server(4000, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

const heldSeatsBySlot = new Map();
const seatsHeldBySocket = new Map();

const HOLD_DURATION = 30 * 1000;

function findSeatIndex(layout, code) {
    for (let i = 0; i < layout.length; i++) {
        for (let j = 0; j < layout[i].length; j++) {
            if (layout[i][j].code === code) {
                return { rowIndex: i, seatIndex: j };
            }
        }
    }
    return { rowIndex: -1, seatIndex: -1 };
}

io.on("connection", async (socket) => {
    console.log("Connected:", socket.id);
    console.log("Total clients:", io.engine.clientsCount);

    socket.on("auth:user", (userId) => {
        socket.data.userId = userId;
        console.log("User:", userId);
    });

    socket.on("join-room", async({slotId}) => {
        socket.join(slotId);

        const heldMap = heldSeatsBySlot.get(slotId) || new Map();
        const heldSeats = Array.from(heldMap.keys());
        socket.emit("seats:init-held", {slotId, heldSeats});

    })

    socket.on("seat:select", ({code, slotId}) => {
        const userId = socket.data.userId;
        console.log(userId);
        if(!userId) return;

        if(!heldSeatsBySlot.has(slotId)) heldSeatsBySlot.set(slotId, new Map())
        const slotMap = heldSeatsBySlot.get(slotId);

        if(slotMap.has(code)) return;

        const timeout = setTimeout(() => {
            slotMap.delete(code);
            io.to(slotId).emit("seat:unlocked", {code, slotId});
        }, HOLD_DURATION);

        slotMap.set(code, {userId, timeout});

        if (!seatsHeldBySocket.has(socket.id)) seatsHeldBySocket.set(socket.id, []);
        seatsHeldBySocket.get(socket.id).push({ slotId, seatCode: code });

        socket.to(slotId).emit("seat:locked", {code, slotId});
    })

    socket.on("seat:unselect", ({code, slotId}) => {
        const slotMap = heldSeatsBySlot.get(slotId);
        const entry = slotMap.get(code);

        if(entry?.timeout) clearTimeout(entry.timeout);
        slotMap.delete(code);

        const socketSeats = seatsHeldBySocket.get(socket.id);
        if(socketSeats) {
            seatsHeldBySocket.set(
                socket.id,
                socketSeats.filter(seat => !(seat.slotId === slotId && seat.seatCode === code))
            );
        }

        socket.to(slotId).emit("seat:unlocked", {code, slotId});
    });

    socket.on("seat:confirm", async ({slotId, amount, selectedSeats: seats}) => {
        const userId = socket.data.userId;
        if(!userId || !seats.length) return;
        console.log("Confirming Seats")
        const show = await prisma.shows.findUnique({
            where: {id: slotId}
        })
        if(!show) socket.emit("error", { errors: ["Show not found"] });

        const showSeats = show.seats;
        const errors = [];

        for(const code of seats) {
            const { rowIndex, seatIndex } = findSeatIndex(showSeats, code);
            if(rowIndex === -1 || seatIndex === -1) {
                errors.push(`Seat ${code} not found`);
                continue;
            }

            const seat = showSeats[rowIndex][seatIndex];
            if(seat.status === "booked"){
                errors.push(`Seat ${code} is already booked`);
                continue;
            }

            const entry = heldSeatsBySlot.get(slotId)?.get(code);
            if(!entry || entry.userId !== userId) {
                errors.push(`Seat ${code} is not yours`);
                continue;
            }

            showSeats[rowIndex][seatIndex].status = "booked";

            clearTimeout(entry.timeout);
            heldSeatsBySlot.get(slotId).delete(code);
        }

        await prisma.shows.update({
            where: {id: slotId},
            data: {seats: showSeats}
        })

        const heldList = seatsHeldBySocket.get(socket.id) || [];
        seatsHeldBySocket.set(
            socket.id,
            heldList.filter(seat => !seats.includes(seat.seatCode))
        );

        for (const code of seats) {
            if (!errors.some(e => e.includes(code))) {
                io.to(slotId).emit("seat:booked", { code, slotId });
            }
        }

        let ticket;
        try {
            ticket = await prisma.tickets.create({
                data: {
                    seats,
                    amount,
                    user: {
                        connect: {id: userId}
                    },
                    show: {
                        connect: {id: slotId}
                    }
                }
            })
        }
        catch(e) {
            console.log(e);
            errors.push("Error booking tickets");
        }

        if (errors.length > 0) {
            ///send_mail({amount, seats, time:show.time, date:show.date, language:show.language, booking_id:ticket.id, });
            socket.emit("seat:confirm:error", { errors });
        } else {
            const theatre = await prisma.theatres.findUnique({where:{id:show.theatre_id}});
            const movie = await prisma.movies.findUnique({where:{id:show.movie_id}})
            if (!theatre || !movie) {
                errors.push("Movie or Theatre not found");
                socket.emit("seat:confirm:error", { errors });
            } else {
                const user = await prisma.users.findUnique({ where: { id: userId } });
                if (!user || !user.email) {
                    errors.push("User email not found");
                    socket.emit("seat:confirm:error", { errors });
                } else {
                    const ticketData = {
                        amount,
                        seats,
                        time: show.time,
                        date: show.date,
                        language: show.language,
                        booking_id: ticket.id,
                        location: theatre.location,
                        movie: {
                            title: movie.title,
                            image: movie.image,
                            ageRating: movie.ageRating,
                        },
                    };

                    try {
                        socket.emit("seat:confirm:success", { success: true, ticketData });
                    } catch (e) {
                        console.error("Email error:", e);
                        socket.emit("seat:confirm:error", { errors: ["Failed to send ticket email"] });
                    }
                }
            }
        }
    })

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
        console.log("Remaining clients:", io.engine.clientsCount);

        const socketSeats = seatsHeldBySocket.get(socket.id);
        if(socketSeats) {
            for (const { slotId, seatCode } of socketSeats) {
                const slotMap = heldSeatsBySlot.get(slotId);
                const entry = slotMap.get(seatCode);

                if(entry?.timeout) clearTimeout(entry.timeout);
                slotMap.delete(seatCode);
                io.to(slotId).emit("seat:unlocked", {code: seatCode, slotId});
            }
            seatsHeldBySocket.delete(socket.id);
        }
    });
});

