'use client'
import {SessionProvider} from "next-auth/react";
import ProfilePage from "@/myComponents/Account/ProfilePage";

export default function Account() {
    return (
        <div className="">
            <SessionProvider>
                <div className="flex xl:px-44 text-[#151515] transition-all duration-1100">
                    <ProfilePage/>
                </div>
            </SessionProvider>
        </div>
    )
}