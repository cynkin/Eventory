'use client'
import {useEffect, useState} from "react";
import Link from "next/link";

export default function MovieTickets() {

    const [movieTickets, setMovieTickets] = useState([]);
    const userId = '';
    useEffect(() => {
        const getMovieTickets = async () => {
            const res = await fetch("/api/tickets/getMovieTickets");
            if (res.ok) {
                setMovieTickets(await res.json());
            }
        }
        getMovieTickets();
    }, [])

    return(
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Transactions</div>
                <div className="text-3xl font-medium ml-6 pb-5">Movies</div>
                <div className="flex flex-col">
                    <div className="flex mt-6 flex-row items-center flex-wrap">
                        {movieTickets && movieTickets.length > 0 &&
                            movieTickets.map((ticket:any, index:number) => (
                                <div key={index} className={`border-2 p-2 flex ${ticket.show.movie.vendor_id === userId && 'bg-pink-50'} flex-col m-2 text-sm rounded-xl w-full border-pink-600 shadow-xs`}>
                                    <div className="flex relative flex-row">
                                        <div className="m-2 w-[411px] h-[167px] ">
                                            <img alt="" className=" rounded-xl scale-100 h-full w-auto overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                 src={ticket.show.movie.image}  />
                                        </div>
                                        <div className="my-2 mx-2">
                                            <div className=" my-1 font-medium text-xl">{ticket.show.movie.title}</div>
                                            <div className="ml-1  mb-1 text-nowrap">
                                                <div className="flex">{ticket.seats.map((seat:string, index:number) => (
                                                    <div className="bg-red-300 rounded-xl m-1 p-2" key={index}>{seat}</div>
                                                ))}</div>
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
                                        <Link href={`/?q=users&id=${ticket.show.movie.vendor_id}`} className="absolute top-1/4 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Vendor ID: {ticket.show.movie.vendor_id}</Link>
                                        <Link href={`/?q=movies&id=${ticket.show.movie.id}`} className="absolute bottom-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Movie ID: {ticket.show.movie.id}</Link>
                                        <Link href={`/?q=movieShows&id=${ticket.show.id}`} className="absolute top-1/2 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Show ID: {ticket.show.id}</Link>
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