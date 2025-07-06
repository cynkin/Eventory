'use client';

import { useEffect, useState } from 'react';
import { useFormContext, useController } from 'react-hook-form';

interface Station {
    id: number;
    name: string;
    code: string;
    state: string;
}

export default function StationAutocomplete({ name }: { name: string }) {
    const { control } = useFormContext();
    const { field } = useController({ name, control });
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<Station[]>([]);

    useEffect(() => {
        if (!query) {
            setOptions([]);
            return;
        }

        const timeout = setTimeout(async () => {
            const res = await fetch(`/api/stations?q=${query}`);
            const data = await res.json();
            setOptions(data.stations);
        }, 250);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="w-2/3 relative">
            <input
                type="text"
                value={field.value}
                onChange={(e) => {
                    field.onChange(e.target.value);
                    setQuery(e.target.value);
                }}
                className="w-full font-bold border py-2 px-3 mt-1 rounded  focus:outline-none focus:ring-[1.7px] focus:ring-gray-900"
                placeholder="Enter Station Name"
            />
            {options.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 shadow-md mt-1 rounded-md max-h-60 overflow-auto">
                    {options.map((station) => (
                        <li
                            key={station.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                field.onChange(`${station.name} - ${station.code}`);
                                setOptions([]);
                            }}
                        >
                            <div className="flex justify-between">
                                <div className="font-[500]">{station.name}</div>
                                <div className="text-gray-500 font-[600]">{station.code}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
