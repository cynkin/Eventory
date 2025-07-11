'use client';
import {Clock3, LibraryBig, UserLock} from "lucide-react"
import Link from "next/link";

type Movie = {
    id: string;
    title: string;
    image: string;
    ageRating: string;
    genres: string[];
    duration: number;
};

export default function MovieCard({title, image, ageRating, genres, duration, id} : Movie){

    // const [movies, setMovies] = useState<Movie[]>([]);
    //
    // useEffect(() => {
    //     const fetchMovies = async () => {
    //         const data = await getMovies();
    //         setMovies(data);
    //         console.log(data);
    //     };
    //     fetchMovies();
    // }, []);

    return(
            <>
                <Link href={`/booking?movieId=${id}`}  className="hover:cursor-pointer rounded-2xl border border-gray-300 border-b-white flex flex-col">
                    <div className="rounded-2xl w-[311px] h-[167px] relative overflow-hidden">
                        <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                               src={image}  />
                    </div>
                    <div className="mt-4 px-3 mb-2 text-[17px] text-wrap font-medium ">{title}</div>
                    <div className="flex text-sm px-1 py-0.5 text-gray-700">
                        <UserLock className="mx-2 mr-2 w-5 h-5" /> {ageRating}
                    </div>
                    <div className="flex text-sm px-1 py-0.5 text-gray-700">
                        <LibraryBig className="mx-2 mr-2 w-5 h-5" /> {genres.map((genre, index)=>(
                        <div key={index}>{index !== 0 && " ,  "}{genre}</div>
                    ))}
                    </div>
                    {/*<div className="flex text-sm px-1 py-0.5 text-gray-700">*/}
                    {/*    <Languages className="mx-2 mr-2 w-5 h-5" /> English, Hindi, Tamil*/}
                    {/*</div>*/}
                    <div className="flex text-sm px-1 py-0.5 text-gray-700">
                        <Clock3 className="mx-2 mr-2 w-5 h-5" />
                        {duration > 60 && `${Math.floor(duration/60)} hours`}
                        {duration%60 > 0 && ` ${duration%60} minutes`}
                    </div>
                    {/*<div className="text-xl tracking-wider mt-2 px-4 text-right">&#8377;{movie.cost}</div>*/}
                    {/*<div className=" text-xs text-gray-800 px-4 text-right">per person</div>*/}
                    {/*<div className=" text-xs text-gray-800 px-4 text-right">Includes taxes and fees</div>*/}
                    {/*<div className=" mb-3 text-xs text-gray-800 px-4 text-right"></div>*/}
                </Link>

        </>
    )
}