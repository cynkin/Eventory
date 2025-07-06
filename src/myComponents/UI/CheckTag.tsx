'use client'
import {Tags} from "lucide-react";
import Link from "next/link";
import {useSession} from "next-auth/react";
import Spinner from "@/myComponents/UI/Spinner";

export default function CheckTag() {
    const { data: session, status } = useSession();
    if(status === "loading") return(<Spinner/>)


    return(
        <>
            {!session &&
            <div className="flex flex-row justify-between items-center m-8 rounded-2xl xl:mx-52 bg-[#191e3b] transition-all duration-1000 shadow-lg">
                <div className="flex flex-row items-center">
                    <div className=" m-2 mr-6 rounded-full bg-[#ffc94c] flex justify-center items-center">
                        <Tags className="w-8 h-8 m-2 text-[#191e3b]"/>
                    </div>
                    <div className="text-white text-lg font-medium tracking-wide">
                        Sign in now to get &#8377; 1,000 on account creation!
                    </div>
                </div>
                <div>
                    <Link href="/login/email" className="mx-4 bg-[#1568e3] rounded-3xl px-4 py-1.5 text-white text-sm
                         transition-all duration-200 hover:bg-[#0d4eaf]">
                        Sign in
                    </Link>
                </div>
            </div>
            }
        </>
    )
}