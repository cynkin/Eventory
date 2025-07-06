"use client";
import { useFieldArray, useFormContext } from "react-hook-form";

const style = "w-full focus:outline-none focus:ring-[1.7px] focus:ring-gray-900 focus:placeholder:text-gray-700 border py-2 px-3 mt-1 rounded"

export default function TimeSlotFields({ nestIndex }: { nestIndex: number }) {
    const { control, register } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: `details.${nestIndex}.slots`
    });

    return (
        <div className="ml-8 mt-5 pl-5 border-l-2 border-gray-300">
            <div className="flex flex-row justify-between items-center">
                <label className=" font-medium">Time Slots</label>
                <button type="button" onClick={() => {
                    if (fields.length > 1) remove(fields.length-1)}} className="cursor-pointer font-medium hover:font-bold text-red-600">- TimeSlot</button>
            </div>
            {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2 mt-2">
                    <input
                        type="time"
                        {...register(`details.${nestIndex}.slots.${i}.time`)}
                        className={style}
                    />
                    <input
                        type="text"
                        {...register(`details.${nestIndex}.slots.${i}.language`)}
                        className={style}
                        placeholder="English"
                    />

                </div>
            ))}
            <button
                type="button"
                onClick={() => append({ time: "", language: "" })}
                className="mb-2 mt-4 cursor-pointer font-medium hover:font-bold text-blue-600"
            >
                + Add Time Slot
            </button>
        </div>
    );
}
