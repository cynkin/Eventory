'use client'
import Main from "@/myComponents/Main";
import {useMovieStore} from "@/stores/movieStore";
import {useEffect} from "react";
import {useConcertStore} from "@/stores/concertStore";
import {useTrainStore} from "@/stores/trainStore";

export default function Home() {
    const {refreshMovies} = useMovieStore();
    const {refreshConcerts} = useConcertStore();
    const {refreshTrains} = useTrainStore();

    // useEffect( () => {
    //     refreshMovies();
    //
    //     const fetchBalance = async() => {
    //         if (!session || !session.user) return;
    //         const newBalance = await getBalance(session.user.id!);
    //         await update({
    //             user: {
    //                 balance: newBalance,
    //             }
    //         })
    //     }
    //
    //     fetchBalance();
    // }, [session, refreshMovies, update])


    useEffect(() => {
        refreshMovies();
        refreshConcerts();
        refreshTrains();
    }, [refreshConcerts, refreshMovies, refreshTrains])

    return (
        <div className="">
            <div className=""><Main /></div>
        </div>
    );
}
