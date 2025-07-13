'use client'
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {getConcert, getConcertShows, getUser} from "@/utils/getFromDb";
import {Dot} from "lucide-react";
import {useSession} from "next-auth/react";

import {Metamorphous} from "next/font/google";
import Link from "next/link";


const font = Metamorphous({
    subsets:['latin'],
    weight:['400']
});

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function Page() {
    const { data: session, status, update } = useSession();
    const searchParams = useSearchParams();
    const concertId = searchParams.get('concertId');
    const [concert, setConcert] = useState<any>();
    const [shows, setShows] = useState<any[]>([])
    const [user, setUser] = useState<any>();

    useEffect(() => {
        if(!concertId) return;


        const fetchConcert = async () => {
            const concert = await getConcert(concertId);
            const shows = await getConcertShows(concertId);
            setShows(shows);
            setConcert(concert);
        };

        fetchConcert();

    }, [concertId]);

    useEffect(() =>{
        if(!session?.user?.id) return;
        const getUserFromDB = async() => {
            const user = await getUser(session?.user?.id || "");
            setUser(user);
        }
        getUserFromDB();

    }, [session?.user?.id])

    const handleClick = () => {
        if(user.role === 'vendor') return () => alert("You are not allowed to book a show as a vendor.");
        return () => alert("Your account has been suspended. Please contact support for more details.");
    }

    return(
        <div className="xl:px-44 pl-7 pr-4 py-10">
            {concert &&
                <div className="flex items-center space-x-40 xl:space-x-50">
                    <img src={concert.image} alt="banner" className="border-2 w-160 border-black p-5"/>
                    <div className="flex justify-center items-center flex-col">
                        <div className={`${font.className} self-start text-8xl`}>{concert.title.toUpperCase()}</div>
                        <div className="flex items-center self-start flex-row mt-7 space-x-2">
                            <div className="">{concert.ageRating}</div><Dot className="w-9 h-auto"/>

                            <div className="text-nowrap">
                                {concert.duration >= 60 && `${Math.floor(concert.duration/60)} hours`}
                                {concert.duration%60 > 0 && ` ${concert.duration%60} minutes`}
                            </div><Dot className="w-9 h-auto"/>

                            <div className="text-nowrap">{concert.genres.join(", ")}</div>
                        </div>
                        <div className="self-start mt-3">{concert.description}</div>
                    </div>
                </div>
            }
            <div className="mt-20">
                {shows && shows.map((show, index) => (
                    <div key={index} className="bg-blue-100 p-3 py-5 font-medium text-lg flex justify-between rounded-lg items-center my-5">
                        <div className="text-2xl font-extrabold">{show.location.toUpperCase()}</div>
                        <div className="flex items-center text-lg font-bold text-nowrap text-gray-700 gap-6">
                            <div className="p-2 border-2 border-blue-800 text-center rounded-xl ">{show.time}</div>
                            <div className="p-2 border-2 border-blue-800 text-center rounded-xl">{formatDate(show.date)}</div>

                            <div className="p-2 border-2 border-blue-800 text-center rounded-xl">{show.seats} seats left</div>

                            <div className="cursor-pointer">
                                {user && user.role === 'user' && user.google_id !== 'suspended' ?
                                    <Link href={`/concert-booking/payment?showId=${show.id}&concertId=${concertId}`} className="p-2 border-2 hover:bg-blue-200 transition-all duration-200 hover:text-black border-red-600 text-gray-700 text-center rounded-xl">Book Now</Link>
                                    :
                                    <div onClick={handleClick()} className="p-2 border-2 hover:bg-blue-200 transition-all duration-200 hover:text-black border-red-600 text-gray-700 text-center rounded-xl">Book Now</div>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}