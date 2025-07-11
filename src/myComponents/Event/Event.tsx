'use client'
import ConcertCard from "@/myComponents/Event/ConcertCard";
import {ChevronLeft, ChevronRight, Info} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import MovieCard from "@/myComponents/Event/MovieCard";
import TrainCard from "@/myComponents/Event/TrainCard";
import {useMovieStore} from "@/stores/movieStore";
import {useConcertStore} from "@/stores/concertStore";
import {useTrainStore} from "@/stores/trainStore";
import { useSession } from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";

type EventProps = {
    type: 'movie' | 'concert' | 'train'  // Define allowed string literals
}

function formatDate(dateStr: string){
    const date = new Date(dateStr);
    const day = date.getDate(); // returns 23 (no leading zero)
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Jul"
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
}

export default function Event(props: EventProps) {
    const { data: session, status } = useSession();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [open, setOpen] = useState(true);

    const movies = useMovieStore(state => state.movies);
    const {refreshMovies} = useMovieStore();

    const concerts = useConcertStore(state => state.concerts);
    const {refreshConcerts} = useConcertStore();

    const trains = useTrainStore(state => state.trains);
    const {refreshTrains} = useTrainStore();


    useEffect(() => {
        if (props.type === "movie" && movies.length === 0) {
            refreshMovies();
        }
        if (props.type === "concert" && concerts.length === 0) {
            refreshConcerts();
        }
        if (props.type === "train" && trains.length === 0) {
            refreshTrains();
        }
    }, [movies.length, refreshMovies, concerts.length, refreshConcerts, trains.length, props.type, refreshTrains]);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;

        setCanScrollLeft(el.scrollLeft > 0);

        const atRightEnd = scrollLeft + clientWidth >= scrollWidth - 5;
        setCanScrollRight(!atRightEnd);
    };

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        checkScroll();

        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll); // for responsiveness

        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);
    return(
        <>
            <div className="flex flex-col relative mx-8 my-8 mb-14 ">
                <div className="text-2xl font-[600] xl:px-44 mb-4 transition-all duration-1100 dark:text-white">
                    {movies.length > 0 &&
                    <>
                        {(props.type === 'movie') &&
                        <div className="flex space-x-8 items-center">
                            <div>Movies Trending Right Now!</div>
                            {session && session.user.role === 'vendor' &&
                                <button onClick={() => setOpen((prev) => !prev)} className="bg-[#151515] cursor-pointer rounded-full p-1 flex items-center font-light text-white text-sm">
                                    <Info/>
                                    {open && <div className="px-1">Click on your movie on the home page to add theatres</div>}
                                </button>
                            }
                        </div>}
                    </>
                    }
                    {(props.type === 'train') && trains.length > 0 && "Travel and Explore!"}
                    {(props.type === 'concert') && concerts.length > 0 && "Enjoy the Most Awaited Concerts!"}
                </div>
                <div className="w-full overflow-hidden xl:px-44 transition-all duration-800">
                    {canScrollLeft &&
                    <button onClick={() => scroll(-900)}  className="transition-all ease-in-out duration-400 bg-white shadow-lg absolute -left-4 xl:left-40 top-1/2 -translate-y-1/2 z-10 rounded-full hover:bg-[#ebf4fd] hover:cursor-pointer">
                        <ChevronLeft className="text-blue-700 w-8 p-1.5 h-auto"/>
                    </button>
                    }
                    {canScrollRight &&
                    <button onClick={() => scroll(900)}  className="transition-all ease-in-out duration-400 bg-white shadow-lg absolute -right-4 xl:right-40 top-1/2 -translate-y-1/2 z-10 rounded-full hover:bg-[#ebf4fd] hover:cursor-pointer">
                        <ChevronRight className="text-blue-700 w-8 p-1.5 h-auto"/>
                    </button>
                    }

                    <div ref={scrollRef} className="flex flex-row overflow-x-auto gap-10 scrollbar-hide">
                        
                        {props.type === 'movie' &&
                            <>
                                {movies.map((movie, index) => (
                                    <MovieCard key={index} id={movie.id} title={movie.title} image={movie.image} ageRating={movie.ageRating} genres={movie.genres} duration={movie.duration}/>
                                ))}
                            </>
                        }
                        {/*<TrainCard title="Rajdhani Express" id={156423} from="New Delhi" to="Bengaluru" cost={2100} fromDate={formatDate("2025-07-19")} toDate={formatDate("2025-07-23")} fromTime="4:55 AM" toTime="9:55 PM" available={400} total={400} duration="16h 50m"/>*/}
                        {props.type === 'train' &&
                            <>
                                {trains.map((train, index) => (
                                    <TrainCard key={index} title={train.title} id={train.id} trainId={train.train_id} stations={train.stations}/>
                                ))}
                            </>
                        }
                        {props.type === 'concert' &&
                            <>
                                {concerts.map((concert, index) => (
                                    <ConcertCard key={index} id={concert.id} start_date={concert.start_date} end_date={concert.end_date} cost={concert.cost} title={concert.title} image={concert.image} languages={concert.languages} ageRating={concert.ageRating} genres={concert.genres} duration={concert.duration}/>
                                ))}
                            </>
                        }
                    </div>

                </div>
            </div>

        </>
    )
}