'use client'
import Event from "@/myComponents/Event/Event";
import CheckTag from "./UI/CheckTag"
import { SessionProvider } from 'next-auth/react'
import {useSession} from "next-auth/react";
import Panel from "@/myComponents/Admin/Panel";
import Content from "@/myComponents/Admin/Content";

export default function Main() {
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    return(
        <>
            {role === 'admin'
                ?
                <div className="bg-[#f1f1f1] flex flex-row w-screen h-screen overflow-hidden pr-20">
                    <Panel/>
                    <Content/>
                </div>
                :
                role !== 'admin' &&
                <SessionProvider>
                    <CheckTag/>
                    <div className="">
                        <Event type="train" />
                        <Event type="movie" />
                        <Event type="concert" />
                    </div>
                </SessionProvider>
            }
        </>
    )
}