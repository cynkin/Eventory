'use client';
import { Suspense } from "react";
import CreatePassword from "@/myComponents/Suspense/CreatePassword"
export default function Page() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePassword/>
        </Suspense>
    )
}