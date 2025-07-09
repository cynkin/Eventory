'use client'
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {getTrain, getUser} from "@/utils/getFromDb";
import {Dot, Hash, Info} from "lucide-react";
import TrainCard from "@/myComponents/Event/TrainCard";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";

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

type AddPassengerFormProps = {
    setPassengers: (passengers: any[]) => void;
};

function AddPassengerForm({ setPassengers }: AddPassengerFormProps) {
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
        setPassengers(data.passengers);
    };

    return (
        <div className="flex justify-center items-center">
            <FormProvider {...methods }>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className=" w-[800px] transition-all duration-1000 overflow-hidden relative shadow rounded-sm px-8 py-6 space-y-4"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 w-full rounded-t-sm absolute top-0 left-0 ">
                        <div className="text-2xl text-white px-6 py-5 font-semibold">Add Passenger Details</div>
                        {/*<div className="text-lg font-medium text-white px-6 pb-8">Drop your passenger details below</div>*/}
                    </div>

                    <div className="my-16"></div>

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
                            className=" cursor-pointer font-medium hover:font-bold text-purple-600"
                        >
                            + Add Passenger
                        </button>
                    </div>

                    <button
                        type="submit"
                        className=" w-full bg-purple-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-purple-700"
                    >Confirm and Update
                    </button>
                </form>
            </FormProvider>
        </div>
    );
}

