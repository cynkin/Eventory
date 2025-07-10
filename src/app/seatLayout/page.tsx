'use client';
import { Suspense } from "react";
import SeatLayout from "@/myComponents/Suspense/SeatLayout"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <SeatLayout/>
        </Suspense>
    )
}