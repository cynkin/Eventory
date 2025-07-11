"use client"
import GoogleSuccessPage from "@/myComponents/Suspense/GoogleSuccessPage"
import { Suspense } from "react";
export default function GoogleAuthSuccessPage() {

    return (
        <Suspense>
            <GoogleSuccessPage/>
        </Suspense>
    )
}
