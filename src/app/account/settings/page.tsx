'use client'
import {SessionProvider} from "next-auth/react";
import SecurityPage from "@/myComponents/Account/SecurityPage";

export default function ProfilePage() {
    return (
        <div className="">
            <SessionProvider>
                <div className="flex xl:px-44 text-[#151515] transition-all duration-1100">
                    <SecurityPage/>
                </div>
            </SessionProvider>
        </div>
    )
}