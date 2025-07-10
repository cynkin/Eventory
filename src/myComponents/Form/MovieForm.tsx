"use client";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useRouter, useSearchParams} from "next/navigation";
import {Info} from "lucide-react"


const formSchema = z.object({
    title: z.string().min(3, "Title must contain at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    ageRating: z.string().min(1, "This field is mandatory"),
    duration:z.number().min(10, "Minimum duration is 10 minutes"),
    commission: z.number({ required_error: "Commission is required" }).nonnegative("Commission must be positive"),
    // cost: z.number({ required_error: "Price is required" }).nonnegative("Price must be positive"),
    // costElite: z.number().nonnegative("Price must be positive"),
    image: z.string().url("Invalid URL"),
    genres: z.array(z.string()).min(1, "Select at least one genre"),
});

type FormData = z.infer<typeof formSchema>;

const GENRES = ["Action", "Drama", "Comedy", "Horror", "Thriller", "Sci-Fi", "Romance", "Adventure", "Spy", "Gore", "Supernatural", "Psychological"];
const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function CreateEventForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            ageRating: "",
            duration:0,
            image: "",
            genres: [],
            commission: 0,
        },
    });

    const imageUrl = watch("image").trim();
    const genres = watch("genres") || [];

    const save = async (data:any) => {
        const res = await fetch("/api/create/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log(result);
        if (!res.ok) {
            console.error(`Failed to register ${data.title}:`, result.error);
            throw new Error(result.error || "Failed to register");
        }
        return result;
    };


    const onSubmit = async(data: FormData) => {
        console.log(data);
        const res = await save(data);
        if(res.success) {
            // const params = new URLSearchParams(searchParams.toString());
            // params.set("event", "theatres");
            // params.set("movie", data.title);
            // params.set("movieId", res.id);
            console.log("Event registered successfully\nMovie Id:", res.id);
            // router.push("/seatLayout?" + params.toString())
            router.push("/");
        }
        else{
            router.push("/createForm/movie")
        }
    };

    const toggleGenre = (genre: string) => {
        const updated = genres.includes(genre)
            ? genres.filter((g: string) => g !== genre)
            : [...genres, genre];
        setValue("genres", updated, { shouldValidate: true });
    };


    return (
        <div className="mt-9 flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=" xl:w-[900px] w-[800px] 2xl:w-[1100px] transition-all duration-1000 overflow-hidden relative shadow-xl rounded-xl px-8 py-6 space-y-4"
            >
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full rounded-t-lg absolute top-0 left-0 ">
                    <div className="text-3xl text-white px-6 pt-10 font-semibold">Create Your Event Now!</div>
                    <div className="text-lg font-medium text-white px-6 pb-8">Drop your event details below</div>
                </div>


                {/* Movie Title */}
                <div className="my-32"></div>
                <div>
                    <label className="block font-medium">Movie Name</label>
                    <input
                        type="text"
                        {...register("title")}
                        className={style}
                        placeholder="Enter movie name"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.title?.message}</p>
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium">Description</label>
                    <input
                        type="text"
                        {...register("description")}
                        className={style}
                        placeholder="Enter description"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.description?.message}</p>
                </div>
                <div>
                    <label className="block font-medium">Age Rating</label>
                    <input
                        type="text"
                        {...register("ageRating")}
                        className={style}
                        placeholder="Enter age rating"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.ageRating?.message}</p>
                </div>

                <div>
                    <label className="block font-medium">Duration(min)</label>
                    <input
                        type="text"
                        {...register("duration", {valueAsNumber: true})}
                        className={style}
                        placeholder="Enter duration in minutes"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.duration?.message}</p>
                </div>

                <div>
                    <label className="block font-medium">Commission Fee</label>
                    <input
                        type="text"
                        {...register("commission", {valueAsNumber: true})}
                        className={style}
                        placeholder="Enter commission percent"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.commission?.message}</p>
                </div>

                {/* Genres */}
                <div>
                    <label className="block font-medium">Genres</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {GENRES.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                className={`px-3 py-1 rounded-full text-sm ${
                                    genres.includes(genre)
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                                onClick={() => toggleGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-red-600">{errors.genres?.message as string}</p>
                </div>
                <div>
                    <label className="block font-medium">Banner Image URL(Landscape)</label>
                    <input
                        type="url"
                        {...register("image")}
                        className={style}
                        placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.image?.message}</p>
                </div>
                {imageUrl && (
                    <div className="rounded-2xl border-2 w-[314px] h-[167px] relative overflow-hidden">
                        <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                             src={imageUrl}  />
                    </div>
                )}
                <button
                    type="submit"
                    className="mt-2 w-full bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]"
                >
                    Save
                </button>
            </form>
        </div>
    );
}
