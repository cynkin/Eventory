"use client"
import DAuthSuccessPage from "@/myComponents/Suspense/DAuthSuccessPage"
import { Suspense } from "react";
export default function DeltaAuthSuccessPage() {

    return (
        <Suspense>
            <DAuthSuccessPage/>
        </Suspense>
    )
}
