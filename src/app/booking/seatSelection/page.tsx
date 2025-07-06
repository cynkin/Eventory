'use client';
import { SessionProvider } from 'next-auth/react';
import SeatSelection from "@/myComponents/SeatSelection"
export default function Page() {
    return (
        <SessionProvider>
            <SeatSelection/>
        </SessionProvider>
    );
}