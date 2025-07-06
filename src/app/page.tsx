'use client'
import Main from "@/myComponents/Main";
import {useMovieStore} from "@/stores/movieStore";
import {useEffect} from "react";

export default function Home() {
    const {refreshMovies} = useMovieStore();

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
    }, [refreshMovies])

    return (
        <div className="">
            <div className=""><Main /></div>
        </div>
    );
}
