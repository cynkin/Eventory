'use client'
import {useEffect, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function MovieTickets() {
    const searchParams = useSearchParams();
    const showId = searchParams.get('id');
    const [shows, setShows] = useState([]);
    useEffect(() => {
        const getShows = async () => {
            const res = await fetch("/api/get/movie-shows",);
            if (res.ok) {
                let data = await res.json();
                if (showId) {
                    data.sort((a: any, b: any) => {
                        if (a.id === showId) return -1;
                        if (b.id === showId) return 1;
                        return 0;
                    });
                }
                setShows(data);
            }
        }
        getShows();
    }, [showId, setShows])

    return(
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen overflow-y-auto ">
                <div className="text-gray-500 font-medium px-5 pt-3">Shows</div>
                <div className="text-3xl font-medium ml-6 pb-5">Movies</div>
                <div className="flex flex-col">
                    <div className="flex mt-6 flex-row items-center flex-wrap">
                        {shows && shows.length > 0 &&
                            shows.map((show:any, index:number) => (
                                <div key={index} className={`border-2 p-2 flex ${show.id === showId && 'bg-pink-50'} flex-col m-2 text-sm rounded-xl w-full border-pink-600 shadow-xs`}>
                                    <div className="flex relative flex-row">
                                        <div className="m-2 w-[411px] h-[167px] ">
                                            <img alt="" className=" rounded-xl scale-100 h-full w-auto transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                 src={show.movie.image}  />
                                        </div>
                                        <div className="my-2 mx-2">
                                            <div className=" my-1 font-medium text-xl">{show.movie.title}</div>
                                            <div className="ml-1  mb-1 text-nowrap">
                                                {/*<div className="flex">{ticket.show.seats.map((seat:string, index:number) => (*/}
                                                {/*    <div key={index}>{index !== 0 && ', '}{seat}</div>*/}
                                                {/*))}</div>*/}
                                                <div className="flex">
                                                    Time:
                                                    <div className=" ml-1 font-medium">{show.time}</div>
                                                </div>
                                                <div className="flex">
                                                    Date:
                                                    <div className=" ml-1 font-medium">{formatDate(show.date)}</div>
                                                </div>
                                                <div className="flex">
                                                    Language:
                                                    <div className=" ml-1 font-medium">{show.language}</div>
                                                </div>
                                                <div className="flex">
                                                    Location:
                                                    <div className=" ml-1 font-medium">{show.theatre.location}</div>
                                                </div>
                                                <div className="flex">
                                                    Show ID:
                                                    <div className=" ml-1 font-medium">{show.id}</div>
                                                </div>
                                            </div>

                                        </div>
                                        <Link href={`/?q=users&id=${show.movie.vendor_id}`} className="absolute top-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Vendor ID: {show.movie.vendor_id}</Link>
                                        <Link href={`/?q=movies&id=${show.movie.id}`} className="absolute bottom-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Movie ID: {show.movie.id}</Link>
                                        {/*<Link href={`/?q=users&id=${show.user_id}`} className="absolute top-0 right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">User ID: {show.user_id}</Link>*/}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}