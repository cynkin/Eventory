'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";
import { CircleUserRound, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {getUser} from "@/utils/getFromDb";

const style = "hover:cursor-pointer text-[#222] tracking-wide text-nowrap font-bold text-sm ml-2 mr-8 flex items-center hover:text-[#1568e3]";

function capitalize(str: string) {
    if (!str) return "";
    str = str.split(" ")[0];
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function Profile() {
    const { data: session, status } = useSession();
    const [showEventDropdown, setShowEventDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const eventRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const [balance, setBalance] = useState(session?.user?.balance || 0);
    const [pic, setPic] = useState("");

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (eventRef.current && !eventRef.current.contains(event.target as Node)) {
                setShowEventDropdown(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

        async function getPic (){
            const res = await fetch(`/api/get/contact-details`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId: session?.user?.id})
                })

            if(!res.ok) throw new Error("Something went wrong");
            const data = await res.json();

            if(!data || !data.profile_pic) return;
            setPic(data.profile_pic);
        }
        if(session) {
            getBalance();
            getPic();
        }

    }, [session]);

    if (status === "loading") return <Spinner />;

    return (
        <>
            {session ? (
                <div className="flex items-center">
                    <div className="relative mr-4" ref={eventRef}>
                        {session.user.role === 'vendor' &&
                            <button
                                onClick={() => setShowEventDropdown(!showEventDropdown)}
                                className="my-2 focus:outline-none flex flex-row items-center rounded-full cursor-pointer bg-[#191e3b] hover:bg-[#ffc94c] transition-all duration-200 shadow-lg"
                            >
                                <div className="p-2 m-2 rounded-full bg-[#ffc94c]">
                                    <Pencil className="w-4 h-4 text-[#191e3b]" />
                                </div>
                                <div className="mr-4 text-white text-sm text-nowrap">Create Event</div>
                            </button>
                        }

                        {showEventDropdown && (
                            <div className="absolute right-0 mt-2 w-50 bg-white border rounded-lg shadow-lg z-10 py-1">
                                {["movie", "concert", "train"].map((type) => (
                                    <Link
                                        key={type}
                                        href={`/createForm/${type}`}
                                        className="block text-center text-sm text-gray-900 px-4 py-2 hover:bg-gray-200 font-semibold"
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            className={`${style} focus:outline-none`}
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        >

                            {pic !== ""
                                ?
                                <div className="rounded-full border-2 w-12 h-12 mr-2 relative overflow-hidden">
                                    <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                         src={"pic"}  />
                                </div>
                                :
                                <CircleUserRound className="mr-2" />
                            }
                            {capitalize(session.user.name || "")}
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 w-90 bg-white border rounded-lg shadow-lg z-10 pb-3">
                                {pic !== "" ?
                                    <div className="flex justify-center m-2">
                                        <div className="rounded-full border-2 w-30 h-30 my-2 relative overflow-hidden">
                                                <img alt="" className="scale-100 overflow-hidden transition-all ease-in-out duration-300"  style={{ objectFit:"cover", objectPosition: "center"}}
                                                     src={pic}  />
                                        </div>
                                    </div>
                                    :
                                    <div className="flex justify-center mt-11"/>
                                }
                                <div className="text-xl text-center font-semibold">
                                    Hi, {capitalize(session.user.name || "")}
                                </div>
                                <div className="text-sm font-medium text-center text-gray-900 mb-3">{session.user.email}</div>
                                <div className="mb-4 flex justify-center text-xs font-semibold text-white">
                                    <span className={`${session.user.role === 'user' ? "bg-blue-900" : "bg-[#ffba4c]"} px-2 py-1 rounded-sm mb-3`}>
                                        {capitalize(session.user.role || "")}
                                    </span>
                                </div>
                                <div className="text-2xl text-center font-extrabold mb-4">
                                    &#8377; {balance}
                                </div>
                                <hr className="my-2" />

                                <Link
                                    href="/account/profile"
                                    className="block text-center text-sm text-gray-700 py-2 rounded hover:bg-gray-100 font-medium"
                                >
                                    Account
                                </Link>

                                <button
                                    onClick={() => {
                                        signOut({ callbackUrl: "/" });
                                        sessionStorage.clear();
                                    }}
                                    className="block w-full text-sm text-gray-700 py-2 rounded hover:bg-gray-100 font-medium text-center"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Link href="/login/email" className={`${style} text-nowrap`}>
                    Sign in
                </Link>
            )}
        </>
    );
}
