'use client'
import Event from "@/myComponents/Event/Event";
import CheckTag from "./UI/CheckTag"
import { SessionProvider } from 'next-auth/react'

export default function Main() {
    return(
        <>
            <SessionProvider>
                <CheckTag/>
                <div className="">
                    <Event type="train" />
                    <Event type="movie" />
                    <Event type="concert" />
                </div>
            </SessionProvider>
            <div>

            </div>
        </>
    )
}