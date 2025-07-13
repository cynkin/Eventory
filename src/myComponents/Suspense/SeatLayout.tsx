'use client';
import React, {useState} from "react"
import {Seat, SeatLayout} from "../../../types/eventStore"
import {useEventStore} from "@/stores/eventStore";
import {notFound, useRouter, useSearchParams} from "next/navigation";
import {checkLocation} from "@/utils/getFromDb";

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 mb-3 rounded-lg"
const seatTypes = ["regular", "vip", "disabled"] as const;

export default  function GridLayout(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const {trainData} = useEventStore();
    const movieId = searchParams.get("movieId");
    // const minCost = searchParams.get("minCost");

    const event = searchParams.get("event");
    const setLayout = useEventStore((s)=> s.setLayout)

    const [rows, setRows] = useState(undefined as number | undefined);
    const [cols, setCols] = useState(undefined as number | undefined);
    const [location, setLocation] = useState("");
    const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
    const[error, setError] = useState("");

    const generateLayout = async() => {
        if(!await locationCheck(location)) return;
        if (rows && cols && rows > 0 && cols > 0) {
            const newLayout: SeatLayout = {
                layout: Array.from({ length: rows }, (_, rowIndex) =>
                    Array.from({ length: cols }, (_, colIndex): Seat => {
                        const code = String.fromCharCode(65 + rowIndex) + " " + (colIndex + 1);
                        return {
                            type: "regular",
                            status: "available",
                            code,
                        };
                    })
                ),
            };
            setSeatLayout(newLayout);
        }
    };


    const getSeatColor = (type: string) => {
        switch (type) {
            case "vip": return "bg-yellow-500";
            case "disabled": return "bg-gray-300";
            case "regular": return "bg-green-600";
            default: return "bg-white";
        }
    };

    const cycleSeatType = (rowIdx: number, colIdx: number) => {
        if (!seatLayout) return;
        setSeatLayout((prev) => {
            const newLayout = prev!.layout.map((row) => row.map((seat) => ({ ...seat })));
            const currentType = newLayout[rowIdx][colIdx].type;
            const currentIndex = seatTypes.indexOf(currentType);
            newLayout[rowIdx][colIdx].type = seatTypes[(currentIndex + 1) % seatTypes.length];
            return {layout: newLayout};
        });
    };

    const register = async (event: "theatres" | "trains", data: any) => {
        const res = await fetch(`/api/create/${event}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        console.log(result);
        if (!res.ok) {
            console.error(`Failed to register ${event}:`, result.error);
            throw new Error(result.error || "Failed to register");
        }

        return result;
    };

    const locationCheck = async(location: string) => {
        if(event === "theatres"){
            if(location.length < 3){
                setError("Location must be at least 3 characters long!");
                return false;
            }
            if(await checkLocation(location)){
                setError("Theatre already exists!");
                return false;
            }
        }
    }

    const handleSave= async() =>{
        if(!locationCheck(location)) return;
        if(seatLayout){
            setLayout(seatLayout)
            // console.log(seatLayout, "********************");
            // console.log(useEventStore.getState().seatLayout);
            // console.log(event);
            // console.log(trainData);

            try {
                if (event === "trains") {
                    const res = await register("trains", {...trainData, seatLayout});
                    console.log("Event registered successfully: ", res);
                    router.push("/account/history?event=trains")
                }
                else if (event === "theatres") {
                    const res = await register("theatres", {location, seatLayout, movieId});
                    if(res.success){
                        console.log("Event registered successfully: ", res);
                        router.push("/createForm/theatre?movieId="+movieId+"&theatreId="+res.id)
                    }
                    else throw new Error("Failed to register");
                }
            }
            catch(err){
                console.log("Error:", err);
            }
        }
    }

    return(
        <div className="flex flex-col justify-center items-center">
            <div className="text-3xl my-10 tracking-wider font-bold">Create The Seat Layout For Your Event</div>
            {!seatLayout && (
                <div className="w-[660px] mt-15 flex flex-col mx-20">
                    {event === "theatres" &&
                        <>
                            <label className="block font-medium">Theatre Name, City</label>
                            <input type={"text"} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: 'Lido Mall, Bengaluru'" className={style} />
                        </>
                    }
                    <div className="flex ">
                        <div className="w-full mr-2 pr-2">
                            <label className="block font-medium">Seat Rows</label>
                            <input
                                type="number"
                                value={rows ?? ""}
                                onChange={(e) => {
                                    const value = Math.min(30, Math.max(1, parseInt(e.target.value)));
                                    setRows(isNaN(value) ? undefined : value);
                                }
                                }
                                placeholder="Enter no. of Rows"
                                className={style}
                                min={1}
                                max={30}
                            />
                        </div>
                        <div className="w-full">
                            <label className="block font-medium">Seat Columns</label>
                            <input
                                type="number"
                                value={cols ?? ""}
                                onChange={(e) => {
                                    const value = Math.min(30, Math.max(1, parseInt(e.target.value)));
                                    setCols(isNaN(value) ? undefined : value);
                                }
                                }
                                placeholder="Enter no. of Columns"
                                className={style}
                                min={1}
                                max={30}
                            />
                        </div>

                    </div>
                    <div className="text-red-500 text-sm">{error}</div>
                    <button
                        onClick={generateLayout}
                        className="mt-2 w-full bg-[#1568e3] text-white px-4 py-2 rounded-full hover:bg-[#0d4eaf]"
                    >
                        Generate Layout
                    </button>
                </div>

            )}
            {seatLayout &&
                <>
                    <div className="flex items-center mt-5 gap-4">
                        <div className="w-8 pr-1"></div>
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
                            {Array.from({length:cols!}).map((_, i) =>(
                                <div onClick={() => {seatLayout.layout.map((_, rowIdx) => {cycleSeatType(rowIdx, i)})}}
                                     key={i} className="select-none flex items-center justify-center font-bold w-7 h-7 text-gray-600 cursor-pointer">{i+1}</div>
                            ))}
                        </div>
                    </div>
                    {seatLayout.layout.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-4">
                            {/* Row label */}
                            <div onClick={() => {row.map((_, colIdx) => {cycleSeatType(rowIdx, colIdx)} )}}
                                 className="w-8 text-right pr-1 select-none cursor-pointer font-semibold text-gray-600">{String.fromCharCode(65 + rowIdx)}</div>

                            <div className="grid gap-1 my-1" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
                                {row.map((seat, colIdx) => (
                                    <div
                                        key={`${rowIdx}-${colIdx}`}
                                        className={`w-7 h-7 rounded-xs select-none cursor-pointer ${getSeatColor(seat.type)} flex items-center justify-center text-white text-[11px] font-medium`}
                                        onClick={() => cycleSeatType(rowIdx, colIdx)}
                                        title={`Row ${rowIdx + 1}, Col ${colIdx + 1}`}
                                    >
                                        {colIdx + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center mt-6 gap-4">
                        <div className="w-6 h-6 rounded-xs select-none bg-green-600 "></div>
                        <div className="text-sm font-medium text-gray-500">Regular</div>
                        <div className="w-6 h-6 rounded-xs select-none bg-yellow-500 "></div>
                        <div className="text-sm font-medium text-gray-500">Premium</div>
                        <div className="w-6 h-6 rounded-xs select-none bg-gray-300 "></div>
                        <div className="text-sm font-medium text-gray-500">Not available for booking</div>
                    </div>

                    {event === "theatres" &&
                        <>
                            <svg
                                viewBox="0 0 800 100"
                                className="w-[800px] mt-15 h-[100px] scale-y-[-1] relative"
                                fill="none"
                                stroke="black"
                                strokeWidth="10"
                            >
                                <path d="M10,90 Q400,0 790,90" />
                            </svg>
                            <div className="relative font-bold bottom-22">SCREEN</div>
                        </>
                    }

                    <div className=" mt-8 flex gap-4">
                        <button
                            onClick={handleSave}
                            className=" px-4 cursor-pointer py-2 rounded-sm bg-green-600 text-white hover:bg-green-700"
                        >
                            {event === "trains" && "Save"}
                            {event === "theatres" && "Add Airing Details"}
                        </button>
                        <button
                            onClick={() => setSeatLayout(null)}
                            className=" px-4 py-2 cursor-pointer rounded-sm bg-gray-500 text-white hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                </>
            }
        </div>
    )
}