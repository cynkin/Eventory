'use client'
import SidePanel from "@/myComponents/Account/SidePanel";
import {SessionProvider} from "next-auth/react";
import HelpPage from "@/myComponents/Account/HelpPage";

export default function ProfilePage() {
    return (
        <div className="">
            <SessionProvider>
                <div className="flex xl:px-44 text-[#151515] transition-all duration-1100">
                    <SidePanel/>
                    <HelpPage/>
                </div>
            </SessionProvider>
        </div>
    )
}