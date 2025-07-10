'use client';
import { Suspense } from "react";
import { SessionProvider } from 'next-auth/react';
import SeatSelection from "@/myComponents/SeatSelection"
export default function Page() {
    return (
        <SessionProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <SeatSelection/>
            </Suspense>
        </SessionProvider>
    );
}