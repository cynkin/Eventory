'use client'
import {useEffect, useState} from "react";
import Link from "next/link";

export default function MovieTickets() {

    const [concertTickets, setConcertTickets] = useState([]);
    const transactionId = '';
    useEffect(() => {
        const getConcertTickets = async () => {
            const res = await fetch("/api/tickets/getConcertTickets");
            if (res.ok) {
                setConcertTickets(await res.json());
            }
        }
        getConcertTickets();
    }, [])

    return(
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Transactions</div>
                <div className="text-3xl font-medium ml-6 pb-5">Concerts</div>
                <div className="flex flex-col">
                    <div className="flex mt-6 flex-row items-center flex-wrap">
                        {concertTickets && concertTickets.length > 0 &&
                            concertTickets.map((ticket:any, index:number) => (
                                <div key={index} className={`border-2 p-2 flex ${ticket.id === transactionId && 'bg-pink-50'} flex-col m-2 text-sm rounded-xl w-full border-pink-600 shadow-xs`}>
                                    <div className="flex relative flex-row">
                                        <div className="m-2 w-[411px] h-[167px] ">
                                            <img alt="" className=" rounded-xl scale-100 h-full w-auto overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                 src={ticket.concert_show.concert.image}  />
                                        </div>
                                        <div className="my-2 mx-2">
                                            <div className=" my-1 font-medium text-xl">{ticket.concert_show.concert.title}</div>
                                            <div className="ml-1  mb-1 text-nowrap">
                                                <div className="flex">
                                                    Seats Purchased:
                                                    <div className=" ml-1 font-medium">{ticket.seats}</div>
                                                </div>
                                                <div className="flex">
                                                    Transaction ID:
                                                    <div className=" ml-1 font-medium">{ticket.id}</div>
                                                </div>
                                                <div className="flex">
                                                    Transaction Amount:
                                                    <div className=" ml-1 font-medium">{ticket.amount}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    Status :
                                                    <div className={` ml-1 font-bold text-lg ${ticket.status === 'cancelled' ? 'text-red-500' : 'text-green-500'}`}>
                                                        {ticket.status.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <Link href={`/?q=users&id=${ticket.concert_show.concert.vendor_id}`} className="absolute top-1/4 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Vendor ID: {ticket.concert_show.concert.vendor_id}</Link>
                                        <Link href={`/?q=concerts&id=${ticket.concert_show.concert_id}`} className="absolute bottom-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Concert ID: {ticket.concert_show.concert_id}</Link>
                                        <Link href={`/?q=concertShows&id=${ticket.concert_show_id}`} className="absolute top-1/2 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Show ID: {ticket.concert_show_id}</Link>
                                        <Link href={`/?q=users&id=${ticket.user_id}`} className="absolute top-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">User ID: {ticket.user_id}</Link>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}