'use client';
import { Suspense } from "react";
import BookingPage from "@/myComponents/Suspense/BookingPage"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <BookingPage/>
        </Suspense>
    )
}