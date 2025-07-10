import {useSearchParams} from "next/navigation";
import Users from "@/myComponents/Admin/Users";
import Movies from "@/myComponents/Admin/Movies";
import Concerts from "@/myComponents/Admin/Concerts";
import Trains from "@/myComponents/Admin/Trains";
import MovieTickets from "@/myComponents/Admin/MovieTickets";

export default function Content() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    return(
        <div className="w-full">
            {q === 'users' && <Users/>}
            {q === 'movies' && <Movies/>}
            {q === 'concerts' && <Concerts/>}
            {q === 'trains' && <Trains/>}
            {q === 'movieTickets' && <MovieTickets/>}
        </div>
    )
}