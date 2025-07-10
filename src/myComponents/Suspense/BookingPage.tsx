'use client'
import {notFound, useRouter, useSearchParams} from "next/navigation";
import {getMovie, getTheatres} from "@/utils/getFromDb";
import {useEffect, useMemo, useState} from "react";
import Spinner from "@/myComponents/UI/Spinner";
import {New_Rocker} from "next/font/google";
import {Dot,} from "lucide-react";
import Link from "next/link";
import {SessionProvider} from "next-auth/react";
import AddTheatre from "@/myComponents/UI/AddTheatre";
import Commission from "@/myComponents/UI/Commission"
import {useEventStore} from "@/stores/eventStore";
import {Slot} from "../../../types/eventStore"

const font = New_Rocker({
    subsets:['latin'],
    weight:['400']
});

type Movie = {
    id: string;
    title: string;
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
    description: string;
    commission: number;
};

// type Slot = {
//     time: string,
//     language: string,
// }
//
// type Theatre = {
//     cost: number,
//     premiumCost : number,
//     slots: Slot[],
//     location : string,
//     seatLayout : any,
//     vendorId : string
// }



export default function Page() {
    const searchParams = useSearchParams();
    const movieId = searchParams.get('movieId');
    const router = useRouter();

    let dateParam = searchParams.get('date');
    const today = new Date();

    if(!dateParam){
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        dateParam = `${year}-${month}-${day}`;
    }

    const [movie, setMovie] = useState<Movie>();
    const [theatres, setTheatres] = useState<any>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!movieId) return;

        // const year = today.getFullYear();
        // const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed
        // const day = dateParam.padStart(2, '0');

        const date =  dateParam;

        const fetchMovie = async () => {
            const movie = await getMovie(movieId);
            const theatres = await getTheatres(date, movieId);

            console.log(theatres);

            setTheatres(theatres);
            setMovie(movie);
            setLoading(false);
        };

        fetchMovie();

    }, [movieId,dateParam]);

    function seatSelect(slot:Slot) {
        // const year = today.getFullYear();
        // const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-indexed
        // const day = dateParam?.padStart(2, '0');
        // const date =  `${year}-${month}-${day}`;

        useEventStore.getState().setSlot(slot);
        router.push("/booking/seatSelection?movieId=" + movieId);
    }

    const days = useMemo(() => {
        // const options = { weekday: "short", month: "short" } as const;
        const list = [];
        for(let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);

            const dayName = date
                .toLocaleDateString("en-US", { weekday: "short"})
                .toUpperCase();

            const dayNum = date.getDate();

            const monthName = date
                .toLocaleDateString("en-US", { month: "short"})
                .toUpperCase();

            list.push({
                name: dayName,
                num: dayNum,
                month: monthName,
                fullDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
                isToday: i === 0,
            });
        }
        return list;
    }, []);

    if(!movieId) notFound();
    if(loading) return <Spinner/>
    if (!movie) return <div className="xl:px-44">Movie not found</div>;

    return(
        <div className="xl:px-44 pl-7 pr-4 py-10">
            <div className="flex items-center space-x-40 xl:space-x-100">
                <img src={movie.image} alt="banner" className="border-2 border-black p-5"/>
                <div className="flex justify-center items-center flex-col">
                    <div className={`${font.className} self-start text-8xl`}>{movie.title.toUpperCase()}</div>
                    <div className="flex items-center self-start flex-row mt-7 space-x-2">
                        <div className="">{movie.ageRating}</div><Dot className="w-9 h-auto"/>

                        <div className="text-nowrap">
                            {movie.duration > 60 && `${Math.floor(movie.duration/60)} hours`}
                            {movie.duration%60 > 0 && ` ${movie.duration%60} minutes`}
                        </div><Dot className="w-9 h-auto"/>

                        <div className="text-nowrap">{movie.genres.join(", ")}</div>
                        <SessionProvider>
                            <Commission commission={movie.commission}/>
                        </SessionProvider>
                    </div>
                    <div className="mt-3">{movie.description}</div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-20">
                <div className="bg-[#151515] p-0.5 rounded-3xl  w-fit text-white">
                    <div className="flex flex-row items-center">
                        {days.map((day, index) => (
                            <div key={index}  className="select-none m-2">
                                <Link draggable={false} href={`/booking?movieId=${movieId}&date=${day.fullDate}`} className={`transition-all duration-250 cursor-pointer ${dateParam === day.fullDate && "bg-white text-[#151515]"} px-4 py-1 rounded-2xl flex flex-col justify-between items-center`}>
                                    <div className="text-sm">{day.name}</div>
                                    <div className="text-lg font-bold">{day.num}</div>
                                    <div className="text-sm">{day.month}</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <SessionProvider>
                    <AddTheatre movieId={movieId}/>
                </SessionProvider>
            </div>
            <div className="mt-10 flex flex-col space-y-5">
                {theatres.map((theatre:any, index:number) => (
                    <div key={index} className="bg-blue-100 p-3 font-medium text-lg flex rounded-lg items-center space-x-60 xl:space-x-120 ">
                        <div className="text-2xl font-extrabold">{theatre.location.toUpperCase()}</div>
                        <div className="flex text-nowrap gap-6">
                            {theatre.slots.map((slot, idx:number) => (
                                <button onClick={()=> seatSelect(slot)} key={idx}  className="relative cursor-pointer border-2 border-blue-700 text-center rounded-xl px-6 pt-5 pb-2">
                                    <div className="absolute shadow -top-2 left-1/2 -translate-x-1/2 px-2 rounded-lg bg-white font-extrabold text-xs tracking-wide">
                                        {slot.language}
                                    </div>
                                    <div className="self-center">{slot.time}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}