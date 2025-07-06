"use client";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {Dot, Info} from "lucide-react"
import {useEventStore} from "@/stores/eventStore";
import { useRouter, useSearchParams } from 'next/navigation';
import StationAutocomplete from "@/myComponents/StationAutocomplete";

const formSchema = z.object({
    title: z.string().min(3, "Title must contain at least 3 characters"),
    trainId: z.number().min(1, "ID is required"),
    stations: z.array(
        z.object({
            location: z.string().min(3, "Location must be at least 3 characters"),
            time: z.string().min(1, "Time is required"),
            date: z.string().min(1, "Date is required"),
            cost: z.number({ required_error: "Price is required" }).nonnegative("Price must be positive"),
        })
    ).min(2, "Add at least two stations "),
    compartments: z.number({required_error: "This field is required"}).min(1, "Minimum 1 compartment"),
    additional: z.number().nonnegative("Price must be positive"),
});

type FormData = z.infer<typeof formSchema>;

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function CreateEventForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            trainId:undefined,
            stations: [{location: "", date: "", time: "", cost:0}, {location: "", date: "", time: "", cost:undefined}],
            compartments: undefined,
            additional : 0,
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control
    } = methods;

    const {
        fields: stationFields,
        append: appendStation,
        remove: removeStation
    } = useFieldArray({
        control,
        name: "stations"
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
        useEventStore.getState().setTrainData(data);
        const params = new URLSearchParams(searchParams.toString());
        params.set("event", "trains");
        router.push(`/seatLayout?${params.toString()}`)
    };

    const cost = watch(`stations.${stationFields.length  - 1}.cost`);

    return (
        <div className="mt-8 flex justify-center items-center">
            <FormProvider {...methods }>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" xl:w-[900px] w-[800px] 2xl:w-[1100px] transition-all duration-1000 overflow-hidden relative shadow-xl rounded-xl px-8 py-6 space-y-4"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-full rounded-t-lg absolute top-0 left-0 ">
                        <div className="text-3xl text-white px-6 pt-10 font-semibold">Create Your Event Now!</div>
                        <div className="text-lg font-medium text-white px-6 pb-8">Drop your event details below</div>
                    </div>

                    <div className="my-32"></div>

                    <div className="flex">
                        <div className="w-1/2 pr-2 mr-2">
                            <label className="block font-medium">Train Name</label>
                            <input
                                type="text"
                                {...register("title")}
                                className={style}
                                placeholder="Enter Train Name"
                            />
                            <p className="text-sm font-medium text-red-600">{errors.title?.message}</p>
                        </div>
                        <div className="w-1/2">
                            <label className="block font-medium">Train ID / Number</label>
                            <input
                                type="number"
                                {...register("trainId", {valueAsNumber:true})}
                                className={style}
                                placeholder="Enter Train ID"
                            />
                            <p className="text-sm font-medium text-red-600">{errors.trainId?.message}</p>
                        </div>
                    </div>
                    <div className="">
                        <label className="block font-medium">Compartments</label>
                        <input
                            type="number"
                            {...register("compartments", {valueAsNumber: true})}
                            className={style}
                            placeholder="Enter no. of Compartments"
                        />
                        <p className="text-sm font-medium text-red-600">{errors.compartments?.message}</p>
                    </div>

                    <div className="">
                        <label className="block font-medium">Additional Cost for Premium/Sleeper Seat</label>
                        <input
                            type="number"
                            {...register("additional", {valueAsNumber: true})}
                            className={style}
                            placeholder="Enter additional price"
                        />
                        <p className="text-sm font-medium text-red-600">{errors.additional?.message}</p>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-row justify-between items-center">
                            <label className="font-medium">Station</label>
                            <div className="flex items-center text-sm bg-black text-white rounded-full px-1 py-1 pr-3">
                                <Info className="mr-2"/>Enter the cost of travel between the first and current station
                            </div>
                            <button type="button" onClick={() => {
                                if (stationFields.length >= 3) removeStation(stationFields.length-1)}} className="cursor-pointer font-medium hover:font-bold text-red-600">Remove</button>
                        </div>
                        {stationFields.map((field, index) => (
                            <div key={field.id} className="mt-2 mb-4">
                                <div className="flex gap-2 mb-1">
                                    <StationAutocomplete name={`stations.${index}.location`} />
                                    <input
                                        type="date"
                                        {...register(`stations.${index}.date`)}
                                        className = "w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                                        placeholder="Enter Date"
                                    />
                                    <input
                                        type="time"
                                        {...register(`stations.${index}.time`)}
                                        className = "w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-4 mt-1 rounded"
                                        placeholder="Start Time"
                                    />
                                    <input
                                        type="number"
                                        readOnly= {index===0 && true}
                                        {...register(`stations.${index}.cost`, {valueAsNumber: true})}
                                        className = {`w-1/2 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded`}
                                        placeholder="Travel Cost"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="text-sm font-medium text-red-600">{errors.stations?.[index]?.location?.message as string}</p>
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.stations?.[index]?.date?.message && <> <Dot/> {errors.stations[index].date.message as string} </> }</p>
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.stations?.[index]?.time?.message && <> <Dot/> {errors.stations[index].time.message as string} </> }</p>
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.stations?.[index]?.cost?.message && <> <Dot/> {errors.stations[index].cost.message as string} </> }</p>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendStation({location:"", date: "", time:"", cost}, {shouldFocus: true})}
                            className="my-2 cursor-pointer font-medium hover:font-bold text-blue-600"
                        >
                            + Add Station
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]"
                    >
                        Continue to Seat Layout
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}
