import {useEffect, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

export default function Movies() {
    const [movieTickets, setMovieTickets] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const movieId = searchParams.get('id');
    const [theatre, setTheatre] = useState<any>({
        theatre: null,
        id: null,
    })

    useEffect(() => {
        const fetchMovieTickets = async () => {
            const res = await fetch(`/api/get/movie-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId : 'admin', role:'vendor'})
                })
            const data = await res.json();
            setMovieTickets(data);
        };
        fetchMovieTickets();
    }, []);


    return (
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Events</div>
                <div className="text-3xl font-medium ml-6 pb-5">Movies</div>
                <div className="flex flex-col">
                        <div className="flex mt-6 flex-row items-center flex-wrap">
                            {movieTickets && movieTickets.length > 0 &&
                                movieTickets.map((ticket:any, index:number) => (
                                    <div key={index} className={`border-2 p-2 flex ${ticket.movie.id === movieId && 'bg-pink-50'} flex-col m-2 text-sm rounded-xl w-full border-pink-600 shadow-xs`}>
                                        <div className="flex relative flex-row">
                                            <div className="m-2 w-[411px] h-[167px] ">
                                                <img alt="" className=" rounded-xl scale-100 h-full w-auto overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                     src={ticket.movie.image}  />
                                            </div>
                                            <div className="my-2 mx-2">
                                                <div className="font-medium my-1 text-xl">{ticket.movie.title}</div>
                                                <div className="ml-1  mb-1 text-nowrap font-medium">
                                                    <div className="">{ticket.movie.ageRating}</div>
                                                    <div className="flex">{ticket.movie.genres.map((genre:string, index:number) => (
                                                        <div key={index}>{index !== 0 && ', '}{genre}</div>
                                                    ))}</div>
                                                    <div className="">
                                                        {ticket.movie.duration > 60 && `${Math.floor(ticket.movie.duration/60)} hr`}
                                                        {ticket.movie.duration%60 > 0 && ` ${ticket.movie.duration%60} min`}
                                                    </div>
                                                    <div>Commission: {ticket.movie.commission}%</div>
                                                </div>
                                                <div className="ml-1">
                                                    {ticket.movie.description}
                                                </div>
                                            </div>
                                            <div key={index} className="text-nowrap mt-7">
                                                {ticket.theatres.map((theatre:any, index:number) => (
                                                    <div key={index} onClick={()=>setTheatre({theatre, id:ticket.movie.id})} className="bg-pink-700 hover:bg-pink-100 hover:text-pink-700 transition-all duration-200 cursor-pointer py-2 px-3 text-white rounded-xl  my-2">{theatre.location}</div>
                                                ))}
                                            </div>
                                            <Link href={`/?q=users&id=${ticket.movie.vendor_id}`} className="absolute right-1 px-2 m-1 hover:bg-gray-100 hover:text-black transition-all duration-200 bg-black text-white rounded-full">Vendor ID: {ticket.movie.vendor_id}</Link>
                                        </div>
                                        {theatre.theatre && theatre.id === ticket.movie.id &&
                                            <div className=" mx-6">
                                                <div className="text-right mb-4">
                                                    <button onClick={() => setTheatre({theatre:null, id:null})} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Show less</button>
                                                </div>
                                                {theatre.theatre.shows.map((show:any, index:number) => (
                                                    <div key={index} className="flex p-3 px-4 mt-1 mb-3 bg-pink-50 rounded-2xl text-nowrap items-center flex-row space-x-20">
                                                        <div className="font-medium">{formatDate(show.date)}</div>
                                                        <div className="flex space-x-5 items-center w-full">
                                                            {show.details.map((detail:any, index:number) => (
                                                                <div key={index} className="relative cursor-pointer bg-pink-50 border-2 border-pink-600 text-center rounded-xl px-6 pt-5 pb-2">
                                                                    <div className="absolute shadow -top-2 left-1/2 -translate-x-1/2 px-2 rounded-lg bg-white font-extrabold text-xs tracking-wide">
                                                                        {detail.language}
                                                                    </div>
                                                                    <div className="self-center">{detail.time}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
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
