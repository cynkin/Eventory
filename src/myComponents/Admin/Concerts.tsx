'use client'
import {useEffect, useState } from "react";

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

function to12(time24:string) {
    return new Date(`1970-01-01T${time24}:00`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export default function Concerts() {
    const [concertTickets, setConcertTickets] = useState<any[]>([]);
    const [concertShow, setConcertShow] = useState<any>({
        show: null,
        id: null,
    })

    useEffect(() => {
        const fetchConcertTickets = async () => {
            const res = await fetch(`/api/get/concert-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId:'admin', role:'vendor'})
                })
            const data = await res.json();
            setConcertTickets(data);
        };
        fetchConcertTickets();
    }, [])

    return(
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Events</div>
                <div className="text-3xl font-medium ml-6 pb-5">Concerts</div>
                <div className="flex flex-col">
                    <div className="flex mt-6 flex-row items-center flex-wrap">
                        {concertTickets && concertTickets.length > 0 &&
                        concertTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 flex flex-col m-2 text-sm rounded-xl w-full border-purple-600 shadow-xs">
                                <div className="flex flex-row">
                                    <div className="m-2 w-[411px] h-[167px]">
                                        <img alt="" className=" rounded-xl scale-100 h-full w-auto overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                             src={ticket.concert.image}  />
                                    </div>
                                    <div className="my-2 mx-2">
                                        <div className="font-medium my-1 text-xl">{ticket.concert.title}</div>
                                        <div className="ml-1  mb-1 text-nowrap font-medium">
                                            <div className="">{ticket.concert.ageRating}</div>
                                            <div className="flex">{ticket.concert.genres.map((genre:string, index:number) => (
                                                <div key={index}>{index !== 0 && ', '}{genre}</div>
                                            ))}</div>
                                            <div className="">
                                                {ticket.concert.duration > 60 && `${Math.floor(ticket.concert.duration/60)} hr`}
                                                {ticket.concert.duration%60 > 0 && ` ${ticket.concert.duration%60} min`}
                                            </div>
                                        </div>
                                        <div className="ml-1">
                                            {ticket.concert.description.split(" ")
                                                .slice(0, 18)
                                                .join(" ") + "..."}
                                        </div>

                                    </div>
                                    <div key={index} className="text-nowrap">
                                        {ticket.shows.map((show:any, index:number) => (
                                            <div key={index} onClick={() => setConcertShow({show, id: ticket.concert.id})} className="bg-purple-700 hover:bg-purple-900 cursor-pointer py-2 px-3 text-white rounded-xl  my-2">{show.location}</div>
                                        ))}
                                    </div>
                                </div>
                                {concertShow.show && concertShow.id === ticket.concert.id &&
                                    <div className=" mx-6">
                                        <div className="text-right my-4">
                                            <button onClick={() => setConcertShow({show: null, id:null})} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Show less</button>
                                        </div>
                                        <div className="flex p-3 px-4 mt-1 mb-3 bg-pink-50 rounded-2xl text-nowrap items-center flex-row space-x-20">
                                            <div className="font-medium">{formatDate(concertShow.show.date)}</div>
                                            <div className="font-medium">{to12(concertShow.show.time)}</div>
                                            <div className="font-medium">{concertShow.show.seats} seats left</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}