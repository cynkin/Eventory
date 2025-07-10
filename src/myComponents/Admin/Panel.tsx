import Image from 'next/image'
import logo from "@/images/logo.png"
import {
    BriefcaseBusiness,
    ChartNoAxesColumn,
    Clapperboard,
    MicVocal,
    TicketPercent,
    Tickets,
    TicketsPlane,
    Train,
    UserRound
} from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation";

const style = "text-sm my-1 w-full cursor-pointer rounded-lg transition-all duration-300 flex items-center space-x-9 py-3 pl-2 pr-2 text-gray-700";

const sections = [
    {
        label: "DASHBOARD",
        items: [
            { key: "stats", icon: ChartNoAxesColumn, text: "Statistics" }
        ]
    },
    {
        label: "ACCOUNTS",
        items: [
            { key: "users", icon: UserRound, text: "Users" },
        ]
    },
    {
        label: "EVENTS",
        items: [
            { key: "movies", icon: Clapperboard, text: "Movies" },
            { key: "concerts", icon: MicVocal, text: "Concerts" },
            { key: "trains", icon: Train, text: "Trains" }
        ]
    },
    {
        label: "TRANSACTIONS",
        items: [
            { key: "movieTickets", icon: Tickets, text: "Movies" },
            { key: "concertTickets", icon: TicketPercent, text: "Concerts" },
            { key: "trainTickets", icon: TicketsPlane, text: "Trains" }
        ]
    }
];

export default function Panel() {
    const router = useRouter();
    const [current, setCurrent] = useState('stats');

    const handleClick = (key: string) => () => {
        setCurrent(key);
        router.push(`/?q=${key}`);
    }

    return (
        <div className="bg-white shadow w-fit h-screen py-5 pl-5 pr-3">
            <Image src={logo} alt="logo" className="mt-1 mx-2 mb-6" width={120} height={110} />
            <div className="flex flex-col font-medium mt-5 text-gray-400">
                {sections.map(section => (
                    <div className="mb-3" key={section.label}>
                        <div>{section.label}</div>
                        {section.items.map(item => {
                            const isActive = current === item.key;
                            const ItemIcon = item.icon;
                            return (
                                <div
                                    key={item.key}
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleClick(item.key)}
                                    className={`${style} ${isActive ? 'bg-cyan-500 text-white' : ''}`}
                                >
                                    <ItemIcon className="ml-1" />
                                    <div className="mr-14">{item.text}</div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
