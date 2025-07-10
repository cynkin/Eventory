'use client'
import { useSession, signOut } from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import Link from "next/link";
import {UserRound, ChevronRight, Settings, Tickets, MessageCircleQuestion} from "lucide-react";
import { usePathname } from 'next/navigation'
import {useEffect, useState} from "react";
import {getUser} from "@/utils/getFromDb";

function capitalize(str: string) {
    if (!str) return "";
    str = str.split(" ")[0];
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function SidePanel() {
    const pathname = usePathname();
    const { data: session, status, update } = useSession();
    const [balance, setBalance] = useState(0);

    useEffect(() => {

        async function getBalance() {
            const user = await getUser(session?.user?.id || "");
            const balance = user?.balance || 0;
            setBalance(balance);

            // await update({
            //     user:{
            //         balance: user?.balance || 0,
            //     }
            // })
        }
        if(session) getBalance();

    }, [session,]);

    console.log("balance", balance);
    if(status === "loading") return(<Spinner/>)
    if(!session) return;

    return(
        <div className="w-[500px] flex flex-col mt-3 py-5 px-5">
            <div className="pl-4">
                <div className="text-3xl font-bold ">
                    Hi, {capitalize(session.user.name || "")}
                </div>
                <div className="text-[14px] text-gray-800">
                    {session.user.email}
                </div>
            </div>
            <div className="text-center border rounded-xl border-gray-300 mt-6 pt-5 pb-3">
                <span className={`${session.user.role === 'user' ? "bg-blue-900" : session.user.role === 'vendor' ? "bg-[#ffba4c]" : "bg-red-600"} px-2 text-[13px] text-white font-[500] text-sm py-1 rounded-sm`}>
                    {capitalize(session.user.role || "")}
                </span>
                <div className="mt-4 mb-1 text-sm font-[500]">Current Credits</div>
                <div className="text-2xl text-center font-extrabold">
                    &#8377; {balance}
                </div>
            </div>
            <Link href="/account/profile" className={`p-3 ${pathname.endsWith("/profile") ? "border-2 border-blue-600" : " border border-gray-300"} flex items-center justify-between text-left rounded-xl mt-9`}>
                <UserRound className=""/>
                <div className=" text-gray-800">
                    <div className="px-3 w-full">
                        <div className="font-semibold">Profile</div>
                        {session.user.role === 'vendor' ?
                                <div className="text-xs mt-0.5">View your personal details and other documents</div>
                            :
                                <div className="text-xs mt-0.5">Provide your personal details and travel documents</div>
                        }
                    </div>
                </div>
                <ChevronRight className=""/>
            </Link>
            <Link href="/account/history" className={`p-3 ${pathname.endsWith("/history") ? "border-2 border-blue-600" : " border border-gray-300"} flex items-center justify-between text-left rounded-xl mt-4`}>
                <Tickets className=""/>
                <div className=" text-gray-800">
                    <div className="w-full px-3">
                    {session.user.role === 'vendor' ?
                        <>
                            <div className="font-semibold">Event Management and History</div>
                            <div className="text-xs mt-0.5">View previously created events</div>
                        </>
                    :
                        <>
                            <div className="font-semibold">Booking and Transaction History</div>
                            <div className="text-xs mt-0.5">View previously attended events</div>
                        </>
                    }
                    </div>

                </div>
                <ChevronRight className=""/>
            </Link>

            <Link href="/account/settings" className={`p-3 ${pathname.endsWith("/settings") ? "border-2 border-blue-600" : " border border-gray-300"} flex items-center justify-center text-left rounded-xl mt-4`}>
                <Settings className=""/>
                <div className=" text-gray-800 w-full px-3">
                    <div className="font-semibold">Security and Settings</div>
                    <div className="text-xs mt-0.5">Update your email and password</div>
                </div>
                <ChevronRight className=""/>
            </Link>

            {session.user.role === 'user' &&
                <Link href="/account/help" className={`p-3 ${pathname.endsWith("/help") ? "border-2 border-blue-600" : " border border-gray-300"} flex items-center justify-center text-left rounded-xl mt-4`}>
                    <MessageCircleQuestion className=""/>
                    <div className=" text-gray-800 px-3 w-full">
                        <div className="font-semibold">Help and Feedback</div>
                        <div className="text-xs mt-0.5">Get customer help and personalized support</div>
                    </div>
                    <ChevronRight className=""/>
                </Link>
            }
            <div className="flex justify-center mt-8">
                <button
                    className="p-2 text-[#1568e3] hover:bg-[#ebf4fd] cursor-pointer font-bold rounded-full w-[90%] transition-all duration-100" onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                </button>
            </div>
        </div>
    )
}