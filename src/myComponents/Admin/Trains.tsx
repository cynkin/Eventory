import {useEffect, useState} from "react";

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
export default function Trains() {
    const [trainTickets, setTrainTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchTrainTickets = async () => {
            const res = await fetch(`/api/get/train-tickets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId:'admin', role:'vendor'})
                })
            const data = await res.json();
            setTrainTickets(data);
        };
        fetchTrainTickets();
    }, [])

    return (
        <div className="">
            <div className="bg-white rounded-2xl ml-10 p-5 mt-10 w-full mb-5 h-screen">
                <div className="text-gray-500 font-medium px-5 pt-3">Events</div>
                <div className="text-3xl font-medium ml-6 pb-5">Trains</div>
                <div className="flex flex-col">
                    <div className="flex mt-6 flex-row items-center flex-wrap">
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
                </div>
            </div>
        </div>
    )
}