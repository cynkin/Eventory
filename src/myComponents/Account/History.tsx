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

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"

    return `${weekday}, ${day} ${month}`;
}

export default function History() {
    const { data: session, status } = useSession();
    const [movieTickets, setMovieTickets] = useState<MovieTicket[]>([]);
    const [concertTickets, setConcertTickets] = useState<ConcertTicket[]>([]);
    const [trainTickets, setTrainTickets] = useState<TrainTicket[]>([]);

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
            console.log(data);
        };

        fetchMovieTickets();
        fetchConcertTickets();
        fetchTrainTickets();
    }, [role, userId]);

    if (status === "loading") return (<Spinner/>);
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
                    <div className="flex justify-between items-center"></div>
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