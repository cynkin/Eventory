'use client'
import {SessionProvider} from "next-auth/react";
import ProfilePage from "@/myComponents/Account/ProfilePage";
import { Suspense } from "react";

export default function Account() {
    return (
        <div className="">
            <Suspense fallback={<div>Loading...</div>}>
                <SessionProvider>
                    <div className="flex xl:px-44 text-[#151515] transition-all duration-1100">
                        <ProfilePage/>
                    </div>
                </SessionProvider>
            </Suspense>
        </div>
    )
}