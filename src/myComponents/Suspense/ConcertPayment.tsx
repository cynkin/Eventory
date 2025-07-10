'use client'
import {useRouter, useSearchParams} from "next/navigation";
import {Dot, Plus, Minus} from "lucide-react";
import React, {useEffect, useState} from "react";
import {getConcert, getConcertShow, getUser} from "@/utils/getFromDb";
import {useSession} from "next-auth/react";

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function PaymentPage() {
    const { data: session, status, update } = useSession();
    const searchParams = useSearchParams();
    const showId = searchParams.get('showId');
    const concertId = searchParams.get('concertId');

    const [concert, setConcert] = useState<any>();
    const [show, setShow] = useState<any>();
    const [noOfSeats, setNoOfSeats] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        if(!concertId || !showId) return;


        const fetchConcert = async () => {
            const concert = await getConcert(concertId);
            const show = await getConcertShow(showId);
            setShow(show);
            setConcert(concert);
        };

        fetchConcert();

    }, [concertId, showId]);

    useEffect(() => {
        async function getBalance() {
            const user = await getUser(session?.user?.id || "");
            setBalance(user?.balance || 0);

            // await update({
            //     user:{
            //         balance: user?.balance || 0,
            //     }
            // })
        }
        if(session) getBalance();
    }, [session]);

    const handleSubmit = async () => {
        if(!noOfSeats) return;
        if(noOfSeats > show.seats) alert("Exceeds no. of available seats");
        if(!session || !session.user || !session.user.email || !session.user.balance) return;

        const amount = noOfSeats*concert.cost;
        if(balance < amount) {
            alert("Insufficient balance");
            return;
        }
        console.log("Submitting payment", balance);
        const ticketData = {
            image: concert.image,
            title: concert.title,
            date: show.date,
            time: show.time,
            location: show.location,
            amount,
            noOfSeats: noOfSeats,
            concertId: concertId,
            showId: showId,
            userId: session.user.id,
            vendorId: concert.vendor_id,
        }

        try {
            const res = await fetch("/api/send-ticket/concert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketData , email: session.user.email })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error("Ticket email failed", data.error);
            } else {
                console.log("Ticket sent successfully");
            }
        } catch (e) {
            console.error("Error sending download-ticket:", e);
        }

        // const newBalance = balance - amount;
        // await update({
        //     user:{
        //         balance: newBalance,
        //     }
        // })
        // console.log("Balance updated", newBalance, session.user.balance);
        router.push("/account/history")

    }
    const router = useRouter();

    return(
        <div className="xl:px-44 px-4 mt-10">
            {show && concert &&
                <div className="flex flex-row">
                    <div className="flex w-fit p-4 m-3 border border-gray-700 rounded-3xl items-center flex-col">
                        <img src={concert.image} alt="banner" className="w-fit  h-auto border-2 rounded-xl border-gray-300 p-2"/>
                        <div className="h-[1.5px] m-3 bg-gray-300 rounded-full relative w-full"></div>
                        <div className={"self-start text-2xl font-medium"}>{concert.title.toUpperCase()}</div>
                        <div className="flex self-start flex-col mt-1 space-x-2">
                            <div className="">{concert.ageRating}</div>
                            <div className="flex items-center space-x-3">
                                <div className="font-medium">{formatDate(show.date)}</div>
                                <Dot className=""/>
                                <div className="font-medium">{show.time}</div>
                            </div>
                            <div className="">{concert.languages.map((language:string, index:number)=>(
                                <span key={index}>{index !== 0 && " ,  "}{language}</span>
                            ))}
                            </div>
                            <div className="text-nowrap">
                                {concert.duration > 60 && `${Math.floor(concert.duration/60)} hours`}
                                {concert.duration%60 > 0 && ` ${concert.duration%60} minutes`}
                            </div>
                            <div className="font-medium">{show.location}</div>
                        </div>
                    </div>
                    <div className="w-fit h-fit py-3 px-4 m-3 border border-gray-700 rounded-xl items-center flex-col">
                        <div className="text-xl font-medium">Seat Options</div>
                        <div className="border-2 p-2 text-blue-900 flex justify-between text-lg mt-3 rounded-xl border-red-400">
                            <button className="cursor-pointer" onClick={() => setNoOfSeats(prev  =>{
                                if(prev > 0) return (prev - 1);
                                return prev;
                            } )}><Minus/></button>
                            <div>{noOfSeats}</div>
                            <button className="cursor-pointer" onClick={() => setNoOfSeats(prev => prev + 1)}><Plus/></button>
                        </div>
                    </div>
                    <div className="w-fit h-fit py-3 px-4 m-3 border border-gray-700 rounded-xl items-center flex-col">
                        <div className="text-xl font-medium">Payment Details</div>
                        <div>
                            <div className="mt-4">Seat Info</div>
                            <div className="flex px-2 justify-between font-bold">
                                <div>No. of Seats:</div>
                                <div>{noOfSeats}</div>
                            </div>

                            <div className="mt-3">Payment Total</div>
                            <div className="flex px-2 justify-between font-bold">
                                <div>Total</div>
                                <div>&#8377; {concert.cost * noOfSeats}</div>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-center w-full rounded-xl">
                            {noOfSeats > 0 &&
                                <button onClick={handleSubmit} className=" px-4 py-2 cursor-pointer rounded-full bg-[#1568e3] text-white hover:bg-[#0d4eaf]">
                                    Proceed to Payment
                                </button>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
