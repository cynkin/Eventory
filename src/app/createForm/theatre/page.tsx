"use client";
import { useForm, FormProvider, useFieldArray} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useRouter, notFound, useSearchParams} from "next/navigation";
import {ChevronsRight, Dot} from "lucide-react";
import TimeSlotFields from "@/myComponents/TimeSlotFields";
import {useEventStore} from "@/stores/eventStore";


const formSchema = z.object({
    details: z.array(
        z.object({
            date: z.string().min(1, "Date is required!"),
            cost: z.number({ required_error: "Cost is required!" }).nonnegative("Cost must be positive"),
            premiumCost: z.number({required_error: "Cost of premium seat is required!"}).nonnegative("Premium seat cost must be positive"),
            slots:z.array(
                z.object({
                    time: z.string().min(1, "Start time is required!"),
                    language: z.string().min(1, "Language is required!"),
                    }
                )
            )
        })
    )
});

type FormData = z.infer<typeof formSchema>;

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function CreateEventForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const movieId = searchParams.get("movieId");
    const theatreId = searchParams.get("theatreId");
    if(!movieId || !theatreId) {
        notFound();
    }

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            details:[{
                date:"",cost:undefined, premiumCost: undefined,
                slots: [{
                    time:"",
                    language:""
                }]
            }]
        },
    });
    const { register, handleSubmit, formState: { errors }, control } = methods;

    const {
        fields: dateFields,
        append: appendDate,
        remove: removeDate
    } = useFieldArray({
        control,
        name: "details"
    });

    const save = async (
        details: FormData["details"],
        movieId: string,
        theatreId: string,
    ) => {
        const res = await fetch("/api/create/shows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({details, movieId, theatreId}),
        });
        // console.log(data.cost, typeof data.cost);

        const result = await res.json();
        console.log(result);
        if (!res.ok) {
            console.error(`Failed to register show:`, result.error);
            throw new Error(result.error || "Failed to register");
        }

        return result;
    };


    const onSubmit = async(data: FormData) => {


        console.log("Hello")
        console.log(data);

        const res = await save(data.details, movieId, theatreId);
        console.log("Event registered successfully: ", res);
        if(res.success) router.push("/")
        // router.push("/account/history?event=movies")
        // const minCost = Math.min(...data.dates.map(date => date.cost));
        // console.log("Minimum cost:", minCost);

        // const params = new URLSearchParams(searchParams.toString());
        // params.set("event", "theatres");
        // params.set("id", id);
        // params.set("minCost", minCost.toString());
        // useEventStore.getState().setTheatreData(data);
        // router.push("/seatLayout?"+params.toString());
        // params.set("movie", data.title);
        // const res = save(data);
        // console.log("Event registered successfully", res);
    };

    return (
        <div className="mt-8 flex justify-center items-center">
            <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className=" xl:w-[900px] w-[800px] 2xl:w-[1100px] transition-all duration-1000 overflow-hidden relative shadow-xl rounded-xl px-8 py-6 space-y-4"
            >
                <div className="bg-gradient-to-t from-yellow-300 to-yellow-400 w-full rounded-t-lg absolute top-0 left-0 ">
                    <div className="text-3xl text-white px-6 pt-10 font-semibold">Add Dates To Air Your Movie Now!</div>
                    <div className="text-lg font-medium text-white px-6 pb-8">Fill in the necessary details below</div>
                </div>
                {/* Movie Title */}
                <div className="my-32"></div>
                <div className="w-full">
                    <div className="flex flex-row justify-between items-center">
                        {/*<label className=" font-medium">Dates / Seat Cost / Premium Seat Cost</label>*/}
                    </div>
                    {dateFields.map((field, index) => (
                        <div key={field.id} className="mt-2 mb-4">
                            <label className=" font-medium">Dates / Seat Cost / Premium Seat Cost</label>
                            <div className="flex gap-2 items-center mb-1">
                                <ChevronsRight/>
                                <input
                                    type="date"
                                    {...register(`details.${index}.date`)}
                                    className = "w-1/2 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-900 bg-gray-200 border-2 py-2 px-3 mt-1 rounded"
                                    placeholder="Enter Date"
                                />
                                <input
                                    type="number"
                                    {...register(`details.${index}.cost`, {valueAsNumber: true})}
                                    className = "w-1/5 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-900 bg-gray-200 border-2 py-2 px-4 mt-1 rounded"
                                    placeholder="Seat Cost"
                                    min="0"
                                    max="10000"
                                />
                                <input
                                    type="number"
                                    {...register(`details.${index}.premiumCost`, {valueAsNumber: true})}
                                    className = {`w-1/3 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-900 bg-gray-200 border-2 py-2 px-3 mt-1 rounded`}
                                    placeholder="Premium Seat Cost"
                                    min="0"
                                    max="10000"
                                />
                                <button type="button" onClick={() => {
                                    if (dateFields.length > 1) removeDate(index)}} className="cursor-pointer font-medium hover:font-bold text-red-600">Remove
                                </button>
                            </div>
                            <TimeSlotFields nestIndex={index}/>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.details?.[index]?.date?.message && <> <Dot/> {errors.details[index].date.message as string} </> }</p>
                                <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.details?.[index]?.cost?.message && <> <Dot/> {errors.details[index].cost.message as string} </> }</p>
                                <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.details?.[index]?.premiumCost?.message && <> <Dot/> {errors.details[index].premiumCost.message as string} </> }</p>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendDate({date: "", cost:undefined, premiumCost :undefined,
                            slots:[{time:"", language:""}]}, {shouldFocus: true})}
                        className="my-2 cursor-pointer font-medium hover:font-bold text-blue-600">
                        + Add Date
                    </button>
                </div>


                <button
                    type="submit"
                    className="mt-2 w-full cursor-pointer bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]"
                >
                    Confirm and Finish
                </button>
            </form>
            </FormProvider>
        </div>
    );
}
