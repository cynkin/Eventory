import {useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import {Dot} from "lucide-react";
import {useEffect, useState} from "react";

type MovieTicket = {
    amount : number,
    seats: string[],
    time: string,
    date: string,
    location: string,
    movie: {
        title:string,
    },
    language: string,
    booking_id : string,
    theatre_id : string,
    show_id: string,
}

type ConcertTicket = {
    id: string,
    amount: number,
    seats: number
    time: string,
    date: string,
    location: string,
    concert: {
        title: string,
    }
}

type TrainTicket = {
    amount: number,
    from : any,
    to : any,
    title : string,
    id: string,
    trainId: string,
    train_number: string,
    passengers: any,
    id_train: string,
}

// const image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkdPFA6r_IbzQJcyXrKT5TSritv0S_iWwFmw&s';


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

export default function History() {
    const { data: session, status } = useSession();
    const [movieTickets, setMovieTickets] = useState<MovieTicket[]>([]);
    const [concertTickets, setConcertTickets] = useState<ConcertTicket[]>([]);
    const [trainTickets, setTrainTickets] = useState<TrainTicket[]>([]);
    const [theatre, setTheatre] = useState<any>({
        theatre: null,
        id: null,
    });
    const [concertShow, setConcertShow] = useState<any>({
        show: null,
        id: null,
    });

    const userId = session?.user.id;
    const role = session?.user.role;
    useEffect(() => {
        if(!userId) return;

        const fetchMovieTickets = async () => {
            const res = await fetch(`/api/get/movie-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId, role})
                })
            const data = await res.json();
            setMovieTickets(data);
            console.log(data);
        };

        const fetchConcertTickets = async () => {
            const res = await fetch(`/api/get/concert-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId, role})
                })
            const data = await res.json();
            setConcertTickets(data);
        };

        const fetchTrainTickets = async () => {
            const res = await fetch(`/api/get/train-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId, role})
                })
            const data = await res.json();
            setTrainTickets(data);
        };

        fetchMovieTickets();
        fetchConcertTickets();
        fetchTrainTickets();
    }, [role, userId]);

    // if (status === "loading") return (<Spinner/>);
    if(!session) return;

    async function handleDownload(ticket: MovieTicket | ConcertTicket | TrainTicket) {
        const res = await fetch(`/api/download-ticket`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
        })

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'download-ticket.pdf'
        a.click();
    }

    async function cancelTicket(ticket: MovieTicket | ConcertTicket) {
        const res = await fetch(`/api/cancel-ticket`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
        })
        const data = await res.json();
        console.log(data);

        if(!res.ok || !data.success) return alert("Something went wrong");

        alert("Ticket Cancelled Successfully.");
        window.location.reload();
    }

    return (
        <div className="w-full border pt-13 pb-11 px-12 border-gray-300 rounded-xl m-5">
            <div className="text-3xl font-bold">
                {session.user.role === "vendor"
                    ? <div>Event History</div>
                    : <div>Booking History</div>
                }
            </div>
            {session.user.role === "vendor"
                ?
                <div className="flex mt-6 flex-row items-center flex-wrap">
                    {movieTickets && movieTickets.length > 0 &&
                        movieTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 flex flex-col m-2 text-sm rounded-xl w-full border-pink-600 shadow-xs">
                                <div className="flex flex-row">
                                    <div className="m-2 ">
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
                                            {ticket.movie.description.split(" ")
                                                .slice(0, 18)
                                                .join(" ") + "..."}
                                        </div>

                                    </div>
                                    <div key={index} className="text-nowrap">
                                    {ticket.theatres.map((theatre:any, index:number) => (
                                        <div key={index} onClick={()=>setTheatre({theatre, id:ticket.movie.id})} className="bg-pink-700 hover:bg-pink-900 cursor-pointer py-2 px-3 text-white rounded-xl  my-2">{theatre.location}</div>
                                    ))}
                                    </div>
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

                    {concertTickets && concertTickets.length > 0 &&
                        concertTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 flex flex-col m-2 text-sm rounded-xl w-full border-purple-600 shadow-xs">
                                <div className="flex flex-row">
                                    <div className="m-2 ">
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

                    {trainTickets && trainTickets.length > 0 &&
                        trainTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 w-fit flex flex-col m-2 text-sm rounded-xl  border-cyan-600 shadow-xs">
                                <div className="flex flex-row">
                                    <div className="my-2 mx-2">
                                        <div className="font-medium my-1 text-xl">{ticket.title}</div>
                                        <div className="ml-3 font-medium">#{ticket.number}</div>
                                        <div className="flex mt-3 items-center justify-center space-x-2">
                                            <div className="text-gray-800 text-nowrap ml-3 text-lg">{ticket.from.location}</div>
                                            <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>
                                            <div className="text-green-500 text-nowrap text-sm font-medium">{ticket.duration}</div>
                                            <div className="flex-grow min-w-10 h-0.5 bg-gray-300"></div>
                                            <div className="text-gray-800 text-nowrap mr-3 text-lg">{ticket.to.location}</div>
                                        </div>

                                        <div className="flex items-center justify-between space-x-2">
                                            <div className="text-gray-600 ml-5 text-sm font-medium">{to12(ticket.from.time)}</div>
                                            <div className="text-gray-600 mr-5  text-sm font-medium">{to12(ticket.to.time)}</div>
                                        </div>
                                        <div className="flex items-center justify-between space-x-2 mb-4">
                                            <div className="text-gray-600 ml-5 text-sm font-medium">{formatDate(ticket.from.date)}</div>
                                            <div className="text-gray-600 mr-5  text-sm font-medium">{formatDate(ticket.to.date)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                :
                <div className="flex mt-6 flex-row items-center flex-wrap">
                    {movieTickets && movieTickets.length > 0 &&
                        movieTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 m-2 text-sm rounded-xl w-fit border-pink-600 shadow-xs">
                                <div className="font-medium mb-1 text-lg">{ticket.movie.title}</div>
                                <div>{ticket.time}</div>
                                <div>{formatDate(ticket.date)}</div>
                                <div>{ticket.location}</div>
                                <div className="mt-1 font-bold">Total : &#8377; {ticket.amount}</div>
                                <div className="flex mt-2 justify-between items-center">
                                    <button onClick={() => handleDownload(ticket)} className="bg-blue-400 hover:bg-blue-500 cursor-pointer p-1 px-3 text-white rounded-full mr-2">Download Ticket</button>
                                    <button onClick={() => cancelTicket(ticket)} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Cancel Ticket</button>
                                </div>
                            </div>
                        ))
                    }

                    {concertTickets && concertTickets.length > 0 &&
                        concertTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 m-2 text-sm rounded-xl w-fit border-purple-600 shadow-xs">
                                <div className="font-medium mb-1 text-lg">{ticket.concert.title}</div>
                                <div>{ticket.time}</div>
                                <div>{formatDate(ticket.date)}</div>
                                <div>{ticket.location}</div>
                                <div className="mt-1 font-bold">Total : &#8377; {ticket.amount}</div>
                                <div className="flex mt-2 justify-between items-center">
                                    <button onClick={() => handleDownload(ticket)} className="bg-blue-400 hover:bg-blue-500 cursor-pointer p-1 px-3 text-white rounded-full mr-2">Download Ticket</button>
                                    <button onClick={() => cancelTicket(ticket)} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Cancel Ticket</button>
                                </div>
                            </div>
                        ))
                    }

                    {trainTickets && trainTickets.length > 0 &&
                        trainTickets.map((ticket:any, index:number) => (
                            <div key={index} className="border-2 p-2 m-2 text-sm rounded-xl w-fit border-green-600 shadow-xs">
                                <div className="font-medium mb-1 text-lg">{ticket.title}</div>
                                <div>From: <span className="font-bold">{ticket.from.location}</span></div>
                                <div>To: <span className="font-bold">{ticket.to.location}</span></div>
                                <div className="mt-1 font-bold">Total : &#8377; {ticket.amount}</div>
                                <div className="flex mt-2 justify-between items-center">
                                    <button onClick={() => handleDownload(ticket)} className="bg-blue-400 hover:bg-blue-500 cursor-pointer p-1 px-3 text-white rounded-full mr-2">Download Ticket</button>
                                    <button onClick={() => cancelTicket(ticket)} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Cancel Ticket</button>
                                </div>
                            </div>
                        ))}

                    {/*<div className="border-2 p-2 m-2 text-sm rounded-xl w-fit border-green-600 shadow-xs">*/}
                    {/*    <div className="font-medium mb-1 text-lg">Interstellar</div>*/}
                    {/*    <div>From: <span className="font-bold">{ticket.from.location}</span></div>*/}
                    {/*    <div>To: <span className="font-bold">{ticket.to.location}</span></div>*/}
                    {/*    <div className="mt-1 font-bold">Total : &#8377; {ticket.amount}</div>*/}
                    {/*    <div className="flex mt-2 justify-between items-center">*/}
                    {/*        <button onClick={() => handleDownload(ticket)} className="bg-blue-400 hover:bg-blue-500 cursor-pointer p-1 px-3 text-white rounded-full mr-2">Download Ticket</button>*/}
                    {/*        <button onClick={() => cancelTicket(ticket)} className="bg-red-400 hover:bg-red-500 cursor-pointer p-1 px-3 text-white rounded-full ">Cancel Ticket</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}


                    {trainTickets.length === 0 && movieTickets.length === 0 && concertTickets.length === 0 &&
                        <div className="m-10 text-3xl">So dry!</div>}
                </div>
            }
        </div>
    )
}