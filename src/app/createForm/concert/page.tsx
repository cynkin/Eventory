"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    title: z.string().min(3, "Title must contain at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    ageRating: z.string().min(1, "This field is mandatory"),
    details: z.array(
        z.object({
            location: z.string().min(3, "Location must be at least 3 characters"),
            date: z.string().min(1, "Date is required"),
            time: z.string().min(1, "Start time is required"),
        })
    ),
    seats : z.number({ required_error: "No. of seats is required" }).min(1, "No. of seats must be positive"),
    cost: z.number({ required_error: "Cost is required" }).nonnegative("Cost must be positive"),
    image: z.string().url("Invalid URL"),
    genres: z.array(z.string()).min(1, "Select at least one genre"),
    languages: z.array(z.string()).min(1, "Select at least one language"),
    duration:z.number().min(10, "Minimum duration is 10 minutes"),
});

type FormData = z.infer<typeof formSchema>;

const GENRES = ["Classical", "Pop", "Rock", "Jazz", "Hip Hop", "EDM", "Rap", "R&B", "Country", "Contemporary", "Instrumental", "Metal", ];
const LANGUAGES = ["English", "Hindi", "Tamil", "Kannada", "Malayalam", "Telugu", "Other",];

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function CreateEventForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            ageRating: "",
            details: [{location: "", date: "", time: ""}],
            seats: undefined,
            cost: undefined,
            duration:undefined,
            image: "",
            genres: [],
            languages: [],
        },
    });

    const {
        fields: dateFields,
        append: appendDate,
        remove: removeDate
    } = useFieldArray<FormData>({
        control,
        name: "details"
    });

    const imageUrl = watch("image").trim();

    const genres = watch("genres") || [];
    const languages = watch("languages") || [];

    const seats = watch("seats") || 0;
    const cost = watch("cost") || 0;

    const totalCost = seats * cost;

    const onSubmit = async (data: FormData) => {
        console.log(data);

        try {
            const res = await fetch("/api/create/concerts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                console.error(`Failed to register Concert :`, result.error);
            }
            console.log("Success:", result, res);
             router.push("/account/history")
        }catch (err) {
            console.error(`Failed to register Concert :`, err);
        }
    };

    const toggleGenre = (genre: string) => {
        const updated = genres.includes(genre)
            ? genres.filter((g: string) => g !== genre)
            : [...genres, genre];
        setValue("genres", updated, { shouldValidate: true });
    };

    const toggleLang = (lang: string) => {
        const updated = languages.includes(lang)
            ? languages.filter((g: string) => g !== lang)
            : [...languages, lang];
        setValue("languages", updated, { shouldValidate: true });
    };

    return (
        <div className="mt-8 flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=" xl:w-[900px] w-[800px] 2xl:w-[1100px] transition-all duration-1000 overflow-hidden relative shadow-xl rounded-xl px-8 py-6 space-y-4"
            >
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full rounded-t-lg absolute top-0 left-0 ">
                    <div className="text-3xl text-white px-6 pt-10 font-semibold">Create Your Event Now!</div>
                    <div className="text-lg font-medium text-white px-6 pb-8">Drop your event details below</div>
                </div>

                <div className="my-32"></div>
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        {...register("title")}
                        className={style}
                        placeholder="Enter title"
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

                {/* Age Rating */}
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

                <div className="">
                    <label className="block font-medium">Seats</label>
                    <input
                        type="number"
                        {...register("seats", {valueAsNumber: true})}
                        className="w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                        placeholder="Enter total no. of seats"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.seats?.message}</p>
                </div>
                <div className="w-full flex justify-center ">
                    <div className="w-full mr-2 pr-2">
                        <label className="block font-medium">Price Details</label>
                        <input
                            type="number"
                            {...register("cost", {valueAsNumber: true})}
                            className={style}
                            placeholder="Enter price per seat"
                        />
                        <p className="text-sm font-medium text-red-600">{errors.cost?.message}</p>
                    </div>
                    <div className="w-full">
                        <label className="block font-medium">Total Investment</label>
                        <input
                            type="number" className=" text-gray-600 cursor-not-allowed w-full border py-2 px-3 mt-1 rounded focus:outline-none "
                            readOnly placeholder="0" value={totalCost}
                        />
                    </div>
                </div>
                <div className="">
                    <label className="block font-medium">Duration</label>
                    <input
                        type="number"
                        {...register("duration", {valueAsNumber: true})}
                        className="w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                        placeholder="Enter duration in minutes"
                    />
                    <p className="text-sm font-medium text-red-600">{errors.duration?.message}</p>
                </div>
                {/* Dates */}
                <div>
                    <div className="flex justify-between items-center">
                        <label className=" font-medium">Event Details</label>
                        <button type="button" onClick={() => {
                            if (dateFields.length > 1) removeDate(dateFields.length-1)}} className="cursor-pointer font-medium hover:font-bold text-red-600">
                            Remove
                        </button>
                    </div>
                    {dateFields.map((field, index) => (
                        <div key={field.id}>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    {...register(`details.${index}.location`)}
                                    className="w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                                    placeholder="Enter Location"
                                />
                                <input
                                    type="date"
                                    {...register(`details.${index}.date`)}
                                    className="w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                                    placeholder="Enter Date"
                                />
                                <input
                                    type="time"
                                    {...register(`details.${index}.time`)}
                                    className="w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                                    placeholder="Enter time"
                                />
                            </div>
                            <p className="text-sm  font-medium text-red-600">{errors.details?.[index]?.location?.message as string}</p>
                            <p className="text-sm  font-medium text-red-600">{errors.details?.[index]?.date?.message as string}</p>
                            <p className="text-sm  font-medium text-red-600">{errors.details?.[index]?.time?.message as string}</p>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendDate({location:"", date:"", time:""}, {shouldFocus: true})}
                        className="my-2 cursor-pointer font-medium hover:font-bold text-blue-600"
                    >
                        + Add Location/Date
                    </button>
                </div>

                <div>
                    <label className="block font-medium">Languages</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                className={`px-3 py-1 rounded-full text-sm ${
                                    languages.includes(lang)
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                                onClick={() => toggleLang(lang)}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-red-600">{errors.languages?.message as string}</p>
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
                    <label className="block font-medium">Banner Image URL</label>
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
                    Register
                </button>
            </form>
        </div>
    );
}
