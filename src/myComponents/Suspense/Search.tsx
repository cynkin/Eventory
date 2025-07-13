'use client'
import {notFound, useSearchParams} from 'next/navigation';
import MovieCard from "@/myComponents/Event/MovieCard";
import {useEffect, useState} from "react";
import {getConcerts, getMovies} from "@/utils/getFromDb";
import Fuse from "fuse.js";
import ConcertCard from "@/myComponents/Event/ConcertCard";
import {useTrainStore} from "@/stores/trainStore";
import {Station} from "../../../types/eventStore";
import TrainCard from "@/myComponents/Event/TrainCard";
import Spinner from "@/myComponents/UI/Spinner";

type Movie = {
    id: string;
    title: string;
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
};

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

type Train = {
    title: string,
    id: string,
    train_id : number;
    stations : Station[];
}

const validEvents = ['movies', 'concerts', 'trains'];

export default function Page() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || "";

    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [filteredConcerts, setFilteredConcerts] = useState<Concert[]>([]);
    const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
    const [output, setOutput] = useState<boolean>(false);
    const[loading, setLoading] = useState<boolean>(true);

    const trains = useTrainStore(state => state.trains);
    const {refreshTrains} = useTrainStore();

    useEffect(() => {
        setLoading(true);
        const fetchMovies = async () => {
            const data = await getMovies();

            if(q.trim() === "") {
                setOutput((prev) => prev || false)
                setFilteredMovies(data);
                return;
            }

            const fuse = new Fuse(data, {
                keys: ['title'],
                threshold: 0.4, // fuzzy match sensitivity
            });

            const results = fuse.search(q);
            setFilteredMovies(results.map(res => res.item));

            // console.log(data, results, q);
        };

        const fetchConcerts = async () => {
            const data = await getConcerts();

            if(q.trim() === "") {
                setFilteredConcerts(data);
                setOutput((prev) => prev || false)
                return;
            }

            const fuse = new Fuse(data, {
                keys: ['title'],
                threshold: 0.4, // fuzzy match sensitivity
            });

            const results = fuse.search(q);
            setFilteredConcerts(results.map(res => res.item));

            // console.log(data, results, q);
        };

        const fetchTrains = async() =>{
            refreshTrains();
            // console.log(trains);
            if(q.trim() === "") {
                setOutput((prev) => prev || false)
                return;
            }

            const fuse = new Fuse(trains, {
                keys: ['title'],
                threshold: 0.4, // fuzzy match sensitivity
            });

            const results = fuse.search(q);
            setFilteredTrains(results.map(res => res.item));
        }

        fetchTrains();
        fetchConcerts();
        fetchMovies();
        setLoading(false);
    }, [q, refreshTrains, trains.length]);

    // const movie = movies.filter(m => m.title.toLowerCase() === q?.toLowerCase())
    // if(!validEvents.includes(event)) notFound();

    // {title, start_date, end_date, image, languages, ageRating, cost, genres, duration, id} : Concert

    return (
        <div>
            {loading
            ?
                <Spinner/>
            :
                <div className="xl:px-44 p-10 flex flex-wrap gap-6 transition-all duration-1100">
                    {filteredMovies.map((movie, index) => (
                        <MovieCard key={index} id={movie.id} title={movie.title} image={movie.image} ageRating={movie.ageRating} genres={movie.genres} duration={movie.duration}/>
                    ))}
                    {filteredConcerts.map((concert, index) => (
                        <ConcertCard key={index} id={concert.id} title={concert.title} image={concert.image} ageRating={concert.ageRating} languages={concert.languages} cost={concert.cost} end_date={concert.end_date} start_date={concert.start_date} genres={concert.genres} duration={concert.duration}/>
                    ))}
                    {filteredTrains.map((train, index) => (
                        <TrainCard key={index} trainId={train.train_id} id={train.id} title={train.title} stations={train.stations}/>
                    ))}
                </div>
            }
        </div>
    )
}

