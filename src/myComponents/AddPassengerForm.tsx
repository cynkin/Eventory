"use client";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {Dot} from "lucide-react"

const formSchema = z.object({
    passengers: z.array(
        z.object({
            name: z.string().min(3, "Full Name must contain at least 3 characters"),
            gender: z.string().min(1, "Gender is required"),
            age: z.number({ required_error: "Age is required" }).nonnegative("Price must be positive"),
        })
    ).min(1, "Add at least one passenger"),
});

type FormData = z.infer<typeof formSchema>;

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function AddPassengerForm() {

    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            passengers: [{name: "", gender: "", age:undefined},],
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = methods;

    const {
        fields: passengerFields,
        append: appendPassenger,
        remove: removePassenger
    } = useFieldArray({
        control,
        name: "passengers"
    });

    const onSubmit = (data: FormData) => {
        console.log(data.passengers);
        // useEventStore.getState().setTrainData(data);
        // const params = new URLSearchParams(searchParams.toString());
        // params.set("event", "trains");
        // router.push(`/seatLayout?${params.toString()}`)
    };

    return (
        <div className="flex justify-center items-center">
            <FormProvider {...methods }>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-[800px] transition-all duration-1000 overflow-hidden relative shadow rounded-xl px-8 py-6 space-y-4"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 w-full rounded-t-lg absolute top-0 left-0 ">
                        <div className="text-3xl text-white px-6 pt-10 font-semibold">Add Passenger Details</div>
                        <div className="text-lg font-medium text-white px-6 pb-8">Drop your passenger details below</div>
                    </div>

                    <div className="my-32"></div>

                    {/*<div className="flex">*/}
                    {/*    <div className="w-1/2 pr-2 mr-2">*/}
                    {/*        <label className="block font-medium">Train Name</label>*/}
                    {/*        <input*/}
                    {/*            type="text"*/}
                    {/*            {...register("title")}*/}
                    {/*            className={style}*/}
                    {/*            placeholder="Enter Train Name"*/}
                    {/*        />*/}
                    {/*        <p className="text-sm font-medium text-red-600">{errors.title?.message}</p>*/}
                    {/*    </div>*/}
                    {/*    <div className="w-1/2">*/}
                    {/*        <label className="block font-medium">Train ID / Number</label>*/}
                    {/*        <input*/}
                    {/*            type="number"*/}
                    {/*            {...register("trainId", {valueAsNumber:true})}*/}
                    {/*            className={style}*/}
                    {/*            placeholder="Enter Train ID"*/}
                    {/*        />*/}
                    {/*        <p className="text-sm font-medium text-red-600">{errors.trainId?.message}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="">*/}
                    {/*    <label className="block font-medium">Compartments</label>*/}
                    {/*    <input*/}
                    {/*        type="number"*/}
                    {/*        {...register("compartments", {valueAsNumber: true})}*/}
                    {/*        className={style}*/}
                    {/*        placeholder="Enter no. of Compartments"*/}
                    {/*    />*/}
                    {/*    <p className="text-sm font-medium text-red-600">{errors.compartments?.message}</p>*/}
                    {/*</div>*/}

                    <div className="w-full">
                        <div className="flex flex-row justify-between items-center">
                            <label className="font-medium">Passenger Details</label>
                            <button type="button" onClick={() => {
                                if (passengerFields.length >= 2) removePassenger(passengerFields.length-1)}} className="cursor-pointer font-medium hover:font-bold text-red-600">Remove</button>
                        </div>
                        {passengerFields.map((field, index) => (
                            <div key={field.id} className="mt-2 mb-4">
                                <div className="flex gap-2 mb-1">
                                    <input
                                        type="text"
                                        {...register(`passengers.${index}.name`)}
                                        className = "w-1/2 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"
                                        placeholder="Enter Full Name"
                                    />
                                    <select
                                        {...register(`passengers.${index}.gender`)}
                                        className="w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 border py-2 px-4 mt-1 rounded bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input
                                        type="number"
                                        {...register(`passengers.${index}.age`, {valueAsNumber: true})}
                                        className = {`w-1/4 focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded`}
                                        placeholder="Passenger Age"
                                    />
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.passengers?.[index]?.name?.message && <> <Dot/> {errors.passengers[index].name.message as string} </> }</p>
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.passengers?.[index]?.gender?.message && <> <Dot/> {errors.passengers[index].gender.message as string} </> }</p>
                                    <p className="text-sm flex flex-row items-center font-medium text-red-600">{errors.passengers?.[index]?.age?.message && <> <Dot/> {errors.passengers[index].age.message as string} </> }</p>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendPassenger({name:"", gender: "", age :undefined}, {shouldFocus: true})}
                            className="my-2 cursor-pointer font-medium hover:font-bold text-purple-600"
                        >
                            + Add Passenger
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full bg-purple-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-purple-700"
                    >Confirm and Update
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}