export default function TrainBookingPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [train, setTrain] = useState<any>()
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [action, setAction] = useState<string>("from");
    const [passengers, setPassengers] = useState<any[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(!id) return;

        const fetchTrain = async() =>{
            const train = await getTrain(id);
            setTrain(train);
        }
        fetchTrain();
    }, [id])

    useEffect(() => {
        async function getBalance() {
            const user = await getUser(session?.user?.id || "");
            setBalance(user?.balance || 0);

            // await update({
            //     user:{
            //         balance: user?.balance || 0,
            //     }
            // })
        }
        if(session) getBalance();
    }, [session]);

    const handleSubmit = async () => {
        if(!session || !session.user || !session.user.id) return;

        setLoading(true);

        const fromStation = train.stations.find(station => station.location === from);
        const toStation = train.stations.find(station => station.location === to);
        const amount = passengers.length*cost;
        console.log(passengers, fromStation, toStation, amount);

        if(balance < amount) {
            alert("Insufficient Balance!");
            setLoading(false);
            return;
        }

        const ticketData = {
            trainId: train.train_id,
            from : fromStation,
            to : toStation,
            passengers: passengers,
            noOfSeats : passengers.length,
            amount: amount,
            userId: session.user.id,
            id: train.id,
            vendorId: train.vendor_id,
            seats: train.seatLayout,
            title : train.title,
        }

        try{
            const res = await fetch("/api/send-ticket/train", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ticketData, email: session.user.email}),
            });
            const data = await res.json();

            console.log(data);
            if (!res.ok || !data.success) {
                console.error("Ticket email failed", data.error);
            } else {
                console.log("Ticket sent successfully");
            }
        } catch (e) {
            console.error("Error sending download-ticket:", e);
        }

        setLoading(false);
        router.push("/account/history")
    }

    function handleClick(location: string) {
        if(location === from) {
            setFrom("");
            setAction("from");
            return;
        }
        if(location === to) {
            setTo("");
            setAction("to");
            return;
        }
        if(action === "from") {
            if(to) {
                const fromIndex = train.stations.findIndex(station => station.location === location);
                const toIndex = train.stations.findIndex(station => station.location === to);

                if (toIndex <= fromIndex) {
                    alert("Please select a 'to' station that comes after the 'from' station.");
                    return;
                }
            }

            setFrom(location);
            setAction("to");
        }
        if(action === "to") {
            const fromIndex = train.stations.findIndex(station => station.location === from);
            const toIndex = train.stations.findIndex(station => station.location === location);

            if (toIndex <= fromIndex) {
                alert("Please select a 'to' station that comes after the 'from' station.");
                return;
            }
            setTo(location);
            setAction("from");
        }
    }

    let cost = 0;
    function getCost() {
        cost = train.stations.find(station => station.location === to).cost - train.stations.find(station => station.location === from).cost
        return cost;
    }

    return(
        <>
            {loading ?
                <div className="xl:px-44 flex justify-center items-center h-screen">
                    <Spinner/>
                </div>
                :
                <>
            {train &&
                <div className="xl:px-44 p-2 flex space-x-20 justify-center flex-row">
                    <div className=" flex items-center flex-col">
                        <div className="font-medium mt-3 text-5xl">{train.title}</div>
                        <div className="flex my-1 text-lg text-gray-500 font-medium items-center">
                            <Hash/>
                            <div>{train.train_id}</div>
                        </div>
                        <div className="mt-8 relative">
                            {/* Legend */}
                            <div className="flex items-center ml-8 gap-8 text-sm font-medium text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500 border border-white shadow" />
                                    <span>From</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-white shadow" />
                                    <span>To</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-800 border border-white shadow" />
                                    <span>Unselected</span>
                                </div>
                            </div>
                            <div className="absolute top-10 left-5 bottom-0 w-px bg-blue-300 z-0" />
                            {train.stations.map((station, index) => (
                                <div key={index} className="relative z-10 flex items-start space-x-4 my-6">
                                    <div className="w-10 flex justify-center">
                                        <button onClick={() => handleClick(station.location) } className={`w-5 h-5 mt-4 cursor-pointer  rounded-full border-2 border-white shadow ${
                                            station.location === from
                                                ? "bg-red-500"
                                                : station.location === to
                                                    ? "bg-blue-500"
                                                    : "bg-gray-800 "}`}
                                        />
                                    </div>
                                    <button onClick={()=>handleClick(station.location)} className="border-2 cursor-pointer border-blue-300 rounded-lg px-4 py-2 bg-white">
                                        <div className={`text-xl ${station.location === from 
                                            ? "text-red-500" 
                                            : station.location === to
                                            ? "text-blue-500"
                                            : ""} font-medium`}>{station.location}</div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-black p-1 text-white rounded-full flex w-fit flex-row items-center mt-4">
                            <Info/>
                            <div className="flex mx-2 font-medium w-fit flex-col justify-center items-center">Click to choose From and To locations!</div>
                        </div>
                        <div className="mt-10">
                            <AddPassengerForm setPassengers={setPassengers}/>
                        </div>
                    </div>
                    <div>
                        {passengers.length > 0 ? (from && to) ?
                            <div className="flex w-fit flex-col justify-center items-center mt-10">
                                <TrainCard title={train.title} id={id!} trainId={train.train_id} from={train.stations.find(station => station.location === from)} to={train.stations.find(station => station.location === to)} stations={train.stations}/>
                                <div className="w-full self-center mt-30 h-fit py-3 px-4 m-3 border border-gray-400 rounded-xl items-center flex-col">
                                    <div className="text-xl font-medium">Payment Details</div>
                                    <div>
                                        <div className="mt-4">Passenger Info</div>
                                        <div className="flex px-2 justify-between font-bold">
                                            <div>No. of passengers:</div>
                                            <div>{passengers.length}</div>
                                        </div>

                                        <div className="mt-3">Ticket Info</div>
                                        <div className="flex px-2 justify-between font-bold">
                                            <div>{passengers.length} X {getCost()}</div>
                                            <div>&#8377; {passengers.length*cost}</div>
                                        </div>

                                        <div className="mt-3">Payment Total</div>
                                        <div className="flex px-2 justify-between font-bold">
                                            <div>Total</div>
                                            <div>&#8377; {passengers.length*cost}</div>
                                        </div>

                                    </div>

                                    <div className="mt-5 flex justify-center w-full rounded-xl">
                                        {5> 0 &&
                                            <button onClick={handleSubmit} className="w-4/5  px-4 py-2 cursor-pointer rounded-full bg-[#1568e3] text-white hover:bg-[#0d4eaf]">
                                                Proceed to Payment
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="bg-black p-1 text-white rounded-full flex w-fit flex-row items-center mt-10">
                                <Info/>
                                <div className="flex mx-2 font-medium w-fit flex-col justify-center items-center">Choose From and To locations!</div>
                            </div>
                            :
                            <></>
                            // <div className="flex font-medium text-xl w-fit flex-col justify-center items-center mt-10">Please enter Passenger Details!</div>
                        }
                    </div>
                </div>

            }
                </>
            }
        </>
    )
}