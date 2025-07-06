'use client';
import {Clock3, Languages, LibraryBig, UserLock} from "lucide-react"
import Link from "next/link";

type Concert = {
    id: string;
    title: string;
    // seats: number;
    cost: number;
    languages:string[];
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
    start_date: string;
    end_date: string;
    // vendor_id: string;
    // createdAt: Date;
};

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function ConcertCard({title, start_date, end_date, image, languages, ageRating, cost, genres, duration, id} : Concert){
    // const [concerts, setConcerts] = useState<Concert[]>([]);
    //
    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         const data = await getConcerts();
    //         console.log(data);
    //         setConcerts(data);
    //     };
    //     fetchMovies();
    // }, []);


    return(
        <>
            <Link href={`/concert-booking?concertId=${id}`}
                  className="hover:cursor-pointer rounded-2xl w-[314px] border border-gray-300 border-b-white flex flex-col">
                <div className="rounded-t-2xl w-[314px] h-[180px] relative overflow-hidden">
                    <img className="scale-110 overflow-hidden transition-all ease-in-out duration-300"
                           style={{objectFit: "cover", objectPosition: "center"}}
                           src={image}
                           />
                </div>
                <div className="mt-4 px-3 mb-2 text-[17px] font-medium ">{title}</div>
                <div className="flex text-sm px-1 py-0.5 text-gray-700">
                    <UserLock className="mx-2 mr-2 w-5 h-5"/>{ageRating}
                </div>
                <div className="flex text-sm px-1 py-0.5 text-gray-700">
                    <LibraryBig className="mx-2 mr-2 w-5 h-5"/>{genres.map((genre, index)=>(
                    <div key={index}>{index !== 0 && " ,  "}{genre}</div>
                ))}
                </div>
                <div className="flex text-sm px-1 py-0.5 text-gray-700">
                    <Languages className="mx-2 mr-2 w-5 h-5"/>{languages.map((language, index)=>(
                        <div key={index}>{index !== 0 && " ,  "}{language}</div>
                ))}
                </div>

                {/*<div className="flex text-sm px-1 py-0.5 text-gray-700">*/}
                {/*    <MapPin className="mx-2 mr-2 w-5 h-5 " /> {props.location}*/}
                {/*</div>*/}
                <div className="flex text-sm px-1 py-0.5 text-gray-700">
                    <Clock3 className="mx-2 mr-2 w-5 h-5"/>
                    {duration > 60 && Math.floor(duration/60)} hours
                    {duration%60 > 0 && ` ${duration%60} minutes`}
                </div>
                {/*<div className="flex text-sm px-1 py-0.5 text-gray-700">*/}
                {/*    <TicketSlash className="mx-2 mr-2 w-5 h-5" /> {props.available} / {props.total} Available*/}
                {/*</div>*/}
                <div className="text-xl tracking-wider mt-2 px-4 text-right">&#8377; {cost}</div>
                <div className=" text-xs text-gray-800 px-4 text-right">per person</div>
                <div className=" text-xs text-gray-800 px-4 text-right">Includes taxes and fees</div>
                <div
                    className=" mb-3 text-xs font-medium text-gray-900 px-4 text-right">
                    {formatDate(start_date)} {end_date && " to " + formatDate(end_date)}
                </div>
            </Link>
        </>
    )
}
