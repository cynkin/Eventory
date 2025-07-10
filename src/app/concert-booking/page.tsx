'use client';
import { Suspense } from "react";
import ConcertBooking from "@/myComponents/Suspense/ConcertBooking"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <ConcertBooking/>
        </Suspense>
    )
}