import {useSearchParams} from "next/navigation";
import Users from "@/myComponents/Admin/Users";
import Movies from "@/myComponents/Admin/Movies";
import Concerts from "@/myComponents/Admin/Concerts";
import Trains from "@/myComponents/Admin/Trains";
import MovieTickets from "@/myComponents/Admin/MovieTickets";
import {signOut} from "next-auth/react";

export default function Content() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    return(
        <div className="w-full relative">
            <div className="absolute -top-0 -right-7">
                <button
                    onClick={() => {
                        signOut({ callbackUrl: "/" });
                        sessionStorage.clear();
                    }}
                    className=" text-sm bg-red-300 cursor-pointer  font-bold hover:text-red-400 m-1 rounded-full text-white px-2 py-[5px] hover:bg-gray-300  text-center"
                >
                    Sign out
                </button>
            </div>
            <div className="">
                {q === 'users' && <Users/>}
                {q === 'movies' && <Movies/>}
                {q === 'concerts' && <Concerts/>}
                {q === 'trains' && <Trains/>}
                {q === 'movieTickets' && <MovieTickets/>}
            </div>
        </div>
    )
}