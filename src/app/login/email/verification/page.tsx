'use client';
import { Suspense } from "react";
import EmailVerification from "@/myComponents/Suspense/EmailVerification"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <EmailVerification/>
        </Suspense>
    )
}