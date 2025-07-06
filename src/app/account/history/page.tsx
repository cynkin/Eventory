'use client'
import SidePanel from "@/myComponents/Account/SidePanel";
import {SessionProvider} from "next-auth/react";
import {useMovieStore} from "@/stores/movieStore";
import {useEffect} from "react";
import History from "@/myComponents/Account/History";

export default function ProfilePage() {
    const {refreshMovies} = useMovieStore();

    useEffect(() => {
        refreshMovies();
    }, [refreshMovies])

    return (
        <div className="">
            <SessionProvider>
                <div className="xl:px-44 flex text-[#151515] transition-all duration-1100">
                    <SidePanel/>
                    <History/>
                </div>
            </SessionProvider>
        </div>
    )
}