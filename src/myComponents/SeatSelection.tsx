'use client'
import React, {useEffect, useState} from "react";
import {useEventStore} from "@/stores/eventStore";
import {notFound, useRouter, useSearchParams} from "next/navigation";
import Spinner from "@/myComponents/UI/Spinner";
import socket from "@/lib/socket"
import { useSession} from "next-auth/react";
import {Dot} from "lucide-react";
import {getMovie, getTheatre} from "@/utils/getFromDb";


type Movie = {
    id: string;
    title: string;
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
    description: string;
    commission: number;
};

type Theatre = {
    location: string;
}

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function Page() {
    const router = useRouter();
    const SLOT = useEventStore.getState().slot;
    const slotId = SLOT?.showId
    const theatreId = SLOT?.theatreId;


    const { data: session, status, update } = useSession();
    const user = session?.user;
    const userId = user?.id;
    const email = user?.email;
    const balance = user?.balance;

    const [seatLayout, setLayout] = useState<any[][]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [movie, setMovie] = useState<Movie>();
    const [theatre, setTheatre] = useState<Theatre>();

    const searchParams = useSearchParams();
    const movieId = searchParams.get('movieId');

    useEffect(() => {
        if (status !== 'authenticated' || !userId || !slotId) return;

        socket.connect();
        console.log("Connected to server with ID:", socket.id);
        socket.emit("auth:user", userId);
        socket.emit("join-room", { slotId });

        const updateSeatStatus = (code: string, newStatus: "held" | "available") => {
            setLayout(prev =>
                prev?.map(row =>
                    row.map(seat =>
                        seat.code === code && seat.status !== "booked"
                            ? { ...seat, status: newStatus }
                            : seat
                    )
                )
            );
        };

        socket.on("seats:init-held", ({ slotId: incomingId, heldSeats }) => {
            if (slotId !== incomingId) return;
            setLayout(prev =>
                prev?.map(row =>
                    row.map(seat =>
                        heldSeats.includes(seat.code) ? { ...seat, status: "held" } : seat
                    )
                )
            );
        });

        socket.on("seat:locked", ({ code, slotId: incomingId }) => {
            if (slotId !== incomingId) return;
            updateSeatStatus(code, "held");
        });

        socket.on("seat:unlocked", ({ code, slotId: incomingId }) => {
            if (slotId !== incomingId) return;
            updateSeatStatus(code, "available");
        });

        socket.on("seat:booked", ({ code, slotId: incomingId }) => {
            if(slotId !== incomingId) return;

            setLayout(prev =>
                prev?.map(row =>
                    row.map(seat =>
                        seat.code === code
                            ? { ...seat, status: "booked" }
                            : seat
                    )
                )
            );
        })

        socket.on("seat:confirm:success", async ({ticketData}) => {
            if(!email) {
                console.log("No email found");
                console.log(ticketData);
                return;
            }
            try {
                const res = await fetch("/api/send-ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ticketData, email })
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    console.error("Ticket email failed", data.error);
                } else {
                    console.log("Ticket sent successfully");
                }
            } catch (e) {
                console.error("Error sending ticket:", e);
            }

            const newBalance = balance! - ticketData.amount;
            await update({
                user:{
                    balance: newBalance,
                }
            })
            router.push("/account/history")
        })

        socket.on("seat:confirm:error", ({ errors }) => {
            console.log("Booking failed:", errors);
        });

        
        return () => {
            socket.disconnect();
            socket.off("seat:locked");
            socket.off("seat:unlocked");
            socket.off("seat:booked");
            socket.off("seat:confirm:success");
            socket.off("seat:confirm:error");
            socket.off("seats:init-held");
        };
    }, [status, userId, slotId, router]);

    async function handleSubmit() {
        if(!user || !SLOT || !user.balance || !SLOT.cost) return;

        console.log("Submitting payment");

        const res = await fetch("/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                movieId,
                theatreId,
                amount
            })
        })

        if (!res.ok) {
            alert("Payment failed. Please try again.");
            return;
        }
        const data = await res.json();
        if (!data.success || !data.balance) {
            alert(data.message || "Booking could not be completed.");
            return;
        }

        console.log("Payment successful");
        socket.emit("seat:confirm", {slotId, selectedSeats, amount});
    }

    function select(row: number, col: number) {

        const currentSeat = seatLayout?.[row]?.[col];
        if (!currentSeat || currentSeat.status === "booked" || currentSeat.status === "held") return;

        const {code, status} = currentSeat;

        const isSelecting = status === "available";
        const isDeselecting = status === "select";


        if (isSelecting) {
            setSelectedSeats(prev => [...prev, code]);
            socket.emit("seat:select", {code, slotId});
        }
        else if (isDeselecting) {
            setSelectedSeats(prev => prev.filter(c => c !== code));
            socket.emit("seat:unselect", {code, slotId});
        }

        setLayout(prev =>
            prev?.map((r, i) =>
                r.map((s, j) =>
                    i === row && j === col
                        ? { ...s, status: isSelecting ? "select" : "available" }
                        : s
                )
            )
        );
    }

    const getSeatColor = (seat: any) => {
        if(seat.type === "disabled") return;

        if(seat.status === 'booked') return ('bg-gray-300')
        if(seat.status === 'held') return ('bg-gray-300')
        if(seat.status === 'select') return ('bg-blue-500 text-white')
        // const key = `${row}-${col}`;
        // if(lockedSeats.includes(key)) return ("bg-gray-300")
        // if (selected.some(seat => seat.row === row && seat.col === col)) return "bg-blue-500 text-white";

        switch (seat.type) {
            case "vip": return "border-2 border-yellow-500";
            case "disabled": return "";
            case "regular": return "border border-gray-500";
            default: return "bg-white";
        }
    };

    // useEffect(() => {
    //     if (!seatLayout || seatLayout.length === 0) return router.push("/booking?movieId=" + movieId)
    //     // do other checks here if needed
    // }, [movieId]);

    useEffect(() => {
        if(!movieId) return;
        if(!theatreId) return;

        const fetchMovie = async () => {
            const movie = await getMovie(movieId);
            setMovie(movie);
        };

        const fetchTheatre = async () => {
            const theatre = await getTheatre(theatreId);
            setTheatre(theatre);
        };

        const fetchLayout = async () => {
            if (!slotId) return;
            const res = await fetch(`/api/show-layout/${slotId}`);
            const data = await res.json();
            if (res.ok) {
                setLayout(data.seats);
            } else {
                console.error(data.error);
            }
        };

        fetchMovie();
        fetchTheatre();
        fetchLayout();

    }, [movieId, theatreId, slotId]);

    if(!movieId) notFound();
    if(!theatreId) notFound();
    if(!SLOT) notFound();
    if (!movie) return <Spinner />;
    if (!theatre) return <Spinner />;
    if(!user) notFound();

    if(!seatLayout){
        return (<Spinner/>)
    }

    if (!seatLayout.length || !seatLayout[0]?.length) return <Spinner />;
    const cols = seatLayout[0].length || 0;
    const amount = selectedSeats.length * SLOT?.cost;


    return(
        <div className="flex">
            <div className="flex flex-col justify-center items-center xl:px-44">
                <div className="text-3xl my-10 tracking-wider font-bold">Select Your Seats</div>
                <div className="flex items-center -ml-9 mt-5">
                    <div className="w-8"></div>
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
                        {Array.from({length:cols!}).map((_, i) =>(
                            <div key={i} className="select-none flex items-center justify-center font-bold w-7 h-7 text-gray-600 cursor-pointer">{i+1}</div>
                        ))}
                    </div>
                </div>
                <div>
                    {seatLayout.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-4">
                            {/* Row label */}
                            <div className="w-8 text-right pr-1 select-none cursor-pointer font-semibold text-gray-600">{String.fromCharCode(65 + rowIdx)}</div>

                            <div className="grid gap-1 my-1" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
                                {row.map((seat, colIdx) => {
                                    return (
                                        <div
                                            key={`${rowIdx}-${colIdx}`}
                                            className={`w-7 h-7 rounded-xs select-none cursor-pointer ${getSeatColor(seat)} flex items-center justify-center text-gray-700 text-[11px] font-medium`}
                                            onClick={() => select(rowIdx, colIdx)}
                                            // title={`Row ${rowIdx + 1}, Col ${colIdx + 1}`}
                                        >
                                            {seat.type !== 'disabled' && colIdx + 1}
                                        </div>
                                    )})}
                            </div>

                            <div className="w-8 text-left select-none cursor-pointer font-semibold text-gray-600">{String.fromCharCode(65 + rowIdx)}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center mt-6 gap-4">
                    <div className="w-6 h-6 rounded-xs select-none border border-gray-500 "></div>
                    <div className="text-sm font-medium text-gray-500">Available</div>
                    <div className="w-6 h-6 rounded-xs select-none bg-blue-500 "></div>
                    <div className="text-sm font-medium text-gray-500">Selected</div>
                    <div className="w-6 h-6 rounded-xs select-none bg-gray-300 "></div>
                    <div className="text-sm font-medium text-gray-500">Occupied</div>
                </div>
                <>
                    <svg
                        viewBox="0 0 800 100"
                        className="w-[800px] mt-15 h-[100px] scale-y-[-1] relative"
                        fill="none"
                        stroke="black"
                        strokeWidth="10"
                    >
                        <path d="M10,90 Q400,0 790,90" />
                    </svg>
                    <div className="relative font-bold bottom-22">SCREEN</div>
                </>
                {/*{selectedSeats.length > 0 &&*/}
                {/*    <button onClick={handleSubmit} className=" px-4 py-2 cursor-pointer rounded-full bg-[#1568e3] text-white hover:bg-[#0d4eaf]">*/}
                {/*        Proceed to Payment*/}
                {/*    </button>*/}
                {/*}*/}
            </div>
            <div className="flex mt-10 flex-col">
                <div className="flex py-3 px-4 m-3 border border-gray-700 rounded-3xl items-center flex-col">
                    <img src={movie.image} alt="banner" className="w-70 self-start h-auto border-2 rounded-xl border-gray-300 p-2"/>
                    <div className="h-[1.5px] m-3 bg-gray-300 rounded-full relative w-full"></div>
                    <div className={"self-start text-2xl font-medium"}>{movie.title.toUpperCase()}</div>
                    <div className="flex self-start flex-col mt-1 space-x-2">
                        <div className="">{movie.ageRating}</div>
                        <div className="flex items-center space-x-3">
                            <div className="font-medium">{SLOT?.language}</div>
                            <Dot className=""/>
                            <div className="font-medium">{formatDate(SLOT?.date)}</div>
                            <Dot className=""/>
                            <div className="font-medium">{SLOT?.time}</div>

                        </div>

                        <div className="text-nowrap">
                            {movie.duration > 60 && `${Math.floor(movie.duration/60)} hours`}
                            {movie.duration%60 > 0 && ` ${movie.duration%60} minutes`}
                        </div>

                        {/*<div className="text-nowrap">{movie.genres.join(", ")}</div>*/}
                        {theatre.location}
                    </div>
                </div>
                <div className=" py-3 px-4 m-3 border border-gray-700 rounded-xl items-center flex-col">
                    <div className="text-xl font-medium">Payment Details</div>
                    <div>
                        <div className="mt-4">Seat Info</div>
                        <div className="flex space-x-3">
                            {selectedSeats.map((code, index) => (
                                <div key={index} className=" font-medium p-1 text-white rounded-xl bg-yellow-500">{code}</div>
                            ))}
                        </div>
                        <div className="mt-3">Ticket Info</div>
                        <div className="flex px-2 justify-between font-bold">
                            <div>{selectedSeats.length} X {SLOT?.cost} </div>
                            <div>&#8377; {selectedSeats.length * SLOT?.cost}</div>
                        </div>

                        <div className="mt-3">Payment Total</div>
                        <div className="flex px-2 justify-between font-bold">
                            <div>Sub Total</div>
                            <div>&#8377; {selectedSeats.length * SLOT?.cost}</div>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-center w-full rounded-xl">
                        {selectedSeats.length > 0 &&
                            <button onClick={handleSubmit} className=" px-4 py-2 cursor-pointer rounded-full bg-[#1568e3] text-white hover:bg-[#0d4eaf]">
                                Proceed to Payment
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
