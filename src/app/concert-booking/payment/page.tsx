'use client';
import { Suspense } from "react";
import ConcertPayment from "@/myComponents/Suspense/ConcertPayment"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <ConcertPayment/>
        </Suspense>
    )
}