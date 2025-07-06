import Link from "next/link";
import {Clapperboard} from "lucide-react";
import { useSession } from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";

export default function AddTheatre({movieId} : {movieId: string}) {
    const { data: session, status } = useSession();
    if (status === "loading") return (<Spinner/>);
    return(
        <>
        {session &&  session.user.role === "vendor" &&
                <div>
                    <Link href={"/seatLayout?movieId=" + movieId + "&event=theatres"}
                          className="my-2 focus:outline-none flex flex-row items-center rounded-full cursor-pointer bg-[#191e3b] hover:bg-[#ffc94c] transition-all duration-200 shadow-lg">
                        <div className="p-2 m-2 rounded-full bg-[#ffc94c]">
                            <Clapperboard className="w-4 h-4 text-[#191e3b]"/>
                        </div>
                        <div className="mr-4 text-white text-sm text-nowrap">Add Theatre</div>
                    </Link>
                </div>
        }
        </>
    )
}