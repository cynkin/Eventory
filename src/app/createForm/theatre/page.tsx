'use client';
import { Suspense } from "react";
import TheatreForm from "@/myComponents/Form/TheatreForm"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <TheatreForm/>
        </Suspense>
    )
}