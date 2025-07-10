'use client';
import { Suspense } from "react";
import TrainBooking from "@/myComponents/Suspense/TrainBooking"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <TrainBooking/>
        </Suspense>
    )
}